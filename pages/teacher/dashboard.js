import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    googleFormUrl: '',
    dueDate: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Ambil info pengguna dan formulir
    fetchUserData(token);
    fetchForms(token);
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error mengambil data pengguna:', error);
    }
  };

  const fetchForms = async (token) => {
    try {
      const response = await fetch('/api/forms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error mengambil formulir:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const openCreateForm = () => {
    setEditingForm(null);
    setFormData({
      title: '',
      description: '',
      googleFormUrl: '',
      dueDate: ''
    });
    setShowFormModal(true);
  };

  const openEditForm = (form) => {
    setEditingForm(form);
    setFormData({
      title: form.title,
      description: form.description,
      googleFormUrl: form.googleFormUrl,
      dueDate: new Date(form.dueDate).toISOString().split('T')[0]
    });
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingForm(null);
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingForm 
        ? `/api/forms/${editingForm._id}` 
        : '/api/forms';
      
      const method = editingForm ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        closeFormModal();
        fetchForms(token); // Refresh daftar formulir
      } else {
        const data = await response.json();
        setError(data.message || 'Operasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
      console.error(err);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchForms(token); // Refresh daftar formulir
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal menghapus');
      }
    } catch (error) {
      console.error('Error menghapus formulir:', error);
      alert('Terjadi kesalahan saat menghapus formulir');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isFormActive = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari
    
    const formDate = new Date(dueDate);
    formDate.setHours(0, 0, 0, 0); // Set ke awal hari
    
    // Hanya aktif jika tanggal hari ini sama dengan tanggal pengerjaan
    return today.getTime() === formDate.getTime();
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchForms(token); // Refresh daftar formulir
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal mengubah status');
      }
    } catch (error) {
      console.error('Error mengubah status formulir:', error);
      alert('Terjadi kesalahan saat mengubah status formulir');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Guru</h1>
          <div className="flex items-center space-x-4">
            {user && <span className="text-gray-700">Halo, {user.name}</span>}
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Formulir Anda</h2>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Tambah Formulir Baru
              </button>
            </div>

            {forms.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada formulir</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat formulir baru.</p>
                <div className="mt-6">
                  <button
                    onClick={openCreateForm}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Tambah Formulir Baru
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {forms.map((form) => (
                    <li key={form._id} className={form.isActive ? '' : 'bg-gray-50'}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-indigo-600 truncate">
                            {form.title}
                            {!form.isActive && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Dinonaktifkan
                              </span>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex space-x-2">
                            {isFormActive(form.dueDate) ? (
                              <p className="inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Aktif
                              </p>
                            ) : (
                              <p className="inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Tidak Aktif
                              </p>
                            )}
                            <button 
                              onClick={() => toggleFormStatus(form._id, form.isActive)}
                              className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${
                                form.isActive 
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-200'
                              }`}
                            >
                              {form.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {form.description}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p className="mr-3">
                              Tanggal Pengerjaan: {new Date(form.dueDate).toLocaleDateString('id-ID')}
                            </p>
                            <button
                              onClick={() => openEditForm(form)}
                              className="mr-3 text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Formulir */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div 
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={closeFormModal}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleFormSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingForm ? 'Edit Formulir' : 'Tambah Formulir Baru'}
                  </h3>
                  
                  {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
                      <div className="text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Judul
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Deskripsi
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="googleFormUrl" className="block text-sm font-medium text-gray-700">
                        URL Google Form
                      </label>
                      <input
                        type="url"
                        name="googleFormUrl"
                        id="googleFormUrl"
                        value={formData.googleFormUrl}
                        onChange={handleChange}
                        required
                        placeholder="https://docs.google.com/forms/d/e/.../viewform"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                        Tanggal Pengerjaan
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingForm ? 'Perbarui' : 'Buat'}
                  </button>
                  <button
                    type="button"
                    onClick={closeFormModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
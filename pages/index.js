import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error('Error mengambil formulir:', error);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (formUrl) => {
    window.open(formUrl, '_blank');
  };

  const isFormActive = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari
    
    const formDate = new Date(dueDate);
    formDate.setHours(0, 0, 0, 0); // Set ke awal hari
    
    // Hanya aktif jika tanggal hari ini sama dengan tanggal pengerjaan
    return today.getTime() === formDate.getTime();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat formulir...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Koleksi Google Forms</title>
        <meta name="description" content="Koleksi Google Forms" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Koleksi Google Forms</h1>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada formulir tersedia</h3>
              <p className="mt-1 text-sm text-gray-500">Periksa kembali nanti untuk formulir baru.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {forms.map((form) => (
                <div key={form._id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
                    <p className="mt-2 text-sm text-gray-500">{form.description}</p>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Tanggal Pengerjaan: {new Date(form.dueDate).toLocaleDateString('id-ID')}
                      </p>
                      <div className="mt-2">
                        {isFormActive(form.dueDate) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Tidak Aktif
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => openForm(form.googleFormUrl)}
                        disabled={!isFormActive(form.dueDate)}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          isFormActive(form.dueDate)
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isFormActive(form.dueDate) ? 'Buka Formulir' : 'Tidak Dapat Dikerjakan'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TeacherIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect ke halaman login
    router.push('/login');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Mengarahkan ke halaman login...</p>
    </div>
  );
}
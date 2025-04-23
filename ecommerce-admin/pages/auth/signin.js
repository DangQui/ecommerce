import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error);
    }
  }, [router.query.error]);

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Đăng nhập</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
          {error}
        </div>
      )}
      <button
        onClick={handleSignIn}
        style={{ padding: '10px 20px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Đăng nhập bằng Google
      </button>
    </div>
  );
}
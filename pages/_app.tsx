import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useAuthStore } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0b0e27] pt-16">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default App;

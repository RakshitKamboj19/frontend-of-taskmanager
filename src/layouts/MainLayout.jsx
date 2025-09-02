import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const MainLayout = ({ Dark, setDark, children }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDark(savedTheme === 'dark');
    }
  }, [setDark]);

  useEffect(() => {
    localStorage.setItem('theme', Dark ? 'dark' : 'light');
  }, [Dark]);

  return (
    <div
      className={`relative min-h-screen w-screen overflow-x-hidden ${Dark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      {/* Soft gradient backdrop */}
      {!Dark && (
        <div className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: 'var(--bg-gradient)' }} />
      )}
      <Navbar Dark={Dark} setDark={setDark} />
      <main className="overflow-y-auto px-4 sm:px-6 md:px-8">{children}</main>
    </div>
  );
};

export default MainLayout;

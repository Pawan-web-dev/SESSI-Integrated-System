import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const MainLayout: React.FC = () => {
  return (
    <div className='flex min-h-screen bg-[#faf9f5]'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='p-8 flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

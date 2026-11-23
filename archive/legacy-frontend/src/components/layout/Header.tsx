import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { User, Bell, Search } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className='h-16 bg-white border-b border-[#cfe4d5] flex items-center justify-between px-8'>
      <div className='flex items-center gap-4 bg-[#f4fbf6] px-4 py-2 rounded-full border border-[#cfe4d5] w-96'>
        <Search size={18} className='text-[#3d5a45]' />
        <input 
          type='text' 
          placeholder='Search employees, challans...' 
          className='bg-transparent border-none focus:outline-none text-sm w-full text-[#17321f]'
        />
      </div>

      <div className='flex items-center gap-6'>
        <button className='relative text-[#3d5a45] hover:text-[#067a35] transition-colors'>
          <Bell size={22} />
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full'>3</span>
        </button>
        
        <div className='flex items-center gap-3 pl-6 border-l border-[#cfe4d5]'>
          <div className='flex flex-col text-right'>
            <span className='text-sm font-bold text-[#0b4d24]'>{user?.name}</span>
            <span className='text-[11px] text-[#3d5a45]'>{user?.employerNo || 'Administrator'}</span>
          </div>
          <div className='w-10 h-10 bg-[#dff3e5] rounded-full flex items-center justify-center text-[#067a35]'>
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

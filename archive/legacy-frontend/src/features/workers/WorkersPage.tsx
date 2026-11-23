import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const WorkersPage: React.FC = () => {
  const { workers } = useAppSelector((state) => state.workers);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Employee Management</h2>
          <p className='text-sm text-[#3d5a45]'>View and manage your registered employees</p>
        </div>
        <Button className='flex items-center gap-2'>
          <Plus size={18} />
          Register Employee
        </Button>
      </div>

      <Table headers={['Name', 'CNIC', 'Designation', 'Type', 'Status', 'Actions']}>
        {workers.map((worker) => (
          <tr key={worker.id} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{worker.name}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{worker.cnic}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{worker.designation}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{worker.type}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                worker.status === 'Active' ? 'bg-[#dff3e5] text-[#067a35]' : 'bg-[#fdecea] text-[#b00020]'
              }`}>
                {worker.status}
              </span>
            </td>
            <td className='px-6 py-4'>
              <div className='flex gap-2'>
                <button className='p-2 text-[#0b5fa8] hover:bg-[#e4f0fb] rounded-md transition-colors'>
                  <Edit2 size={16} />
                </button>
                <button className='p-2 text-[#b00020] hover:bg-[#fdecea] rounded-md transition-colors'>
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

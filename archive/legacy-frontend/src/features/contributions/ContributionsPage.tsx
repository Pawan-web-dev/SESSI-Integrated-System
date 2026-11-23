import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { FilePlus } from 'lucide-react';

export const ContributionsPage: React.FC = () => {
  const { contributions } = useAppSelector((state) => state.contributions);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Monthly Contributions</h2>
          <p className='text-sm text-[#3d5a45]'>Manage and submit your company contributions</p>
        </div>
        <Button className='flex items-center gap-2'>
          <FilePlus size={18} />
          Create New Contribution
        </Button>
      </div>

      <Table headers={['Month', 'Employees', 'Total Amount', 'Status', 'Challan No.', 'Actions']}>
        {contributions.map((c) => (
          <tr key={c.id} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{c.month}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{c.workerCount}</td>
            <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR {c.totalAmount}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                c.status === 'Paid' ? 'bg-[#dff3e5] text-[#067a35]' :
                c.status === 'Unpaid' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {c.status}
              </span>
            </td>
            <td className='px-6 py-4 text-[#3d5a45]'>{c.challanNo || '---'}</td>
            <td className='px-6 py-4'>
              <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>
                {c.status === 'Unpaid' ? 'Pay Now' : 'View Receipt'}
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

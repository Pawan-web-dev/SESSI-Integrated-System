import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';

const ContributionsPages: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Monthly Contributions</h2>
          <p className='text-sm text-[#3d5a45]'>Manage and submit your company contributions</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/contributions/monthly'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Monthly Contribution
          </NavLink>
          <NavLink
            to='/contributions/create'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Create Contribution
          </NavLink>
          <NavLink
            to='/contributions/submitted'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Submitted
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const MonthlyContributionPage: React.FC = () => {
  const { contributions } = useAppSelector((state) => state.contributions);

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Monthly Contribution Records</h3>
      <Table headers={['Month', 'Employees', 'Total Amount', 'Status', 'Challan No.', 'Submitted Date', 'Actions']}>
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
            <td className='px-6 py-4 text-[#3d5a45]'>{c.submittedDate || '---'}</td>
            <td className='px-6 py-4'>
              <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>
                {c.status === 'Unpaid' ? 'Pay Now' : 'View Receipt'}
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const CreateContributionPage: React.FC = () => {
  const mockEmployees = [
    { n: '1', name: 'Ahmed Raza', cnic: '42101-1234567-1', mob: '0300-1234567', type: 'PERMANENT', wage: '40000', days: '30', amt: '2220' },
    { n: '2', name: 'Sana Malik', cnic: '42201-2345678-2', mob: '0321-2345678', type: 'PERMANENT', wage: '37000', days: '30', amt: '2220' },
    { n: '3', name: 'Imran Shah', cnic: '42301-3456789-3', mob: '0333-3456789', type: 'CONTRACTUAL', wage: '42000', days: '30', amt: '2220' },
    { n: '3', name: 'Farah Naz', cnic: '42401-5678901-5', mob: '0345-5678901', type: 'PERMANENT', wage: '37000', days: '30', amt: '2220' },
    { n: '5', name: 'Zeeshan Qureshi', cnic: '42101-7890123-7', mob: '0312-7890123', type: 'PERMANENT', wage: '41000', days: '30', amt: '2220' },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Create New Contribution</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <Input label='Contribution Month' placeholder='November, 2026' />
        <Input label='Number of Employees' value='48' disabled />
        <Input label='Total Contribution Amount' value='PKR 106,560' disabled />
        <Input label='Service Charge' value='PKR 40' disabled />
      </div>
      <h4 className='font-semibold text-[#17321f] mb-3'>Employee Details</h4>
      <div className='overflow-x-auto'>
        <Table headers={['#', 'Name', 'CNIC', 'Mobile', 'Type', 'Wage', 'Days', 'Amount']}>
          {mockEmployees.map((emp) => (
            <tr key={emp.n} className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 text-[#3d5a45]'>{emp.n}</td>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>{emp.name}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{emp.cnic}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{emp.mob}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{emp.type}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR {emp.wage}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{emp.days}</td>
              <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR {emp.amt}</td>
            </tr>
          ))}
        </Table>
      </div>
      <div className='flex justify-end gap-3 mt-6'>
        <Button variant='ghost'>Save as Draft</Button>
        <Button className='flex items-center gap-2'>
          Submit Contribution
        </Button>
      </div>
    </Card>
  );
};

export const SubmittedContributionsPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Submitted Contributions</h3>
      <Table headers={['Reference', 'Month', 'Employees', 'Amount', 'Status', 'Submitted Date', 'Actions']}>
        <tr className='hover:bg-[#f4fbf6] transition-colors'>
          <td className='px-6 py-4 font-semibold text-[#17321f]'>CNTR-2026-00123</td>
          <td className='px-6 py-4 text-[#3d5a45]'>November, 2026</td>
          <td className='px-6 py-4 text-[#3d5a45]'>48</td>
          <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 106,560</td>
          <td className='px-6 py-4'>
            <span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700'>
              Pending Approval
            </span>
          </td>
          <td className='px-6 py-4 text-[#3d5a45]'>17 Nov 2026 10:45 AM</td>
          <td className='px-6 py-4'>
            <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View Details</Button>
          </td>
        </tr>
      </Table>
    </Card>
  );
};

export default ContributionsPages;
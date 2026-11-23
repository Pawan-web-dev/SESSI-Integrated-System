import React from 'react';
import { Card } from '../../components/ui/Card';

export const DashboardPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold text-[#0b4d24]'>Dashboard Overview</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <h3 className='text-[#3d5a45] text-sm font-semibold'>Active Employees</h3>
          <p className='text-3xl font-bold text-[#067a35] mt-2'>48</p>
        </Card>
        <Card>
          <h3 className='text-[#3d5a45] text-sm font-semibold'>Monthly Contributions</h3>
          <p className='text-3xl font-bold text-[#0b5fa8] mt-2'>PKR 106,560</p>
        </Card>
        <Card>
          <h3 className='text-[#3d5a45] text-sm font-semibold'>Pending Approvals</h3>
          <p className='text-3xl font-bold text-[#b45309] mt-2'>3</p>
        </Card>
        <Card>
          <h3 className='text-[#3d5a45] text-sm font-semibold'>Total Registered</h3>
          <p className='text-3xl font-bold text-[#067a35] mt-2'>120</p>
        </Card>
      </div>
    </div>
  );
};

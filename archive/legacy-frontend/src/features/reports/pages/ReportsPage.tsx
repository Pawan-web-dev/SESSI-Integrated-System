import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { FileText, Download } from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Reports & Statements</h2>
          <p className='text-sm text-[#3d5a45]'>Generate and view contribution and employee reports</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/reports/contribution'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Contribution Report
          </NavLink>
          <NavLink
            to='/reports/employee'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Employee Report
          </NavLink>
          <NavLink
            to='/reports/statement'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Statement of Account
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const ContributionReportPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Contribution Report</h3>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>From Month</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='January, 2026'>January, 2026</option>
            <option value='February, 2026'>February, 2026</option>
            <option value='March, 2026'>March, 2026</option>
            <option value='April, 2026'>April, 2026</option>
            <option value='May, 2026'>May, 2026</option>
            <option value='June, 2026'>June, 2026</option>
            <option value='July, 2026'>July, 2026</option>
            <option value='August, 2026'>August, 2026</option>
            <option value='September, 2026'>September, 2026</option>
            <option value='October, 2026'>October, 2026</option>
            <option value='November, 2026' selected>November, 2026</option>
          </select>
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>To Month</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='January, 2026'>January, 2026</option>
            <option value='February, 2026'>February, 2026</option>
            <option value='March, 2026'>March, 2026</option>
            <option value='April, 2026'>April, 2026</option>
            <option value='May, 2026'>May, 2026</option>
            <option value='June, 2026'>June, 2026</option>
            <option value='July, 2026'>July, 2026</option>
            <option value='August, 2026'>August, 2026</option>
            <option value='September, 2026'>September, 2026</option>
            <option value='October, 2026'>October, 2026</option>
            <option value='November, 2026' selected>November, 2026</option>
          </select>
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Report Type</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='summary'>Summary Report</option>
            <option value='detailed'>Detailed Report</option>
            <option value='comparison'>Month-over-Month Comparison</option>
          </select>
        </div>
        <div className='flex items-end'>
          <Button className='flex items-center gap-2 w-full'>
            <FileText size={18} />
            Generate Report
          </Button>
        </div>
      </div>

      <div className='border-t border-[#cfe4d5] pt-6'>
        <h4 className='font-semibold text-[#17321f] mb-4'>Report Preview</h4>
        <div className='space-y-4'>
          <div className='grid grid-cols-4 gap-4 mb-4'>
            <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
              <p className='text-sm text-[#3d5a45]'>Total Contribution</p>
              <p className='text-2xl font-bold text-[#0b4d24]'>PKR 608,480</p>
            </div>
            <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
              <p className='text-sm text-[#3d5a45]'>Total Service Charge</p>
              <p className='text-2xl font-bold text-[#0b4d24]'>PKR 240</p>
            </div>
            <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
              <p className='text-sm text-[#3d5a45]'>Total Employees</p>
              <p className='text-2xl font-bold text-[#0b4d24]'>283</p>
            </div>
            <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
              <p className='text-sm text-[#3d5a45]'>Average per Month</p>
              <p className='text-2xl font-bold text-[#0b4d24]'>PKR 101,413</p>
            </div>
          </div>
          <Table headers={['Month', 'Employees', 'Total Contribution', 'Service Charge', 'Total Amount', 'Status']}>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>November, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>48</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 106,560</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 106,600</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-700'>Approved</span></td>
            </tr>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>October, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>48</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 106,560</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 106,600</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Paid</span></td>
            </tr>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>September, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>46</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 102,120</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 102,160</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Paid</span></td>
            </tr>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>August, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>47</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 99,900</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 99,940</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Paid</span></td>
            </tr>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>July, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>47</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 97,680</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 97,720</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Paid</span></td>
            </tr>
            <tr className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>June, 2026</td>
              <td className='px-6 py-4 text-[#3d5a45]'>46</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 95,460</td>
              <td className='px-6 py-4 text-[#3d5a45]'>PKR 40</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR 95,500</td>
              <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Paid</span></td>
            </tr>
          </Table>
        </div>
        <div className='flex justify-end gap-3 mt-6'>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export PDF
          </Button>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export Excel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const EmployeeReportPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Employee Report</h3>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Filter by Status</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='all'>All Employees</option>
            <option value='Active'>Active</option>
            <option value='Inactive'>Inactive</option>
            <option value='Separated'>Separated</option>
          </select>
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Filter by Type</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='all'>All Types</option>
            <option value='Permanent'>Permanent</option>
            <option value='Contractual'>Contractual</option>
            <option value='Daily Wages'>Daily Wages</option>
          </select>
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Department</label>
          <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
            <option value='all'>All Departments</option>
            <option value='Production'>Production</option>
            <option value='Quality'>Quality Control</option>
            <option value='Administration'>Administration</option>
          </select>
        </div>
        <div className='flex items-end'>
          <Button className='flex items-center gap-2 w-full'>
            <FileText size={18} />
            Generate Report
          </Button>
        </div>
      </div>

      <div className='border-t border-[#cfe4d5] pt-6'>
        <h4 className='font-semibold text-[#17321f] mb-4'>Employee Summary</h4>
        <div className='grid grid-cols-4 gap-4 mb-4'>
          <div className='bg-[#e3f2e8] border border-[#cfe4d5] rounded-lg p-4'>
            <p className='text-sm text-[#3d5a45]'>Active Employees</p>
            <p className='text-2xl font-bold text-[#067a35]'>36</p>
          </div>
          <div className='bg-[#e4f0fb] border border-[#cfe4d5] rounded-lg p-4'>
            <p className='text-sm text-[#3d5a45]'>Contractual</p>
            <p className='text-2xl font-bold text-[#0b5fa8]'>6</p>
          </div>
          <div className='bg-[#fdf0dc] border border-[#cfe4d5] rounded-lg p-4'>
            <p className='text-sm text-[#3d5a45]'>Daily Wages</p>
            <p className='text-2xl font-bold text-[#b45309]'>4</p>
          </div>
          <div className='bg-[#fdecea] border border-[#cfe4d5] rounded-lg p-4'>
            <p className='text-sm text-[#3d5a45]'>Separated</p>
            <p className='text-2xl font-bold text-[#b00020]'>2</p>
          </div>
        </div>
        <Table headers={['#', 'Name', 'CNIC', 'Designation', 'Type', 'Status', 'Joined', 'Monthly Wage', 'Actions']}>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>1</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>Ahmed Raza</td>
            <td className='px-6 py-4 text-[#3d5a45]'>42101-1234567-1</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Production Supervisor</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Permanent</td>
            <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Active</span></td>
            <td className='px-6 py-4 text-[#3d5a45]'>01/02/2019</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 40,000</td>
            <td className='px-6 py-4'><Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View</Button></td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>2</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>Sana Malik</td>
            <td className='px-6 py-4 text-[#3d5a45]'>42201-2345678-2</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Quality Inspector</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Permanent</td>
            <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Active</span></td>
            <td className='px-6 py-4 text-[#3d5a45]'>15/06/2020</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 37,000</td>
            <td className='px-6 py-4'><Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View</Button></td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>3</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>Imran Shah</td>
            <td className='px-6 py-4 text-[#3d5a45]'>42301-3456789-3</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Machine Operator</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contractual</td>
            <td className='px-6 py-4'><span className='px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-[#dff3e5] text-[#067a35]'>Active</span></td>
            <td className='px-6 py-4 text-[#3d5a45]'>01/09/2021</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 42,000</td>
            <td className='px-6 py-4'><Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View</Button></td>
          </tr>
        </Table>
        <div className='flex justify-end gap-3 mt-6'>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export PDF
          </Button>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export Excel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const StatementOfAccountPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Statement of Account</h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>From Date</label>
          <input type='date' className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
        </div>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>To Date</label>
          <input type='date' className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
        </div>
        <div className='flex items-end'>
          <Button className='flex items-center gap-2 w-full'>
            <FileText size={18} />
            Generate Statement
          </Button>
        </div>
      </div>

      <div className='border-t border-[#cfe4d5] pt-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <h4 className='font-semibold text-[#17321f] mb-3'>Employer Details</h4>
            <div className='space-y-2 text-sm'>
              <p><span className='text-[#3d5a45]'>Employer Name: </span><span className='font-semibold text-[#17321f]'>ABC Manufacturing (Pvt.) Ltd.</span></p>
              <p><span className='text-[#3d5a45]'>Employer No.: </span><span className='font-semibold text-[#17321f]'>3-61-0001</span></p>
              <p><span className='text-[#3d5a45]'>Address: </span><span className='font-semibold text-[#17321f]'>Plot 123, Sector 45, Korangi Industrial Area, Karachi</span></p>
            </div>
          </div>
          <div>
            <h4 className='font-semibold text-[#17321f] mb-3'>Account Summary</h4>
            <div className='space-y-2 text-sm'>
              <p><span className='text-[#3d5a45]'>Opening Balance: </span><span className='font-semibold text-[#0b4d24]'>PKR 0</span></p>
              <p><span className='text-[#3d5a45]'>Total Contributions: </span><span className='font-semibold text-[#0b4d24]'>PKR 608,480</span></p>
              <p><span className='text-[#3d5a45]'>Total Service Charges: </span><span className='font-semibold text-[#0b4d24]'>PKR 240</span></p>
              <p><span className='text-[#3d5a45]'>Total Payments: </span><span className='font-semibold text-[#067a35]'>PKR 501,880</span></p>
              <p><span className='text-[#3d5a45]'>Outstanding: </span><span className='font-semibold text-[#b45309]'>PKR 106,600</span></p>
            </div>
          </div>
        </div>

        <Table headers={['Date', 'Description', 'Challan/Receipt', 'Debit', 'Credit', 'Balance']}>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>01-Jun-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Opening Balance</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>25-Jun-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - June 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-002456</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 95,500</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 95,500</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>25-Jun-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Payment - June 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>RCP-2026-006431</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#067a35]'>PKR 95,500</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>27-Jul-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - July 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-002891</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 97,720</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 97,720</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>27-Jul-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Payment - July 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>RCP-2026-006892</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#067a35]'>PKR 97,720</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>28-Aug-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - August 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-003245</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 99,940</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 99,940</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>28-Aug-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Payment - August 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>RCP-2026-007245</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#067a35]'>PKR 99,940</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>26-Sep-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - September 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-003688</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 102,160</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 102,160</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>26-Sep-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Payment - September 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>RCP-2026-007731</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#067a35]'>PKR 102,160</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>29-Oct-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - October 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-004102</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 106,600</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 106,600</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>29-Oct-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Payment - October 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>RCP-2026-008214</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#067a35]'>PKR 106,600</td>
            <td className='px-6 py-4 font-semibold text-[#0b4d24]'>PKR 0</td>
          </tr>
          <tr className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>30-Nov-2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>Contribution - November 2026</td>
            <td className='px-6 py-4 text-[#3d5a45]'>CH-2026-004512</td>
            <td className='px-6 py-4 font-semibold text-[#b00020]'>PKR 106,600</td>
            <td className='px-6 py-4 text-[#3d5a45]'>—</td>
            <td className='px-6 py-4 font-semibold text-[#b45309]'>PKR 106,600</td>
          </tr>
        </Table>
        <div className='flex justify-end gap-3 mt-6'>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export PDF
          </Button>
          <Button variant='ghost' className='flex items-center gap-2'>
            <Download size={18} />
            Export Excel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportsPage;
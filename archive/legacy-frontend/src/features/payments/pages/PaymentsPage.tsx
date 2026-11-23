import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Download, CreditCard } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Challans & Payments</h2>
          <p className='text-sm text-[#3d5a45]'>Generate challans and manage payment history</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/payments/generate'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Generate Challan
          </NavLink>
          <NavLink
            to='/payments/history'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Payment History
          </NavLink>
          <NavLink
            to='/payments/f4'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            F-4
          </NavLink>
          <NavLink
            to='/payments/f5'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            F-5
          </NavLink>
          <NavLink
            to='/payments/returns'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Return History
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const GenerateChallanPage: React.FC = () => {
  const [isPaid, setIsPaid] = React.useState(false);

  return (
    <div className='space-y-6'>
      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Generate Challan</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Contribution Month</label>
            <select className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'>
              <option value='November, 2026'>November, 2026</option>
              <option value='October, 2026'>October, 2026</option>
              <option value='September, 2026'>September, 2026</option>
            </select>
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Total Amount</label>
            <input type='text' className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' value='PKR 106,600' readOnly />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Due Date</label>
            <input type='text' className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' value='30-Nov-2026' readOnly />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Challan No.</label>
            <input type='text' className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' value='CH-2026-004512' readOnly />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button variant='ghost' onClick={() => setIsPaid(false)}>Cancel</Button>
          <Button className='flex items-center gap-2' onClick={() => setIsPaid(true)}>
            <CreditCard size={18} />
            Generate & Pay
          </Button>
        </div>
      </Card>

      {isPaid && (
        <Card>
          <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Payment Receipt</h3>
          <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
            <div className='flex items-center gap-3 text-green-700'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
              <span className='font-semibold'>Payment Successful!</span>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div><span className='text-sm text-[#3d5a45]'>Receipt No.</span><p className='font-semibold text-[#17321f]'>RCP-2026-008590</p></div>
            <div><span className='text-sm text-[#3d5a45]'>Challan No.</span><p className='font-semibold text-[#17321f]'>CH-2026-004512</p></div>
            <div><span className='text-sm text-[#3d5a45]'>Month</span><p className='font-semibold text-[#17321f]'>November, 2026</p></div>
            <div><span className='text-sm text-[#3d5a45]'>Amount Paid</span><p className='font-semibold text-[#0b4d24]'>PKR 106,600</p></div>
            <div><span className='text-sm text-[#3d5a45]'>Paid On</span><p className='font-semibold text-[#17321f]'>18-Nov-2026</p></div>
            <div><span className='text-sm text-[#3d5a45]'>Mode</span><p className='font-semibold text-[#17321f]'>Online Banking</p></div>
          </div>
          <div className='flex justify-end gap-3 mt-6'>
            <Button variant='ghost' onClick={() => setIsPaid(false)}>Back</Button>
            <Button className='flex items-center gap-2'>
              <Download size={18} />
              Download Receipt
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export const PaymentHistoryPage: React.FC = () => {
  const history = [
    { ch: 'CH-2026-004512', m: 'November, 2026', amt: '106,600', due: '30-Nov-2026', paidOn: '—', status: 'Unpaid', col: '#b45309' },
    { ch: 'CH-2026-004102', m: 'October, 2026', amt: '106,600', due: '31-Oct-2026', paidOn: '29-Oct-2026', status: 'Paid', col: '#067a35' },
    { ch: 'CH-2026-003688', m: 'September, 2026', amt: '102,160', due: '30-Sep-2026', paidOn: '26-Sep-2026', status: 'Paid', col: '#067a35' },
    { ch: 'CH-2026-003245', m: 'August, 2026', amt: '99,940', due: '31-Aug-2026', paidOn: '28-Aug-2026', status: 'Paid', col: '#067a35' },
    { ch: 'CH-2026-002891', m: 'July, 2026', amt: '97,720', due: '31-Jul-2026', paidOn: '27-Jul-2026', status: 'Paid', col: '#067a35' },
    { ch: 'CH-2026-002456', m: 'June, 2026', amt: '95,500', due: '30-Jun-2026', paidOn: '25-Jun-2026', status: 'Paid', col: '#067a35' },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Payment History</h3>
      <Table headers={['Challan No.', 'Month', 'Amount', 'Due Date', 'Paid On', 'Status', 'Actions']}>
        {history.map((h) => (
          <tr key={h.ch} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{h.ch}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{h.m}</td>
            <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR {h.amt}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{h.due}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{h.paidOn}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase`} style={{ backgroundColor: `${h.col}20`, color: h.col }}>
                {h.status}
              </span>
            </td>
            <td className='px-6 py-4'>
              <div className='flex gap-2'>
                {h.status === 'Paid' && (
                  <button className='p-2 text-[#0b5fa8] hover:bg-[#e4f0fb] rounded-md transition-colors' title='Download Receipt'>
                    <Download size={16} />
                  </button>
                )}
                {h.status === 'Unpaid' && (
                  <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>Pay Now</Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const F4Page: React.FC = () => {
  const f4Rows = [
    { n: '1', rc: 'RCP-2026-008590', m: 'NOVEMBER, 2026', emp: '48', amt: '106,600', mode: '1Bill' },
    { n: '2', rc: 'RCP-2026-008214', m: 'OCTOBER, 2026', emp: '48', amt: '106,600', mode: '1Bill' },
    { n: '3', rc: 'RCP-2026-007731', m: 'SEPTEMBER, 2026', emp: '46', amt: '102,160', mode: '1Bill' },
    { n: '4', rc: 'RCP-2026-007245', m: 'AUGUST, 2026', emp: '47', amt: '99,940', mode: '1Bill' },
    { n: '5', rc: 'RCP-2026-006892', m: 'JULY, 2026', emp: '47', amt: '97,720', mode: '1Bill' },
    { n: '6', rc: 'RCP-2026-006431', m: 'JUNE, 2026', emp: '46', amt: '95,500', mode: '1Bill' },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>F-4 Statement</h3>
      <Table headers={['#', 'Receipt No.', 'Month', 'Employees', 'Amount', 'Mode', 'Actions']}>
        {f4Rows.map((row) => (
          <tr key={row.n} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.n}</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{row.rc}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.m}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.emp}</td>
            <td className='px-6 py-4 font-bold text-[#0b4d24]'>PKR {row.amt}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.mode}</td>
            <td className='px-6 py-4'>
              <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View Receipt</Button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const F5Page: React.FC = () => {
  const f5Rows = [
    { n: '1', rc: 'RCP-2026-006940', m: 'AUGUST, 2026', emp: '47', amt: '100,129', mode: '1Bill' },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>F-5 Voucher (Late Payment)</h3>
      <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6'>
        <div className='flex items-center gap-2 text-amber-800 mb-2'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>
          <span className='font-semibold'>Late Payment Details</span>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
          <div><span className='text-amber-700'>Due Date</span><p className='font-semibold'>31/08/2026</p></div>
          <div><span className='text-amber-700'>Paid On</span><p className='font-semibold'>07/09/2026</p></div>
          <div><span className='text-amber-700'>Days Late</span><p className='font-semibold'>7</p></div>
          <div><span className='text-amber-700'>Penalty %</span><p className='font-semibold'>3.5%</p></div>
          <div><span className='text-amber-700'>Contribution</span><p className='font-semibold'>PKR 99,900</p></div>
          <div><span className='text-amber-700'>Service Charge</span><p className='font-semibold'>PKR 40</p></div>
          <div><span className='text-amber-700'>Penalty</span><p className='font-semibold'>PKR 189</p></div>
          <div><span className='text-amber-700'>Total</span><p className='font-semibold text-amber-700'>PKR 100,129</p></div>
        </div>
        <p className='text-sm text-amber-700 mt-2'>Amount in words: ONE HUNDRED THOUSAND ONE HUNDRED TWENTY NINE ONLY</p>
      </div>
      <Table headers={['#', 'Receipt No.', 'Month', 'Employees', 'Amount', 'Mode', 'Actions']}>
        {f5Rows.map((row) => (
          <tr key={row.n} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.n}</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{row.rc}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.m}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.emp}</td>
            <td className='px-6 py-4 font-bold text-[#b45309]'>PKR {row.amt}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{row.mode}</td>
            <td className='px-6 py-4'>
              <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View Voucher</Button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const ReturnHistoryPage: React.FC = () => {
  const returns = [
    { period: 'Nov 2026', submitted: '17-Nov-2026', status: 'Submitted', ref: 'CNTR-2026-00123' },
    { period: 'Oct 2026', submitted: '25-Oct-2026', status: 'Approved', ref: 'CNTR-2026-00098' },
    { period: 'Sep 2026', submitted: '22-Sep-2026', status: 'Approved', ref: 'CNTR-2026-00076' },
    { period: 'Aug 2026', submitted: '20-Aug-2026', status: 'Approved', ref: 'CNTR-2026-00054' },
    { period: 'Jul 2026', submitted: '18-Jul-2026', status: 'Approved', ref: 'CNTR-2026-00032' },
    { period: 'Jun 2026', submitted: '15-Jun-2026', status: 'Approved', ref: 'CNTR-2026-00011' },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Return History</h3>
      <Table headers={['Period', 'Submitted Date', 'Status', 'Reference', 'Actions']}>
        {returns.map((r) => (
          <tr key={r.period} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{r.period}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{r.submitted}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                r.status === 'Approved' ? 'bg-[#dff3e5] text-[#067a35]' :
                r.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {r.status}
              </span>
            </td>
            <td className='px-6 py-4 text-[#3d5a45]'>{r.ref}</td>
            <td className='px-6 py-4'>
              <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>View</Button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export default PaymentsPage;
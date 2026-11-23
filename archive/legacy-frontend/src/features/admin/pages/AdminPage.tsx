import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Input } from '../../../components/ui/Input';
import { Search, CheckCircle, XCircle, Clock, Eye, FileText, AlertTriangle, Mail, Bell } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAppSelector((state: { auth: { user: any } }) => state.auth);

  if (user?.role !== 'admin') {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#faf9f5]'>
        <Card className='w-full max-w-md text-center py-12'>
          <AlertTriangle className='w-16 h-16 text-[#b45309] mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-[#0b4d24] mb-2'>Access Denied</h2>
          <p className='text-[#3d5a45] mb-6'>You do not have permission to access the admin panel.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Admin Panel</h2>
          <p className='text-sm text-[#3d5a45}'>Manage employer registrations and system settings</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='registrations'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Registration Review
          </NavLink>
          <NavLink
            to='/admin/applications'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Applications
          </NavLink>
          <NavLink
            to='/admin/change-requests'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Change Requests
          </NavLink>
          <NavLink
            to='/admin/users'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            User Management
          </NavLink>
          <NavLink
            to='/admin/settings'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            System Settings
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const RegistrationsPage: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const registrations = [
    { id: 'REG-2026-001234', employer: 'XYZ Textiles (Pvt.) Ltd.', type: 'Private Limited Company', secp: '987654321', ntn: '9876543-2', srb: 'SRB-98765', district: 'Korangi', submitted: '18-Nov-2026 10:30 AM', status: 'Pending Review', docs: 8 },
    { id: 'REG-2026-001233', employer: 'ABC Traders', type: 'Sole Proprietorship', secp: 'N/A', ntn: '8765432-1', srb: 'SRB-87654', district: 'Malir', submitted: '17-Nov-2026 02:15 PM', status: 'Under Review', docs: 9 },
    { id: 'REG-2026-001232', employer: 'Global Exports', type: 'Partnership Firm', secp: '567890123', ntn: '7654321-9', srb: 'SRB-76543', district: 'SITE', submitted: '15-Nov-2026 11:45 AM', status: 'Approved', docs: 10 },
    { id: 'REG-2026-001231', employer: 'Modern Industries', type: 'Private Limited Company', secp: '456789012', ntn: '6543210-8', srb: 'SRB-65432', district: 'Korangi', submitted: '12-Nov-2026 09:20 AM', status: 'Rejected', docs: 7 },
    { id: 'REG-2026-001230', employer: 'Prime Manufacturing', type: 'Public Limited Company', secp: '345678901', ntn: '5432109-7', srb: 'SRB-54321', district: 'SITE', submitted: '10-Nov-2026 04:10 PM', status: 'Pending Review', docs: 8 },
    { id: 'REG-2026-001229', employer: 'Superior Goods', type: 'Partnership Firm', secp: '234567890', ntn: '4321098-6', srb: 'SRB-43210', district: 'Malir', submitted: '08-Nov-2026 10:00 AM', status: 'Approved', docs: 10 },
    { id: 'REG-2026-001228', employer: 'Elite Corp', type: 'Private Limited Company', secp: '123456789', ntn: '3210987-5', srb: 'SRB-32109', district: 'Korangi', submitted: '05-Nov-2026 02:30 PM', status: 'Under Review', docs: 9 },
  ];

  const filtered = registrations.filter(reg => {
    const matchesFilter = filter === 'all' || reg.status.toLowerCase().replace(' ', '-') === filter;
    const matchesSearch = reg.employer.toLowerCase().includes(search.toLowerCase()) ||
      reg.id.toLowerCase().includes(search.toLowerCase()) ||
      reg.secp.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: 'bg-[#dff3e5]', text: 'text-[#067a35]', icon: CheckCircle };
      case 'Rejected':
        return { bg: 'bg-[#fdecea]', text: 'text-[#b00020]', icon: XCircle };
      case 'Under Review':
        return { bg: 'bg-[#e4f0fb]', text: 'text-[#0b5fa8]', icon: Clock };
      case 'Pending Review':
        return { bg: 'bg-[#fdf0dc]', text: 'text-[#b45309]', icon: Clock };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock };
    }
  };

  return (
    <Card>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-[#17321f]'>Registration Review</h3>
        <div className='flex gap-3'>
          <div className='relative max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search registrations...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full min-h-[46px] pl-10 pr-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
          >
            <option value='all'>All Status</option>
            <option value='pending-review'>Pending Review</option>
            <option value='under-review'>Under Review</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
      </div>

      <Table headers={['Reference', 'Employer', 'Type', 'SECP/NTN', 'District', 'Submitted', 'Documents', 'Status', 'Actions']}>
        {filtered.map((reg) => {
          const styles = getStatusStyles(reg.status);
          const Icon = styles.icon;
          return (
            <tr key={reg.id} className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>{reg.id}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{reg.employer}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{reg.type}</td>
              <td className='px-6 py-4 text-[#3d5a45] font-mono text-xs'>{reg.secp} / {reg.ntn}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{reg.district}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{reg.submitted}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{reg.docs}/10</td>
              <td className='px-6 py-4'>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${styles.bg} ${styles.text}`}>
                  <Icon className='w-3 h-3' />
                  {reg.status}
                </span>
              </td>
              <td className='px-6 py-4'>
                <div className='flex gap-2'>
                  <Button variant='ghost' className='min-h-[32px] px-3 text-xs' onClick={() => alert(`Review ${reg.id}`)}>
                    <Eye className='w-4 h-4' />
                    Review
                  </Button>
                  {reg.status === 'Pending Review' || reg.status === 'Under Review' ? (
                    <>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-green-600 hover:bg-green-50' onClick={() => alert(`Approve ${reg.id}`)}>
                        Approve
                      </Button>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-red-600 hover:bg-red-50' onClick={() => alert(`Reject ${reg.id}`)}>
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button variant='ghost' className='min-h-[32px] px-3 text-xs' onClick={() => alert(`View ${reg.id}`)}>
                      <Eye className='w-4 h-4' />
                      View
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </Table>

      {filtered.length === 0 && (
        <div className='text-center py-12'>
          <Search className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500'>No registrations found</p>
        </div>
      )}
    </Card>
  );
};

export const ApplicationsPage: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const applications = [
    { id: 'APP-2026-004512', employer: 'ABC Manufacturing', type: 'Monthly Contribution', period: 'Nov 2026', amount: 'PKR 106,600', employees: 48, submitted: '17-Nov-2026 10:45 AM', status: 'Approved' },
    { id: 'APP-2026-004102', employer: 'ABC Manufacturing', type: 'Monthly Contribution', period: 'Oct 2026', amount: 'PKR 106,600', employees: 48, submitted: '25-Oct-2026 02:15 PM', status: 'Paid' },
    { id: 'APP-2026-003688', employer: 'XYZ Textiles', type: 'Monthly Contribution', period: 'Nov 2026', amount: 'PKR 89,400', employees: 32, submitted: '16-Nov-2026 11:30 AM', status: 'Pending Review' },
    { id: 'APP-2026-003687', employer: 'Global Exports', type: 'Monthly Contribution', period: 'Nov 2026', amount: 'PKR 125,800', employees: 56, submitted: '15-Nov-2026 09:20 AM', status: 'Under Review' },
    { id: 'APP-2026-003686', employer: 'Prime Manufacturing', type: 'Monthly Contribution', period: 'Oct 2026', amount: 'PKR 78,200', employees: 28, submitted: '24-Oct-2026 04:10 PM', status: 'Paid' },
    { id: 'APP-2026-003685', employer: 'Superior Goods', type: 'Monthly Contribution', period: 'Nov 2026', amount: 'PKR 65,400', employees: 24, submitted: '14-Nov-2026 02:30 PM', status: 'Rejected' },
    { id: 'APP-2026-003684', employer: 'Elite Corp', type: 'Monthly Contribution', period: 'Oct 2026', amount: 'PKR 92,100', employees: 35, submitted: '22-Oct-2026 10:00 AM', status: 'Paid' },
  ];

  const filtered = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status.toLowerCase().replace(' ', '-') === filter;
    const matchesSearch = app.employer.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: 'bg-[#dff3e5]', text: 'text-[#067a35]', icon: CheckCircle };
      case 'Paid':
        return { bg: 'bg-[#e3f2e8]', text: 'text-[#067a35]', icon: CheckCircle };
      case 'Rejected':
        return { bg: 'bg-[#fdecea]', text: 'text-[#b00020]', icon: XCircle };
      case 'Under Review':
        return { bg: 'bg-[#e4f0fb]', text: 'text-[#0b5fa8]', icon: Clock };
      case 'Pending Review':
        return { bg: 'bg-[#fdf0dc]', text: 'text-[#b45309]', icon: Clock };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock };
    }
  };

  return (
    <Card>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-[#17321f]'>Applications Management</h3>
        <div className='flex gap-3'>
          <div className='relative max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search applications...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full min-h-[46px] pl-10 pr-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
          >
            <option value='all'>All Status</option>
            <option value='pending-review'>Pending Review</option>
            <option value='under-review'>Under Review</option>
            <option value='approved'>Approved</option>
            <option value='paid'>Paid</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
      </div>

      <Table headers={['Reference', 'Employer', 'Type', 'Period', 'Amount', 'Employees', 'Submitted', 'Status', 'Actions']}>
        {filtered.map((app) => {
          const styles = getStatusStyles(app.status);
          const Icon = styles.icon;
          return (
            <tr key={app.id} className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>{app.id}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{app.employer}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{app.type}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{app.period}</td>
              <td className='px-6 py-4 font-bold text-[#0b4d24]'>{app.amount}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{app.employees}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{app.submitted}</td>
              <td className='px-6 py-4'>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${styles.bg} ${styles.text}`}>
                  <Icon className='w-3 h-3' />
                  {app.status}
                </span>
              </td>
              <td className='px-6 py-4'>
                <div className='flex gap-2'>
                  <Button variant='ghost' className='min-h-[32px] px-3 text-xs' onClick={() => alert(`View ${app.id}`)}>
                    <Eye className='w-4 h-4' />
                    View
                  </Button>
                  {(app.status === 'Pending Review' || app.status === 'Under Review') && (
                    <>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-green-600 hover:bg-green-50' onClick={() => alert(`Approve ${app.id}`)}>
                        Approve
                      </Button>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-red-600 hover:bg-red-50' onClick={() => alert(`Reject ${app.id}`)}>
                        Reject
                      </Button>
                    </>
                  )}
                  {app.status === 'Approved' && (
                    <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-blue-600 hover:bg-blue-50' onClick={() => alert(`Generate Challan ${app.id}`)}>
                      Challan
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </Table>

      {filtered.length === 0 && (
        <div className='text-center py-12'>
          <FileText className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500'>No applications found</p>
        </div>
      )}
    </Card>
  );
};

export const ChangeRequestsAdminPage: React.FC = () => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const changeRequests = [
    { id: 'CR-2026-0001', employer: 'ABC Manufacturing', field: 'Office Phone', oldVal: '021-35000001', newVal: '021-35000000', reason: 'Office number changed after phone system upgrade', doc: 'letter.pdf', status: 'Approved', submitted: '02-Nov-2026', reviewed: '03-Nov-2026' },
    { id: 'CR-2026-0002', employer: 'ABC Manufacturing', field: 'Business Address', oldVal: 'Plot 123, Sector 45', newVal: 'Plot 456, Sector 45', reason: 'Company relocated to new premises', doc: 'electricity_bill_nov2026.pdf', status: 'Pending Review', submitted: '15-Nov-2026', reviewed: '—' },
    { id: 'CR-2026-0003', employer: 'XYZ Textiles', field: 'Contact Person', oldVal: 'Ali Hassan', newVal: 'Ahmed Raza', reason: 'HR Manager changed, new appointment', doc: 'appointment_letter.pdf', status: 'Under Review', submitted: '12-Nov-2026', reviewed: '—' },
    { id: 'CR-2026-0004', employer: 'Global Exports', field: 'Business Type', oldVal: 'Partnership Firm', newVal: 'Private Limited Company', reason: 'Company converted to Pvt Ltd', doc: 'secp_conversion.pdf', status: 'Rejected', submitted: '10-Nov-2026', reviewed: '11-Nov-2026' },
    { id: 'CR-2026-0005', employer: 'Prime Manufacturing', field: 'SECP Certificate No.', oldVal: '111222333', newVal: '444555666', reason: 'Renewed certificate', doc: 'secp_new.pdf', status: 'Approved', submitted: '08-Nov-2026', reviewed: '09-Nov-2026' },
  ];

  const filtered = changeRequests.filter(cr => {
    const matchesFilter = filter === 'all' || cr.status.toLowerCase().replace(' ', '-') === filter;
    const matchesSearch = cr.employer.toLowerCase().includes(search.toLowerCase()) ||
      cr.id.toLowerCase().includes(search.toLowerCase()) ||
      cr.field.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Approved':
        return { bg: 'bg-[#dff3e5]', text: 'text-[#067a35]', icon: CheckCircle };
      case 'Rejected':
        return { bg: 'bg-[#fdecea]', text: 'text-[#b00020]', icon: XCircle };
      case 'Under Review':
        return { bg: 'bg-[#e4f0fb]', text: 'text-[#0b5fa8]', icon: Clock };
      case 'Pending Review':
        return { bg: 'bg-[#fdf0dc]', text: 'text-[#b45309]', icon: Clock };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Clock };
    }
  };

  return (
    <Card>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-[#17321f]'>Change Requests Review</h3>
        <div className='flex gap-3'>
          <div className='relative max-w-xs'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Search change requests...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full min-h-[46px] pl-10 pr-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]'
          >
            <option value='all'>All Status</option>
            <option value='pending-review'>Pending Review</option>
            <option value='under-review'>Under Review</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </select>
        </div>
      </div>

      <Table headers={['Reference', 'Employer', 'Field', 'Old Value', 'New Value', 'Reason', 'Document', 'Status', 'Submitted', 'Reviewed', 'Actions']}>
        {filtered.map((cr) => {
          const styles = getStatusStyles(cr.status);
          const Icon = styles.icon;
          return (
            <tr key={cr.id} className='hover:bg-[#f4fbf6] transition-colors'>
              <td className='px-6 py-4 font-semibold text-[#17321f]'>{cr.id}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{cr.employer}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{cr.field}</td>
              <td className='px-6 py-4 text-[#3d5a45] font-mono text-sm'>{cr.oldVal}</td>
              <td className='px-6 py-4 text-[#3d5a45] font-mono text-sm'>{cr.newVal}</td>
              <td className='px-6 py-4 text-[#3d5a45] max-w-xs truncate'>{cr.reason}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>
                <Button variant='ghost' className='min-h-[32px] px-2 text-xs' onClick={() => alert(`View ${cr.doc}`)}>
                  <Eye className='w-4 h-4' />
                  View
                </Button>
              </td>
              <td className='px-6 py-4'>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${styles.bg} ${styles.text}`}>
                  <Icon className='w-3 h-3' />
                  {cr.status}
                </span>
              </td>
              <td className='px-6 py-4 text-[#3d5a45]'>{cr.submitted}</td>
              <td className='px-6 py-4 text-[#3d5a45]'>{cr.reviewed}</td>
              <td className='px-6 py-4'>
                <div className='flex gap-2'>
                  <Button variant='ghost' className='min-h-[32px] px-3 text-xs' onClick={() => alert(`View details ${cr.id}`)}>
                    <Eye className='w-4 h-4' />
                    View
                  </Button>
                  {(cr.status === 'Pending Review' || cr.status === 'Under Review') && (
                    <>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-green-600 hover:bg-green-50' onClick={() => alert(`Approve ${cr.id}`)}>
                        Approve
                      </Button>
                      <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-red-600 hover:bg-red-50' onClick={() => alert(`Reject ${cr.id}`)}>
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </Table>

      {filtered.length === 0 && (
        <div className='text-center py-12'>
          <FileText className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500'>No change requests found</p>
        </div>
      )}
    </Card>
  );
};

export const UsersPage: React.FC = () => {
  const users = [
    { id: 'admin-1', name: 'System Administrator', email: 'admin@essi.sindh.gov.pk', role: 'Admin', employerNo: '—', status: 'Active', lastLogin: '18-Nov-2026 02:05 PM' },
    { id: 'user-1', name: 'ABC Manufacturing', email: 'accounts@abcmanufacturing.example', role: 'Employer', employerNo: '3-61-0001', status: 'Active', lastLogin: '18-Nov-2026 10:30 AM' },
    { id: 'user-2', name: 'XYZ Textiles', email: 'hr@xyztextiles.example', role: 'Employer', employerNo: '3-61-0045', status: 'Active', lastLogin: '17-Nov-2026 02:15 PM' },
    { id: 'user-3', name: 'Global Exports', email: 'finance@globalexports.example', role: 'Employer', employerNo: '3-61-0123', status: 'Active', lastLogin: '16-Nov-2026 11:45 AM' },
    { id: 'user-4', name: 'Prime Manufacturing', email: 'accounts@primemfg.example', role: 'Employer', employerNo: '3-61-0078', status: 'Inactive', lastLogin: '05-Nov-2026 09:20 AM' },
    { id: 'user-5', name: 'Superior Goods', email: 'admin@superiorgoods.example', role: 'Employer', employerNo: '3-61-0099', status: 'Active', lastLogin: '18-Nov-2026 08:45 AM' },
  ];

  return (
    <Card>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-[#17321f]'>User Management</h3>
        <Button className='flex items-center gap-2'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' /></svg>
          Add User
        </Button>
      </div>

      <Table headers={['ID', 'Name', 'Email', 'Role', 'Employer No.', 'Status', 'Last Login', 'Actions']}>
        {users.map((user) => (
          <tr key={user.id} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-mono text-sm text-[#3d5a45]'>{user.id}</td>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{user.name}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{user.email}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                user.role === 'Admin' ? 'bg-[#e4f0fb] text-[#0b5fa8]' : 'bg-[#e3f2e8] text-[#067a35]'
              }`}>
                {user.role}
              </span>
            </td>
            <td className='px-6 py-4 text-[#3d5a45] font-mono'>{user.employerNo}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                user.status === 'Active' ? 'bg-[#dff3e5] text-[#067a35]' : 'bg-[#fdecea] text-[#b00020]'
              }`}>
                {user.status}
              </span>
            </td>
            <td className='px-6 py-4 text-[#3d5a45]'>{user.lastLogin}</td>
            <td className='px-6 py-4'>
              <div className='flex gap-2'>
                <Button variant='ghost' className='min-h-[32px] px-3 text-xs'>Edit</Button>
                <Button variant='ghost' className='min-h-[32px] px-3 text-xs text-red-600 hover:bg-red-50'>
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = React.useState({
    portalName: 'ESSI Employer Portal',
    portalUrl: 'https://essi.sindh.gov.pk/employer',
    supportEmail: 'support@essi.sindh.gov.pk',
    supportPhone: '021-9920XXXX',
    sessionTimeout: 30,
    maxFileSize: 5,
    allowedFileTypes: 'pdf,jpg,jpeg,png',
    minWage: 25000,
    maxWage: 100000,
    contributionRate: 5,
    serviceChargeRate: 1,
    latePenaltyRate: 0.5,
    maxLatePenalty: 50,
    enableEmailNotifications: true,
    enableSMSNotifications: true,
    maintenanceMode: false,
    maintenanceMessage: 'System under maintenance. Please try again later.',
    maintenanceStart: '',
    maintenanceEnd: '',
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className='space-y-6'>
      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
          <svg className='w-5 h-5 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
          General Settings
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input label='Portal Name' {...{ value: settings.portalName, onChange: (e) => setSettings({ ...settings, portalName: e.target.value }) }} />
          <Input label='Portal URL' type='url' {...{ value: settings.portalUrl, onChange: (e) => setSettings({ ...settings, portalUrl: e.target.value }) }} />
          <Input label='Support Email' type='email' {...{ value: settings.supportEmail, onChange: (e) => setSettings({ ...settings, supportEmail: e.target.value }) }} />
          <Input label='Support Phone' {...{ value: settings.supportPhone, onChange: (e) => setSettings({ ...settings, supportPhone: e.target.value }) }} />
        </div>
      </Card>

      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
          <svg className='w-5 h-5 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' /></svg>
          Security & Session
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Session Timeout (minutes)</label>
            <input type='number' min='5' max='120' value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Max File Size (MB)</label>
            <input type='number' min='1' max='50' value={settings.maxFileSize} onChange={(e) => setSettings({ ...settings, maxFileSize: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <Input label='Allowed File Types' {...{ value: settings.allowedFileTypes, onChange: (e) => setSettings({ ...settings, allowedFileTypes: e.target.value }) }} />
        </div>
      </Card>

      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
          <svg className='w-5 h-5 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
          Contribution Parameters
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Minimum Wage (PKR)</label>
            <input type='number' value={settings.minWage} onChange={(e) => setSettings({ ...settings, minWage: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Maximum Wage (PKR)</label>
            <input type='number' value={settings.maxWage} onChange={(e) => setSettings({ ...settings, maxWage: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Contribution Rate (%)</label>
            <input type='number' step='0.1' value={settings.contributionRate} onChange={(e) => setSettings({ ...settings, contributionRate: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Service Charge Rate (%)</label>
            <input type='number' step='0.1' value={settings.serviceChargeRate} onChange={(e) => setSettings({ ...settings, serviceChargeRate: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Late Penalty Rate (%/day)</label>
            <input type='number' step='0.1' value={settings.latePenaltyRate} onChange={(e) => setSettings({ ...settings, latePenaltyRate: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Max Late Penalty (%)</label>
            <input type='number' value={settings.maxLatePenalty} onChange={(e) => setSettings({ ...settings, maxLatePenalty: Number(e.target.value) })} className='w-full min-h-[46px] px-3 border border-[#b9d6c4] rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f]' />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
          <Bell className='w-5 h-5 text-[#067a35]' />
          Notification Settings
        </h3>
        <div className='space-y-4'>
          <label className='flex items-center justify-between cursor-pointer p-4 bg-white border border-[#cfe4d5] rounded-lg'>
            <div className='flex items-center gap-3'>
              <Mail className='w-5 h-5 text-[#067a35]' />
              <div>
                <p className='font-medium text-[#17321f]'>Email Notifications</p>
                <p className='text-sm text-[#3d5a45]'>Enable system-wide email notifications</p>
              </div>
            </div>
            <input type='checkbox' checked={settings.enableEmailNotifications} onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })} className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' />
          </label>
          <label className='flex items-center justify-between cursor-pointer p-4 bg-white border border-[#cfe4d5] rounded-lg'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#067a35]' />
              <div>
                <p className='font-medium text-[#17321f]'>SMS Notifications</p>
                <p className='text-sm text-[#3d5a45]'>Enable system-wide SMS notifications</p>
              </div>
            </div>
            <input type='checkbox' checked={settings.enableSMSNotifications} onChange={(e) => setSettings({ ...settings, enableSMSNotifications: e.target.checked })} className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' />
          </label>
        </div>
      </Card>

      <Card>
        <h3 className='text-lg font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
          <AlertTriangle className='w-5 h-5 text-[#b45309]' />
          Maintenance Mode
        </h3>
        <div className='space-y-4'>
          <label className='flex items-center justify-between cursor-pointer p-4 bg-white border border-[#cfe4d5] rounded-lg'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='w-5 h-5 text-[#b45309]' />
              <div>
                <p className='font-medium text-[#17321f]'>Enable Maintenance Mode</p>
                <p className='text-sm text-[#3d5a45}'>Portal will be inaccessible to employers</p>
              </div>
            </div>
            <input type='checkbox' checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' />
          </label>
          {settings.maintenanceMode && (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <Input label='Maintenance Message' {...{ value: settings.maintenanceMessage, onChange: (e) => setSettings({ ...settings, maintenanceMessage: e.target.value }) }} className='md:col-span-2' />
              <Input label='Start Time' type='datetime-local' {...{ value: settings.maintenanceStart, onChange: (e) => setSettings({ ...settings, maintenanceStart: e.target.value }) }} />
              <Input label='End Time' type='datetime-local' {...{ value: settings.maintenanceEnd, onChange: (e) => setSettings({ ...settings, maintenanceEnd: e.target.value }) }} />
            </div>
          )}
        </div>
      </Card>

      <div className='flex justify-end gap-3'>
        <Button variant='ghost' onClick={() => alert('Settings reset to defaults')}>Reset to Defaults</Button>
        <Button onClick={handleSave} className='flex items-center gap-2'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4' /></svg>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
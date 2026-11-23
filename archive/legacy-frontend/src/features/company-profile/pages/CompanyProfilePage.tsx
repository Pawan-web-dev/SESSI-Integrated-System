import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Plus, Upload, Download } from 'lucide-react';

const CompanyProfilePage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-[#0b4d24]'>Company Profile</h2>
        <p className='text-sm text-[#3d5a45]'>Manage your company information and documents</p>
      </div>

      <div className='flex gap-4 mb-6'>
        <NavLink
          to='/profile/business'
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
            }`
          }
        >
          Business Information
        </NavLink>
        <NavLink
          to='/profile/documents'
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
            }`
          }
        >
          Mandatory Documents
        </NavLink>
        <NavLink
          to='/profile/contact'
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
            }`
          }
        >
          Contact & Location
        </NavLink>
        <NavLink
          to='/profile/change-requests'
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
            }`
          }
        >
          Change Requests
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
};

export const BusinessInfoPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Business Information</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input label='Employer Name' placeholder='ABC Manufacturing (Pvt.) Ltd.' />
        <Input label='Employer No.' value='3-61-0001' disabled />
        <Input label='Business Type' placeholder='Private Limited Company' />
        <Input label='SECP Certificate No.' placeholder='123456789' />
        <Input label='NTN' placeholder='1234567-8' />
        <Input label='SRB Registration No.' placeholder='SRB-12345' />
        <Input label='Business Address' placeholder='Plot 123, Sector 45, Korangi Industrial Area' />
        <Input label='District' placeholder='Korangi, Karachi' />
        <Input label='GPS Location (Optional)' placeholder='24.8607, 67.0011' />
        <Input label='Contact Person (Optional)' placeholder='Muhammad Ali' />
        <Input label='Designation (Optional)' placeholder='HR Manager' />
        <Input label='Mobile No. (Optional)' placeholder='0300-1234567' />
        <Input label='Email Address (Optional)' placeholder='hr@abcmanufacturing.example' />
        <Input label='Office Phone (Optional)' placeholder='021-35000000' />
      </div>
      <div className='flex justify-end gap-3 mt-6'>
        <Button variant='ghost'>Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </Card>
  );
};

export const MandatoryDocumentsPage: React.FC = () => {
  const documents = [
    { name: 'SECP Certificate', req: 'Required', file: 'secp_certificate.pdf', status: 'Verified', has: true },
    { name: 'NTN', req: 'Required', file: 'ntn_certificate.pdf', status: 'Verified', has: true },
    { name: 'SRB Registration', req: 'Required', file: 'srb_registration.pdf', status: 'Verified', has: true },
    { name: 'Electricity Bill', req: 'Required', file: 'electricity_bill_oct2026.pdf', status: 'Verified', has: true },
    { name: 'Gas Bill', req: 'If applicable', file: '-', status: 'Not applicable', has: false },
    { name: 'Partnership Deed', req: 'Where applicable', file: '-', status: 'Not applicable', has: false },
    { name: 'Proprietor/Employer CNIC', req: 'Required', file: 'owner_cnic.jpg', status: 'Verified', has: true },
    { name: 'Bank Details', req: 'Required', file: 'bank_letter.pdf', status: 'Verified', has: true },
    { name: 'Company Logo', req: 'Where applicable', file: 'company_logo.png', status: 'Uploaded', has: true },
    { name: 'Contact Numbers & Email', req: 'Required', file: 'contact_details.pdf', status: 'Verified', has: true },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Mandatory Documents</h3>
      <Table headers={['Document', 'Requirement', 'File', 'Status', 'Actions']}>
        {documents.map((doc) => (
          <tr key={doc.name} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{doc.name}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{doc.req}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{doc.file}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                doc.status === 'Verified' ? 'bg-[#dff3e5] text-[#067a35]' :
                doc.status === 'Uploaded' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {doc.status}
              </span>
            </td>
            <td className='px-6 py-4'>
              <div className='flex gap-2'>
                {doc.has && (
                  <button className='p-2 text-[#0b5fa8] hover:bg-[#e4f0fb] rounded-md transition-colors' title='Download'>
                    <Download size={16} />
                  </button>
                )}
                {!doc.has && (
                  <button className='p-2 text-[#067a35] hover:bg-[#e3f2e8] rounded-md transition-colors' title='Upload'>
                    <Upload size={16} />
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

export const ContactLocationPage: React.FC = () => {
  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Contact & Location</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input label='Business Address' placeholder='Plot 123, Sector 45, Korangi Industrial Area' />
        <Input label='District' placeholder='Korangi, Karachi' />
        <Input label='City' placeholder='Karachi' />
        <Input label='Province' value='Sindh' disabled />
        <Input label='Postal Code' placeholder='74900' />
        <Input label='GPS Coordinates' placeholder='24.8607, 67.0011' />
        <Input label='Office Phone' placeholder='021-35000000' />
        <Input label='Mobile Number' placeholder='0300-1234567' />
        <Input label='Email Address' placeholder='contact@abcmanufacturing.example' />
        <Input label='Website (Optional)' placeholder='www.abcmanufacturing.example' />
      </div>
      <div className='flex justify-end gap-3 mt-6'>
        <Button variant='ghost'>Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </Card>
  );
};

export const ChangeRequestsPage: React.FC = () => {
  const changeRequests = [
    { id: 'CR-2026-0001', field: 'Office Phone', label: 'Office Phone', oldVal: '021-35000001', newVal: '021-35000000', reason: 'Office number changed after a phone system upgrade.', doc: '-', status: 'Approved', submitted: '02 Nov 2026 11:15' },
    { id: 'CR-2026-0002', field: 'Business Address', label: 'Business Address', oldVal: 'Plot 123, Sector 45', newVal: 'Plot 456, Sector 45', reason: 'Company relocated to new premises within same sector.', doc: 'electricity_bill_nov2026.pdf', status: 'Pending Review', submitted: '15 Nov 2026 09:30' },
    { id: 'CR-2026-0003', field: 'Contact Person', label: 'Contact Person', oldVal: 'Muhammad Ali', newVal: 'Ahmed Hassan', reason: 'HR Manager changed. New appointment letter attached.', doc: 'appointment_letter_ahmed.pdf', status: 'Under Review', submitted: '18 Nov 2026 14:20' },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-semibold text-[#17321f]'>Change Requests</h3>
        <Button className='flex items-center gap-2'>
          <Plus size={18} />
          New Change Request
        </Button>
      </div>

      <Table headers={['Reference', 'Field', 'Old Value', 'New Value', 'Reason', 'Document', 'Status', 'Submitted']}>
        {changeRequests.map((cr) => (
          <tr key={cr.id} className='hover:bg-[#f4fbf6] transition-colors'>
            <td className='px-6 py-4 font-semibold text-[#17321f]'>{cr.id}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{cr.label}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{cr.oldVal}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{cr.newVal}</td>
            <td className='px-6 py-4 text-[#3d5a45] max-w-xs truncate'>{cr.reason}</td>
            <td className='px-6 py-4 text-[#3d5a45]'>{cr.doc}</td>
            <td className='px-6 py-4'>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                cr.status === 'Approved' ? 'bg-[#dff3e5] text-[#067a35]' :
                cr.status === 'Pending Review' ? 'bg-orange-100 text-orange-700' :
                cr.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {cr.status}
              </span>
            </td>
            <td className='px-6 py-4 text-[#3d5a45]'>{cr.submitted}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default CompanyProfilePage;
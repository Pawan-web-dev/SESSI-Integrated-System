import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { User, Lock, Bell, Save, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Settings</h2>
          <p className='text-sm text-[#3d5a45]'>Manage your account and notification preferences</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/settings/account'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Account Settings
          </NavLink>
          <NavLink
            to='/settings/password'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Change Password
          </NavLink>
          <NavLink
            to='/settings/notifications'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Notification Settings
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = React.useState({
    employerName: user?.name || 'ABC Manufacturing (Pvt.) Ltd.',
    employerNo: user?.employerNo || '3-61-0001',
    email: user?.email || 'accounts@abcmanufacturing.example',
    phone: '021-35000000',
    mobile: '0300-1234567',
    address: 'Plot 123, Sector 45, Korangi Industrial Area, Karachi',
    contactPerson: 'Muhammad Ali',
    contactDesignation: 'HR Manager',
  });
  const [saved, setSaved] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Account Settings</h3>
      <form onSubmit={handleSave} className='space-y-6'>
        <div className='border-b border-[#cfe4d5] pb-6'>
          <h4 className='font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
            <User className='w-5 h-5 text-[#067a35]' />
            Company Information
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              label='Employer Name *'
              value={formData.employerName}
              onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
              required
            />
            <Input
              label='Employer No. *'
              value={formData.employerNo}
              disabled
            />
            <Input
              label='Email Address *'
              type='email'
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label='Office Phone'
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label='Mobile Number'
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
            <Input
              label='Business Address'
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className='md:col-span-2'
            />
          </div>
        </div>

        <div className='border-b border-[#cfe4d5] pb-6'>
          <h4 className='font-semibold text-[#17321f] mb-4 flex items-center gap-2'>
            <User className='w-5 h-5 text-[#067a35]' />
            Contact Person
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              label='Contact Person Name'
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
            <Input
              label='Designation'
              value={formData.contactDesignation}
              onChange={(e) => setFormData({ ...formData, contactDesignation: e.target.value })}
            />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='ghost'>Cancel</Button>
          <Button type='submit' className='flex items-center gap-2'>
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>

        {saved && (
          <div className='fixed bottom-6 right-6 bg-[#067a35] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in'>
            <CheckCircle className='w-5 h-5' />
            Settings saved successfully
          </div>
        )}
      </form>
    </Card>
  );
};

export const ChangePasswordPage: React.FC = () => {
  const [formData, setFormData] = React.useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = React.useState({ current: false, new: false, confirm: false });
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.current) newErrors.current = 'Current password is required';
    if (!formData.new) newErrors.new = 'New password is required';
    else if (formData.new.length < 8) newErrors.new = 'New password must be at least 8 characters';
    else if (!/[A-Z]/.test(formData.new)) newErrors.new = 'Must contain at least one uppercase letter';
    else if (!/[0-9]/.test(formData.new)) newErrors.new = 'Must contain at least one number';
    if (!formData.confirm) newErrors.confirm = 'Please confirm new password';
    else if (formData.new !== formData.confirm) newErrors.confirm = 'Passwords do not match';
    if (formData.new === formData.current && formData.current) newErrors.new = 'New password must be different from current password';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
    setFormData({ current: '', new: '', confirm: '' });
  };

  if (submitted) {
    return (
      <Card>
        <div className='text-center py-12'>
          <div className='w-16 h-16 bg-[#e3f2e8] border border-[#cfe4d5] rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-[#067a35]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          </div>
          <h3 className='text-xl font-bold text-[#17321f] mb-2'>Password Changed Successfully!</h3>
          <p className='text-[#3d5a45] mb-6'>Your password has been updated. Please use your new password for future logins.</p>
          <Button onClick={() => setSubmitted(false)} className='flex items-center gap-2'>
            <Lock className='w-4 h-4' />
            Done
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Change Password</h3>
      <form onSubmit={handleSubmit} className='space-y-6 max-w-md'>
        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Current Password *</label>
          <div className='relative'>
            <input
              type={showPassword.current ? 'text' : 'password'}
              value={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.value })}
              className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] pr-10 ${
                errors.current ? 'border-red-500' : 'border-[#b9d6c4]'
              }`}
              placeholder='Enter current password'
            />
            <button
              type='button'
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d5a45]'
              aria-label='Toggle password visibility'
            >
              {showPassword.current ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.current && <span className='text-red-500 text-xs mt-1 block'>{errors.current}</span>}
        </div>

        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>New Password *</label>
          <div className='relative'>
            <input
              type={showPassword.new ? 'text' : 'password'}
              value={formData.new}
              onChange={(e) => setFormData({ ...formData, new: e.target.value })}
              className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] pr-10 ${
                errors.new ? 'border-red-500' : 'border-[#b9d6c4]'
              }`}
              placeholder='Enter new password'
            />
            <button
              type='button'
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d5a45]'
              aria-label='Toggle password visibility'
            >
              {showPassword.new ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.new && <span className='text-red-500 text-xs mt-1 block'>{errors.new}</span>}
          <div className='mt-2 space-y-1 text-xs text-[#3d5a45]'>
            <p className={`${formData.new.length >= 8 ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least 8 characters</p>
            <p className={`${/[A-Z]/.test(formData.new) ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least one uppercase letter</p>
            <p className={`${/[0-9]/.test(formData.new) ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ At least one number</p>
            <p className={`${formData.new !== formData.current && formData.current ? 'text-[#067a35]' : 'text-gray-400'}`}>✓ Different from current password</p>
          </div>
        </div>

        <div>
          <label className='font-semibold text-sm text-[#17321f] block mb-1'>Confirm New Password *</label>
          <div className='relative'>
            <input
              type={showPassword.confirm ? 'text' : 'password'}
              value={formData.confirm}
              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
              className={`w-full min-h-[46px] px-3 border rounded-md text-[15px] bg-white text-[#17321f] focus:outline-none focus:ring-2 focus:ring-[#2fae9f] pr-10 ${
                errors.confirm ? 'border-red-500' : 'border-[#b9d6c4]'
              }`}
              placeholder='Confirm new password'
            />
            <button
              type='button'
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3d5a45]'
              aria-label='Toggle password visibility'
            >
              {showPassword.confirm ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </button>
          </div>
          {errors.confirm && <span className='text-red-500 text-xs mt-1 block'>{errors.confirm}</span>}
          {formData.confirm && formData.new === formData.confirm && formData.new && !errors.confirm && (
            <span className='text-[#067a35] text-xs mt-1 block'>✓ Passwords match</span>
          )}
        </div>

        <div className='bg-[#f1faf4] border border-[#cfe4d5] rounded-lg p-4'>
          <h4 className='font-semibold text-[#17321f] mb-2 flex items-center gap-2'>
            <Lock className='w-4 h-4 text-[#067a35]' />
            Password Requirements
          </h4>
          <ul className='text-sm text-[#3d5a45] space-y-1 list-disc list-inside'>
            <li>Minimum 8 characters</li>
            <li>At least 1 uppercase letter (A-Z)</li>
            <li>At least 1 number (0-9)</li>
            <li>Cannot be the same as your current password</li>
            <li>Should not contain personal information</li>
          </ul>
        </div>

        <div className='flex justify-end gap-3 pt-4 border-t border-[#cfe4d5]'>
          <Button type='button' variant='ghost' onClick={() => setFormData({ current: '', new: '', confirm: '' })}>Cancel</Button>
          <Button type='submit' className='flex items-center gap-2' disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Updating...
              </>
            ) : (
              <>
                <Lock className='w-4 h-4' />
                Update Password
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export const NotificationSettingsPage: React.FC = () => {
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    smsNotifications: true,
    contributionReminders: true,
    changeRequestUpdates: true,
    maintenanceNotices: false,
    paymentConfirmations: true,
    approvalNotifications: true,
    systemAlerts: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      icon: Mail,
      title: 'Email Notifications',
      description: 'Receive important updates and notifications via email',
      required: true,
    },
    {
      key: 'smsNotifications' as const,
      icon: Bell,
      title: 'SMS Notifications',
      description: 'Receive urgent alerts and critical updates via SMS',
      required: false,
    },
    {
      key: 'contributionReminders' as const,
      icon: Bell,
      title: 'Contribution Due Reminders',
      description: 'Get reminded 7 days and 1 day before contribution due dates',
      required: false,
    },
    {
      key: 'changeRequestUpdates' as const,
      icon: Bell,
      title: 'Change Request Status Updates',
      description: 'Notifications when your change requests are reviewed, approved, or rejected',
      required: false,
    },
    {
      key: 'paymentConfirmations' as const,
      icon: Bell,
      title: 'Payment Confirmations',
      description: 'Receive receipt and payment confirmation notifications',
      required: false,
    },
    {
      key: 'approvalNotifications' as const,
      icon: Bell,
      title: 'Contribution Approval Notifications',
      description: 'Get notified when your submitted contributions are approved',
      required: false,
    },
    {
      key: 'systemAlerts' as const,
      icon: Bell,
      title: 'System Alerts & Announcements',
      description: 'Important system-wide announcements and maintenance notices',
      required: false,
    },
    {
      key: 'maintenanceNotices' as const,
      icon: Bell,
      title: 'Scheduled Maintenance Notices',
      description: 'Advance notice of planned system maintenance windows',
      required: false,
    },
  ];

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>Notification Settings</h3>
      <div className='space-y-4'>
        {notificationOptions.map((option) => (
          <label
            key={option.key}
            className={`flex items-center justify-between cursor-pointer p-4 rounded-lg transition-colors ${
              settings[option.key] ? 'bg-[#f1faf4] border border-[#cfe4d5]' : 'bg-white border border-[#e5ebe7]'
            }`}
          >
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 rounded-lg bg-[#e3f2e8] flex items-center justify-center'>
                <option.icon className='w-5 h-5 text-[#067a35]' />
              </div>
              <div>
                <p className='font-medium text-[#17321f]'>{option.title}</p>
                <p className='text-sm text-[#3d5a45]'>{option.description}</p>
                {option.required && (
                  <span className='px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-[#067a35] text-white mt-1 inline-block'>
                    Required
                  </span>
                )}
              </div>
            </div>
            <input
              type='checkbox'
              checked={settings[option.key]}
              onChange={() => toggleSetting(option.key)}
              disabled={option.required}
              className={`w-6 h-6 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f] transition-colors ${
                option.required ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
          </label>
        ))}
      </div>

      <div className='mt-8 pt-6 border-t border-[#cfe4d5]'>
        <h4 className='font-semibold text-[#17321f] mb-4'>Notification Frequency</h4>
        <div className='space-y-4'>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Contribution Reminder Timing</label>
            <div className='flex flex-wrap gap-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
                <span className='text-sm text-[#3d5a45]'>7 days before due date</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
                <span className='text-sm text-[#3d5a45]'>3 days before due date</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
                <span className='text-sm text-[#3d5a45]'>1 day before due date</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' />
                <span className='text-sm text-[#3d5a45]'>On due date</span>
              </label>
            </div>
          </div>
          <div>
            <label className='font-semibold text-sm text-[#17321f] block mb-1'>Digest Email</label>
            <div className='flex flex-wrap gap-3'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' name='digest' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] focus:ring-[#2fae9f]' defaultChecked />
                <span className='text-sm text-[#3d5a45]'>Daily (sent each morning)</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' name='digest' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] focus:ring-[#2fae9f]' />
                <span className='text-sm text-[#3d5a45]'>Weekly (sent every Monday)</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' name='digest' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] focus:ring-[#2fae9f]' />
                <span className='text-sm text-[#3d5a45]'>Instant (send immediately)</span>
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='radio' name='digest' className='w-4 h-4 text-[#067a35] border-[#b9d6c4] focus:ring-[#2fae9f]' />
                <span className='text-sm text-[#3d5a45]'>None (no digest emails)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='flex justify-end gap-3 mt-8 pt-6 border-t border-[#cfe4d5]'>
        <Button variant='ghost'>Reset to Defaults</Button>
        <Button className='flex items-center gap-2'>
          <Save size={18} />
          Save Preferences
        </Button>
      </div>
    </Card>
  );
};

import { CheckCircle } from 'lucide-react';

export default SettingsPage;
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Bell, Mail, Check, X, AlertTriangle, Info, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold text-[#0b4d24]'>Notifications</h2>
          <p className='text-sm text-[#3d5a45]'>View and manage your notifications and alerts</p>
        </div>
        <div className='flex gap-2'>
          <NavLink
            to='/notifications/inbox'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Inbox
          </NavLink>
          <NavLink
            to='/notifications/alerts'
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'bg-white text-[#17321f] border border-[#cfe4d5] hover:bg-[#f1faf4]'
              }`
            }
          >
            Alerts
          </NavLink>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export const InboxPage: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [read, setRead] = React.useState<Set<string>>(new Set());

  const notifications = [
    {
      id: '1',
      title: 'Contribution Approved - November 2026',
      message: 'Your contribution for November 2026 has been approved. Voucher 2611004512 for PKR 106,600 has been generated.',
      time: '18-Nov-2026 02:05 PM',
      type: 'success',
      hasAction: true,
      actionLabel: 'View Receipt',
      read: false
    },
    {
      id: '2',
      title: 'Contribution Submitted - November 2026',
      message: 'Contribution for November 2026 submitted and pending for approval. Ref. CNTR-2026-00123.',
      time: '17-Nov-2026 10:45 AM',
      type: 'info',
      hasAction: false,
      read: false
    },
    {
      id: '3',
      title: 'Payment Received - October 2026',
      message: 'Payment received for October 2026. Receipt RCP-2026-008214.',
      time: '29-Oct-2026 11:10 AM',
      type: 'success',
      hasAction: true,
      actionLabel: 'View Receipt',
      read: true
    },
    {
      id: '4',
      title: 'Change Request Approved',
      message: 'Your change request CR-2026-0001 for Office Phone has been approved. Company profile updated.',
      time: '03-Nov-2026 10:00 AM',
      type: 'success',
      hasAction: true,
      actionLabel: 'View Details',
      read: true
    },
    {
      id: '5',
      title: 'New Change Request Submitted',
      message: 'Change request CR-2026-0002 for Business Address has been submitted and is pending review.',
      time: '15-Nov-2026 09:30 AM',
      type: 'info',
      hasAction: true,
      actionLabel: 'View Request',
      read: false
    },
    {
      id: '6',
      title: 'Contribution Due Reminder',
      message: 'Your November 2026 contribution is due on 30-Nov-2026. Please ensure timely payment to avoid late fees.',
      time: '20-Nov-2026 09:00 AM',
      type: 'warning',
      hasAction: true,
      actionLabel: 'Pay Now',
      read: false
    },
    {
      id: '7',
      title: 'Employee Registration Complete',
      message: 'New employee Zeeshan Qureshi (CNIC: 42101-7890123-7) has been successfully registered.',
      time: '12-Nov-2026 03:45 PM',
      type: 'info',
      hasAction: false,
      read: true
    },
    {
      id: '8',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on 25-Nov-2026 from 02:00 AM to 04:00 AM. Portal may be temporarily unavailable.',
      time: '10-Nov-2026 04:00 PM',
      type: 'warning',
      hasAction: false,
      read: true
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className='w-5 h-5 text-[#067a35]' />;
      case 'warning': return <AlertTriangle className='w-5 h-5 text-[#b45309]' />;
      case 'info': return <Info className='w-5 h-5 text-[#0b5fa8]' />;
      default: return <Bell className='w-5 h-5 text-[#3d5a45]' />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-[#e3f2e8] border-[#cfe4d5]';
      case 'warning': return 'bg-[#fdf0dc] border-[#f4d6a0]';
      case 'info': return 'bg-[#e4f0fb] border-[#cfe0f2]';
      default: return 'bg-white border-[#cfe4d5]';
    }
  };

  const getDotColor = (type: string) => {
    switch (type) {
      case 'success': return '#067a35';
      case 'warning': return '#b45309';
      case 'info': return '#0b5fa8';
      default: return '#3d5a45';
    }
  };

  const toggleRead = (id: string) => {
    setRead(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Card>
      <div className='flex justify-between items-center mb-6'>
        <h3 className='text-lg font-semibold text-[#17321f]'>Inbox</h3>
        <div className='flex gap-2'>
          <Button variant='ghost' className='min-h-[36px] px-3 text-sm' onClick={() => notifications.forEach(n => setRead(prev => new Set([...prev, n.id])))}>
            Mark All as Read
          </Button>
          <Button variant='ghost' className='min-h-[36px] px-3 text-sm'>
            <Bell className='w-4 h-4 mr-1' />
            Settings
          </Button>
        </div>
      </div>

      <div className='space-y-3'>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`${getBgColor(notif.type)} border rounded-lg p-4 transition-all ${read.has(notif.id) ? 'opacity-70' : ''}`}
            style={{ borderLeft: `4px solid ${getDotColor(notif.type)}` }}
          >
            <div className='flex gap-3'>
              <div className='flex-shrink-0 mt-1'>
                {getIcon(notif.type)}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <h4 className={`font-semibold text-[#17321f] ${!read.has(notif.id) ? 'text-[#0b4d24]' : ''}`}>
                      {notif.title}
                    </h4>
                    <p className='text-sm text-[#3d5a45] mt-1'>{notif.message}</p>
                    <div className='flex items-center gap-4 mt-2 text-xs text-[#3d5a45]'>
                      <span className='flex items-center gap-1'>
                        <Mail className='w-3 h-3' />
                        {notif.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${!read.has(notif.id) ? 'bg-[#dff3e5] text-[#067a35]' : 'bg-gray-100 text-gray-600'}`}>
                        {!read.has(notif.id) ? 'Unread' : 'Read'}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 flex-shrink-0'>
                    {notif.hasAction && (
                      <Button
                        variant='ghost'
                        className='min-h-[32px] px-3 text-xs'
                      >
                        {notif.actionLabel}
                      </Button>
                    )}
                    <button
                      onClick={() => toggleRead(notif.id)}
                      className={`p-1 rounded transition-colors ${read.has(notif.id) ? 'text-gray-400 hover:text-[#067a35] hover:bg-[#e3f2e8]' : 'text-[#067a35] hover:bg-[#e3f2e8]'}`}
                      aria-label={read.has(notif.id) ? 'Mark as unread' : 'Mark as read'}
                    >
                      {read.has(notif.id) ? (
                        <X className='w-4 h-4' />
                      ) : (
                        <Check className='w-4 h-4' />
                      )}
                    </button>
                    <button
                      onClick={() => setExpanded(expanded === notif.id ? null : notif.id)}
                      className='p-1 rounded transition-colors text-gray-400 hover:text-[#3d5a45] hover:bg-gray-100'
                      aria-label='Expand'
                    >
                      {expanded === notif.id ? (
                        <ChevronUp className='w-4 h-4' />
                      ) : (
                        <ChevronDown className='w-4 h-4' />
                      )}
                    </button>
                  </div>
                </div>
                {expanded === notif.id && (
                  <div className='mt-4 pt-4 border-t border-white/50'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='text-[#3d5a45] font-medium'>Notification Type</p>
                        <p className='text-[#17321f] capitalize'>{notif.type}</p>
                      </div>
                      <div>
                        <p className='text-[#3d5a45] font-medium'>Reference</p>
                        <p className='text-[#17321f] font-mono'>{notif.id}</p>
                      </div>
                      <div className='md:col-span-2'>
                        <p className='text-[#3d5a45] font-medium'>Full Message</p>
                        <p className='text-[#17321f] whitespace-pre-wrap'>{notif.message}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className='text-center py-12'>
          <Bell className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-500'>No notifications yet</p>
          <p className='text-sm text-gray-400 mt-1'>You\'re all caught up!</p>
        </div>
      )}
    </Card>
  );
};

export const AlertsPage: React.FC = () => {
  const alerts = [
    {
      id: '1',
      title: 'November 2026 Contribution Due',
      description: 'Your November 2026 contribution payment is due on 30-Nov-2026. Late payment will incur a penalty of 0.5% per day (max 50%).',
      severity: 'high',
      date: '20-Nov-2026',
      action: 'Pay Now',
      dismissed: false
    },
    {
      id: '2',
      title: 'Change Request Pending Review',
      description: 'Change request CR-2026-0002 for Business Address is pending ESSI review. Expected response within 5 business days.',
      severity: 'medium',
      date: '15-Nov-2026',
      action: 'View Request',
      dismissed: false
    },
    {
      id: '3',
      title: 'Employee Document Expiring Soon',
      description: 'SECP Certificate for employer 3-61-0001 expires on 31-Dec-2026. Please renew and upload the updated document.',
      severity: 'medium',
      date: '01-Dec-2026',
      action: 'Upload Document',
      dismissed: false
    },
    {
      id: '4',
      title: 'System Maintenance Notice',
      description: 'Scheduled maintenance on 25-Nov-2026 from 02:00 AM to 04:00 AM. Portal may be temporarily unavailable.',
      severity: 'low',
      date: '25-Nov-2026',
      action: null,
      dismissed: true
    },
    {
      id: '5',
      title: 'Annual Return Filing Reminder',
      description: 'Annual return for FY 2025-26 is due by 31-Dec-2026. Please prepare your F-4 and F-5 statements.',
      severity: 'high',
      date: '01-Dec-2026',
      action: 'Generate F-4',
      dismissed: false
    },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', iconColor: 'text-red-600' };
      case 'medium':
        return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500', iconColor: 'text-amber-600' };
      case 'low':
        return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500', iconColor: 'text-blue-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', dot: 'bg-gray-500', iconColor: 'text-gray-600' };
    }
  };

  return (
    <Card>
      <h3 className='text-lg font-semibold text-[#17321f] mb-4'>System Alerts</h3>
      <div className='space-y-3'>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getSeverityStyles(alert.severity).bg} ${getSeverityStyles(alert.severity).border} border rounded-lg p-4 transition-all ${alert.dismissed ? 'opacity-50' : ''}`}
            style={{ borderLeft: `4px solid` }}
          >
            <div className='flex gap-3'>
              <div className='flex-shrink-0 mt-1'>
                <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityStyles(alert.severity).dot}`} />
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between gap-4'>
                  <div className='flex-1 min-w-0'>
                    <h4 className={`font-semibold ${getSeverityStyles(alert.severity).text}`}>
                      {alert.title}
                    </h4>
                    <p className='text-sm text-[#3d5a45] mt-1'>{alert.description}</p>
                    <div className='flex items-center gap-4 mt-2 text-xs text-[#3d5a45]'>
                      <span className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {alert.date}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${getSeverityStyles(alert.severity).bg} ${getSeverityStyles(alert.severity).text}`}>
                        {alert.severity}
                      </span>
                      {alert.dismissed && (
                        <span className='px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-gray-100 text-gray-600'>
                          Dismissed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center gap-2 flex-shrink-0'>
                    {alert.action && !alert.dismissed && (
                      <Button
                        variant='ghost'
                        className='min-h-[32px] px-3 text-xs'
                      >
                        {alert.action}
                      </Button>
                    )}
                    {!alert.dismissed && (
                      <button className='p-1 rounded transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50' aria-label='Dismiss'>
                        <X className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 pt-6 border-t border-[#cfe4d5]'>
        <h4 className='font-semibold text-[#17321f] mb-3'>Notification Settings</h4>
        <div className='space-y-4'>
          <label className='flex items-center justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#3d5a45]' />
              <div>
                <p className='font-medium text-[#17321f]'>Email Notifications</p>
                <p className='text-sm text-[#3d5a45]'>Receive important updates via email</p>
              </div>
            </div>
            <input type='checkbox' className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
          </label>
          <label className='flex items-center justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#3d5a45]' />
              <div>
                <p className='font-medium text-[#17321f]'>SMS Notifications</p>
                <p className='text-sm text-[#3d5a45]'>Receive urgent alerts via SMS</p>
              </div>
            </div>
            <input type='checkbox' className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
          </label>
          <label className='flex items-center justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#3d5a45]' />
              <div>
                <p className='font-medium text-[#17321f]'>Contribution Due Reminders</p>
                <p className='text-sm text-[#3d5a45]'>Get reminded before contribution due dates</p>
              </div>
            </div>
            <input type='checkbox' className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
          </label>
          <label className='flex items-center justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#3d5a45]' />
              <div>
                <p className='font-medium text-[#17321f]'>Change Request Updates</p>
                <p className='text-sm text-[#3d5a45]'>Notifications for change request status changes</p>
              </div>
            </div>
            <input type='checkbox' className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' defaultChecked />
          </label>
          <label className='flex items-center justify-between cursor-pointer'>
            <div className='flex items-center gap-3'>
              <Bell className='w-5 h-5 text-[#3d5a45]' />
              <div>
                <p className='font-medium text-[#17321f]'>System Maintenance Notices</p>
                <p className='text-sm text-[#3d5a45]'>Get notified about scheduled maintenance</p>
              </div>
            </div>
            <input type='checkbox' className='w-5 h-5 text-[#067a35] border-[#b9d6c4] rounded focus:ring-[#2fae9f]' />
          </label>
        </div>
      </div>
    </Card>
  );
};

export default NotificationsPage;
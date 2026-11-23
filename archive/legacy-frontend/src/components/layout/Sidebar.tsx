import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/company-profile/business', icon: Building2 },
    { name: 'Employee Management', path: '/employees', icon: Users },
    { name: 'Monthly Contributions', path: '/contributions', icon: FileText },
    { name: 'Contributions', path: '/contributions-sub/monthly', icon: FileText },
    { name: 'Challans & Payments', path: '/payments/challan', icon: CreditCard },
    { name: 'Reports & Statements', path: '/reports/contribution', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications/inbox', icon: Bell },
    { name: 'Help & Support', path: '/support', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Registration Review', path: '/admin/registrations', icon: FileText },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Change Requests', path: '/admin/change-requests', icon: FileText },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className='w-64 bg-[#0b4d24] text-white flex flex-col'>
      <div className='p-6 flex items-center gap-3'>
        <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center'>
          <span className='text-[#0b4d24] font-bold text-xl'>E</span>
        </div>
        <div className='flex flex-col'>
          <span className='font-bold text-lg leading-none'>ESSI</span>
          <span className='text-[10px] uppercase tracking-wider opacity-80'>Sindh Employer Portal</span>
        </div>
      </div>

      <nav className='flex-1 px-4 py-4 space-y-1 overflow-y-auto'>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-[#067a35] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} />
            <span className='text-sm font-medium'>{item.name}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className='pt-4 mt-4 border-t border-white/10'>
              <div className='px-4 pb-2'>
                <Shield className='w-4 h-4 opacity-60' />
                <span className='ml-2 text-xs font-bold uppercase tracking-wider opacity-60'>Admin Panel</span>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-[#067a35] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className='text-sm font-medium'>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      <div className='p-4 border-t border-white/10'>
        <button
          onClick={() => dispatch(logout())}
          className='flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-colors'
        >
          <LogOut size={20} />
          <span className='text-sm font-medium'>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

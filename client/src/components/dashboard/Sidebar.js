import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, List, LifeBuoy, BookOpen, BarChart2, Zap, Settings, Share2, HelpCircle, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm font-medium ${
          isActive
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      {icon}
      <span className="ml-3">{children}</span>
    </NavLink>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="font-bold text-xl text-gray-800">BDG</div>
        <div className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">Free</div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <NavItem to="/dashboard" icon={<Home size={20} />}>Dashboard</NavItem>
          <NavItem to="/projects" icon={<List size={20} />}>Projects</NavItem>
          <NavItem to="/support" icon={<LifeBuoy size={20} />}>Support</NavItem>
          <NavItem to="/knowledge" icon={<BookOpen size={20} />}>Knowledgebase</NavItem>
          <NavItem to="/analytics" icon={<BarChart2 size={20} />}>Analytics</NavItem>
        </nav>
      </div>

      {/* New Project Button */}
      <div className="p-4">
        <button
          onClick={() => navigate('/projects/new')}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md py-2 px-4 flex items-center justify-center"
        >
          <Plus size={16} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 pt-4 pb-3">
        <nav className="space-y-1 px-2">
          <NavItem to="/settings" icon={<Settings size={20} />}>Settings</NavItem>
          <NavItem to="/help" icon={<HelpCircle size={20} />}>Help</NavItem>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>

      {/* User */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="bg-yellow-500 text-white h-8 w-8 rounded-full flex items-center justify-center font-medium">
            {currentUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{currentUser?.fullName || 'User'}</p>
            <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

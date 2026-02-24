'use client'
import React, { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Bell,
  Settings,
  LifeBuoy,
  Mail,
  LogOut,
  ClipboardList,
  Search,
  Menu
} from 'lucide-react'
import Home from './UserForm.jsx'

function Userdashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)


  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <div className='mt-6'><Home /></div>
      case 'Tasks':
        return (
          <div>
            <h1 className="text-xl font-semibold">Tasks Page</h1>
            <p className="text-gray-600 mt-2">Your task management tools go here.</p>
          </div>
        )
      case 'Calendar':
        return (
          <div>
            <h1 className="text-xl font-semibold">Calendar Page</h1>
            <p className="text-gray-600 mt-2">View your scheduled events here.</p>
          </div>
        )
      case 'Settings':
        return <div><h1 className="text-xl font-semibold">Settings Page</h1></div>
      case 'Support':
        return <div><h1 className="text-xl font-semibold">Support Page</h1></div>
      case 'Contact':
        return <div><h1 className="text-xl font-semibold">Contact Page</h1></div>
      case 'Logout':
        return <div><h1 className="text-xl font-semibold">Logged out</h1></div>
      default:
        return <div>Page not found.</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
     <header className="bg-[#f4793d] fixed z-50 w-full border-b border-[#f4793d]">
  <div className="h-16 px-4 md:px-6 flex items-center justify-between">
    {/* Left Section: Menu Toggle + Logo */}
    <div className="flex items-center space-x-4">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white md:hidden">
        <Menu />
      </button>
      <img src="/Images/logo.png" className="h-10" alt="Logo" />
    </div>

    {/* Center Section: Desktop Search */}
    <div className="hidden md:flex flex-1 justify-center">
      <input
        type="text"
        placeholder="Search task"
        className="px-3 py-1 border border-[#f4793d] bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white rounded-full w-64"
      />
    </div>

    {/* Right Section: Bell + Search (Mobile) + Avatar */}
    <div className="flex items-center space-x-4">
      {/* Search Icon (Mobile) */}
      <button onClick={() => setShowSearch(!showSearch)} className="text-white md:hidden">
        <Search />
      </button>

      <button className="relative">
        <Bell size={20} className="text-white" />
      </button>
      <div className="flex items-center space-x-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="text-right text-white hidden sm:block">
          <div className="font-medium text-sm">Totok Michael</div>
          <div className="text-xs text-blue-100">tmichael20@mail.com</div>
        </div>
      </div>
    </div>
  </div>

  {/* Responsive Search Dropdown */}
  {showSearch && (
    <div className="md:hidden px-4 py-2 bg-white shadow">
      <input
        type="text"
        placeholder="Search task"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f4793d]"
      />
    </div>
  )}
</header>


      {/* Sidebar + Content */}
      <div className="flex pt-16 ">
        {/* Sidebar */}
        <aside className={`fixed  md:relative z-40 bg-white border-r border-gray-200 w-full h-full p-6 space-y-4 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <nav className="space-y-2 mt-4 fi " >
            <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => handleTab('Dashboard')} />
            <NavItem icon={<ClipboardList size={20} />} label="Tasks" active={activeTab === 'Tasks'} onClick={() => handleTab('Tasks')} />
            <NavItem icon={<Calendar size={20} />} label="Calendar" active={activeTab === 'Calendar'} onClick={() => handleTab('Calendar')} />
            <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => handleTab('Settings')} />
            <NavItem icon={<LifeBuoy size={20} />} label="Support" active={activeTab === 'Support'} onClick={() => handleTab('Support')} />
            <NavItem icon={<Mail size={20} />} label="Contact" active={activeTab === 'Contact'} onClick={() => handleTab('Contact')} />
            <div className='border-t border-gray-300 pt-4 mt-6'>
              <NavItem icon={<LogOut size={20} />} label="Logout" active={activeTab === 'Logout'} onClick={() => handleTab('Logout')} />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )

  function handleTab(tab) {
    setActiveTab(tab)
    setSidebarOpen(false) // close sidebar on tab click (mobile)
  }
}

function NavItem({ icon, label, active = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition
        ${active ? 'bg-blue-100 text-[#f4793d]' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </div>
  )
}

export default Userdashboard
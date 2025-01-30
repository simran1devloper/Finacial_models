import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

function AdminDashboard() {
  const navigate = useNavigate();

  const adminActions = [
    { name: 'Add Work Order', path: '/admin/add-work-order', icon: 'plus.png' },
    { name: 'Add Certificate', path: '/admin/add-certificate', icon: 'certificate.png' },
    { name: 'Start Auction', path: '/admin/start-auction', icon: 'law.png' },
    { name: 'View Auction', path: '/admin/view-auction', icon: 'visibility.png' },
    { name: 'Approve Work Order', path: '/admin/approve-work-order', icon: 'check-mark.png' },
    { name: 'View Blockchain', path: '/admin/view-blockchain', icon: 'blockchain.png' },
    { name: 'View Work Orders', path: '/admin/view-work-orders', icon: 'search-list.png' },
  ];


  const handleLogout = () => {
    // Perform logout actions here (e.g., clear user session, tokens, etc.)
    // Then navigate to the home page
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <img src={`${process.env.PUBLIC_URL}/img/logout.png`} alt="Logout" className="w-5 h-5 mr-2" />
          Logout
        </button>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {adminActions.map((action) => (
          <Link
            key={action.name}
            to={action.path}
            className="bg-white p-6 rounded-lg shadow-md hover:bg-accent flex items-center"
          >
            <img
              src={`${process.env.PUBLIC_URL}/img/${action.icon}`}
              alt={action.name}
              className="w-8 h-8 mr-4"
            />
            <h2 className="text-2xl font-semibold text-primary">{action.name}</h2>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';

function VendorDashboard() {
  const navigate = useNavigate();

  const vendorActions = [
    { name: 'Participate in Auction', path: '/vendor/participate-auction', icon: 'participation.png' },
    { name: 'View Auction', path: '/vendor/view-auction', icon: 'visibility.png' },
  ];


  const handleLogout = () => {
    // Perform logout logic here (e.g., clear local storage, reset state)
    // Then navigate to the login page
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Vendor Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <img src={`${process.env.PUBLIC_URL}/img/logout.png`} alt="Logout" className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {vendorActions.map((action) => (
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

export default VendorDashboard;

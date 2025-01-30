import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

function Home({ setUser }) {
  const navigate = useNavigate();


  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center mb-8">
            <img src={process.env.PUBLIC_URL + '/img/college.png'} alt="Logo" className="w-full max-w-[175px]" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">Work Order Management System</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
              <Login role="admin" setUser={setUser} />
            </div>
            <div className="bg-gray-100 bg-opacity-90 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-center mb-4">Vendor Login</h2>
              <Login role="vendor" setUser={setUser} />
            </div>
          </div>
        </div>
      </div>
      <div className="py-8">
        <div className="container mx-auto">
          <div className="bg-gray-100 bg-opacity-90 p-6 rounded-lg shadow-md flex flex-col items-center max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Verify Document</h2>
            <button
              onClick={() => navigate('/verify')}
              className="bg-primary text-white px-4 py-2 rounded inline-flex items-center"
            >
              <img src={`${process.env.PUBLIC_URL}/img/verify.png`} alt="Verify" className="w-5 h-5 mr-2" />
              Verify
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
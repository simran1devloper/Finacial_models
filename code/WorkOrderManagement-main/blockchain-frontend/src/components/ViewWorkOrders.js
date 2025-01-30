import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function ViewWorkOrders() {
  const [workOrders, setWorkOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/view_work_orders');
      setWorkOrders(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      setWorkOrders([]);
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return <div className="text-center mt-8">Loading work orders...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Header />
      <div className="flex justify-center mt-6 mb-6">
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
        >
          <img src={`${process.env.PUBLIC_URL}/img/back.png`} alt="Back" className="w-5 h-5 mr-2" />
          Back to Admin Dashboard
        </button>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Work Orders</h2>
      {workOrders.length === 0 ? (
        <p className="text-center">No work orders found.</p>
      ) : (
        <div className="space-y-6">
          {workOrders.map((order, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Work Order #{order.ID}</h3>
              <p><strong>Issuer:</strong> {order.Issuer}</p>
              <p><strong>Department:</strong> {order.Department}</p>
              <p><strong>Date:</strong> {new Date(order.Date).toLocaleString()}</p>
              <p><strong>Implementation Date:</strong> {new Date(order.ImplementationDate).toLocaleString()}</p>
              <p><strong>Circular:</strong> {order.Circular}</p>
              <p><strong>Status:</strong> {order.Status}</p>
              {order.Approvals && (
                <div className="mt-4">
                  <h4 className="font-semibold">Approvals:</h4>
                  {order.Approvals.length === 0 ? (
                    <p>No approvals yet.</p>
                  ) : (
                    <ul className="list-disc pl-5">
                      {order.Approvals.map((approval, idx) => (
                        <li key={idx}>
                          {approval.ApproverID} - {approval.Status} on {new Date(approval.Date).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6 mb-6">
        <button
          onClick={handleBackToDashboard}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
        >
          <img src={`${process.env.PUBLIC_URL}/img/back.png`} alt="Back" className="w-5 h-5 mr-2" />
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

export default ViewWorkOrders;

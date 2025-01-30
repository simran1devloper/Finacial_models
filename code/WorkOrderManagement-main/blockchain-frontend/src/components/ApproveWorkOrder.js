import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function ApproveWorkOrder() {
  const navigate = useNavigate();
  const [workOrderId, setWorkOrderId] = useState('');
  const [approverID, setApproverID] = useState('');
  const [status, setStatus] = useState('Approved');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post(`http://localhost:8080/approve_work_order/${workOrderId}`, {
        ApproverID: approverID,
        Status: status
      });
      setMessage('Work order approved successfully!');
      setWorkOrderId('');
      setApproverID('');
      setStatus('Approved');
    } catch (error) {
      console.error('Error approving work order:', error);
      setMessage('Failed to approve work order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Header />
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Approve Work Order</h2>
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={workOrderId}
          onChange={(e) => setWorkOrderId(e.target.value)}
          placeholder="Enter Work Order ID"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          value={approverID}
          onChange={(e) => setApproverID(e.target.value)}
          placeholder="Approver ID"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Postponed">Postponed</option>
        </select>
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-56 px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'} text-white flex items-center justify-center`}
            disabled={isLoading}
          >
            <img src={`${process.env.PUBLIC_URL}/img/check-mark-white.png`} alt="Approve" className="w-5 h-5 mr-2" />
            {isLoading ? 'Submitting...' : 'Approve Work Order'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-2 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded`}>
          {message}
        </div>
      )}

      <div className="flex justify-center mt-4">
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

export default ApproveWorkOrder;

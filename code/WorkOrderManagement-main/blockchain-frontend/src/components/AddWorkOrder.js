import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function AddWorkOrder() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const [workOrder, setWorkOrder] = useState({
    Issuer: '',
    Department: '',
    ImplementationDate: '',
    Circular: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedWorkOrderId, setAddedWorkOrderId] = useState(null);

  const handleChange = (e) => {
    setWorkOrder({ ...workOrder, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submission started, isLoading:', true);
    try {
      const formattedWorkOrder = {
        Issuer: workOrder.Issuer,
        Department: workOrder.Department,
        ImplementationDate: new Date(workOrder.ImplementationDate).toISOString(),
        Circular: workOrder.Circular,
      };
      console.log('Sending work order:', formattedWorkOrder);
      const response = await axios.post('http://localhost:8080/add_work_order', formattedWorkOrder);
      console.log('Work order added:', response.data);
      setAddedWorkOrderId(response.data.ID);
      setIsSubmitted(true);
      setWorkOrder({
        Issuer: '',
        Department: '',
        ImplementationDate: '',
        Circular: '',
      });
    } catch (error) {
      console.error('Error adding work order:', error.response ? error.response.data : error.message);
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
      console.log('Submission ended, isLoading:', false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Header />

      <h2 className="text-3xl font-bold text-primary mb-6 text-center">Add Work Order</h2>
      {isSubmitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Work order has been added successfully.</span>
          {addedWorkOrderId && (
            <p className="mt-2">Work Order ID: {addedWorkOrderId}</p>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Issuer"
          value={workOrder.Issuer}
          onChange={handleChange}
          placeholder="Issuer's Dept."
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="Department"
          value={workOrder.Department}
          onChange={handleChange}
          placeholder="Addressed Department"
          className="w-full px-3 py-2 mb-6 border rounded"
        />

        <label htmlFor="ImplementationDate" className="block mt-4 mb-2 font-semibold text-gray-700">
          Implementation Date
        </label>

        <input
          id="ImplementationDate"
          type="datetime-local"
          name="ImplementationDate"
          value={workOrder.ImplementationDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        <textarea
          name="Circular"
          value={workOrder.Circular}
          onChange={handleChange}
          placeholder="Circular Details"
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-48 px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'} text-white flex items-center justify-center`}
            disabled={isLoading}
          >
            <img src={`${process.env.PUBLIC_URL}/img/plus-whitepng.png`} alt="Add" className="w-5 h-5 mr-2" />
            {isLoading ? 'Adding...' : 'Add Work Order'}
          </button>
        </div>
      </form>
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

export default AddWorkOrder;

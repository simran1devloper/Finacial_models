import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function ParticipateAuction() {
  const navigate = useNavigate();
  const [auctionId, setAuctionId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:8080/participate_auction', {
        Amount: parseFloat(amount),
        AuctionId: auctionId // Keep as string
      });
      setMessage('Bid placed successfully!');
      setAuctionId('');
      setAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError('Failed to place bid. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleBackToDashboard = () => {
    navigate('/vendor');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Header />
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Participate in Auction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
          placeholder="Enter Auction ID"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Bid Amount"
          className="w-full px-3 py-2 border rounded"
          required
          step="0.01"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-48 px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'} text-white flex items-center justify-center`}
            disabled={isLoading}
          >
            <img src={`${process.env.PUBLIC_URL}/img/bidding.png`} alt="Place Bid" className="w-5 h-5 mr-2" />
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
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

export default ParticipateAuction;

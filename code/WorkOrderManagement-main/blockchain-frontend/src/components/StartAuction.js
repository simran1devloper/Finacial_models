

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function StartAuction() {
  const navigate = useNavigate();
  const [auction, setAuction] = useState({
    Item: '',
    InitialBid: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedAuctionId, setAddedAuctionId] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        console.log('Fetching recommendations...');
        const response = await axios.post('http://172.22.213.40:8000/recommendations/', {
          user_id: 2,
        });

        // Log the entire response for debugging
        console.log('Full recommendations response:', response);

        // Assuming the response is an object with a 'recommendations' property
        if (response.data && response.data.recommendations) {
          setRecommendations(response.data.recommendations);
        } else {
          console.log('Invalid data format: "recommendations" property not found');
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, []);

  const handleChange = (e) => {
    setAuction({ ...auction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auctionData = {
        Item: auction.Item,
        Bids: [{ Amount: parseFloat(auction.InitialBid) }]
      };
      const response = await axios.post('http://localhost:8080/start_auction', auctionData);
      setAddedAuctionId(response.data.ID);
      setIsSubmitted(true);
      setAuction({ Item: '', InitialBid: '' });
    } catch (error) {
      console.error('Error starting auction:', error.response ? error.response.data : error.message);
      setIsSubmitted(false);
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
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Start New Auction</h2>
      {isSubmitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Auction has been started successfully.</span>
          {addedAuctionId && (
            <p className="mt-2">Auction ID: {addedAuctionId}</p>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Item"
          value={auction.Item}
          onChange={handleChange}
          placeholder="Item Name"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          name="InitialBid"
          value={auction.InitialBid}
          onChange={handleChange}
          placeholder="Initial Bid Amount(in INR)"
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-48 px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'} text-white flex items-center justify-center`}
            disabled={isLoading}
          >
            <img src={`${process.env.PUBLIC_URL}/img/law-white.png`} alt="Start" className="w-5 h-5 mr-2" />
            {isLoading ? 'Starting...' : 'Start Auction'}
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

      {/* Displaying recommendations */}
      {recommendations.length > 0 && (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-primary mb-4">Recommended Vendors</h3>
    <ul>
      {recommendations.map((recommendation, index) => (
        <li key={index} className="mb-2 p-2 border rounded">
          {recommendation.vendor_name} - Specialization: {recommendation.specialization}
        </li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default StartAuction;



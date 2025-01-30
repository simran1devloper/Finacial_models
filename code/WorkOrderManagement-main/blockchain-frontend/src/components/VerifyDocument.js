import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

function VerifyDocument() {
  const [id, setId] = useState('');
  const [type, setType] = useState('work_order');
  const [result, setResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setResult(null);

    try {
      const response = await axios.get(`http://localhost:8080/verify_${type}/${id}`);

      // Simulate a delay
      setTimeout(() => {
        setResult(response.data);
        setIsVerifying(false);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setResult({ verified: false });
        setIsVerifying(false);
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Verify Document</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="work_order">Work Order</option>
          <option value="certificate">Certificate</option>
        </select>
        <input
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <div className="flex justify-center">
          <button type="submit" className="w-32 bg-primary text-white px-4 py-2 rounded flex items-center justify-center" disabled={isVerifying}>
            {isVerifying ? (
              'Verifying...'
            ) : (
              <>
                <img src={`${process.env.PUBLIC_URL}/img/verify.png`} alt="Verify" className="w-5 h-5 mr-2" />
                Verify
              </>
            )}
          </button>
        </div>

      </form>
      {isVerifying && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Verifying...</h2>
        </div>
      )}
      {result && !isVerifying && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-4">Verification Result</h2>
          {result.verified ? (
            <div className="text-green-600 text-xl">
              <span className="font-bold">✓</span> Document Verification Successful
              <p className="text-sm mt-2">Verified by Sign Protocol and Authenticated by Avail</p>
            </div>
          ) : (
            <div className="text-red-600 text-xl">
              <span className="font-bold">✗</span> Document Not Verified
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyDocument;

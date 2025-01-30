import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Header from './Header';

function AddCertificate() {
  const [certificate, setCertificate] = useState({
    Recipient: '',
    Issuer: '',
    Details: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedCertificateId, setAddedCertificateId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCertificate({ ...certificate, [e.target.name]: e.target.value });
  };

  const generatePDF = (certificateData) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: 'a4',
    });

    // Background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Header - College Name
    doc.setFontSize(28);
    doc.setTextColor(30, 144, 255);  // Dodger blue
    doc.setFont('Helvetica', 'bold');
    doc.text('XYZ College of Technology', doc.internal.pageSize.width / 2, 60, { align: 'center' });

    // Subtitle - Certificate of Achievement
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);  // Black
    doc.setFont('Times', 'italic');
    doc.text('Certificate of Achievement', doc.internal.pageSize.width / 2, 100, { align: 'center' });

    // Recipient and details
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`This is to certify that`, doc.internal.pageSize.width / 2, 160, { align: 'center' });

    // Recipient name
    doc.setFontSize(20);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(50, 50, 50);  // Dark gray
    doc.text(certificateData.Recipient, doc.internal.pageSize.width / 2, 190, { align: 'center' });

    // Details of the certification
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(certificateData.Details, doc.internal.pageSize.width / 2, 230, { align: 'center' });

    // Date
    doc.setFontSize(14);
    doc.text(`Date: ${new Date(certificateData.Date).toLocaleDateString()}`, doc.internal.pageSize.width - 150, 320);

    // Issuer Signature Area
    doc.setFontSize(16);
    doc.text(`Issued by: ${certificateData.Issuer}`, 60, 320);

    // Border
    doc.setDrawColor(30, 144, 255); // Dodger blue
    doc.setLineWidth(3);
    doc.rect(30, 30, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 60);

    // Save PDF
    doc.save('certificate.pdf');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/add_certificate', certificate);
      console.log('Certificate added:', response.data);
      setAddedCertificateId(response.data.ID);
      setIsSubmitted(true);
      generatePDF(response.data);
      setCertificate({ Recipient: '', Issuer: '', Details: '' });
    } catch (error) {
      console.error('Error adding certificate:', error.response ? error.response.data : error.message);
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
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Add Certificate</h2>
      {isSubmitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Certificate has been added successfully.</span>
          {addedCertificateId && (
            <p className="mt-2">Certificate ID: {addedCertificateId}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="Recipient"
          value={certificate.Recipient}
          onChange={handleChange}
          placeholder="Recipient"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="Issuer"
          value={certificate.Issuer}
          onChange={handleChange}
          placeholder="Issuer"
          className="w-full px-3 py-2 border rounded"
          required
        />
        <textarea
          name="Details"
          value={certificate.Details}
          onChange={handleChange}
          placeholder="Certificate Details"
          className="w-full px-3 py-2 border rounded"
          rows="4"
          required
        />
        <div className="flex justify-center">
          <button
            type="submit"
            className={`w-48 px-4 py-2 rounded ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-secondary'} text-white flex items-center justify-center`}
            disabled={isLoading}
          >
            <img src={`${process.env.PUBLIC_URL}/img/certificate-white.png`} alt="Add" className="w-5 h-5 mr-2" />
            {isLoading ? 'Adding...' : 'Add Certificate'}
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

export default AddCertificate;

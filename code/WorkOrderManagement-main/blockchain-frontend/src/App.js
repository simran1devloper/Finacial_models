import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
//import { Navigate, Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import VendorDashboard from './components/VendorDashboard';
import VerifyDocument from './components/VerifyDocument';
import AddWorkOrder from './components/AddWorkOrder';
import ViewWorkOrders from './components/ViewWorkOrders';
import AddCertificate from './components/AddCertificate';
import ViewBlockchain from './components/ViewBlockchain';
import Login from './components/Login';
import StartAuction from './components/StartAuction';
import ViewAuction from './components/ViewAuction';
import ApproveWorkOrder from './components/ApproveWorkOrder';
import ViewAuctionVendor from './components/ViewAuctionVendor';
import ParticipateAuction from './components/ParticipateAuction';




const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};
// const logout = () => {
//   setUser(null);
// };



function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App" style={{
      position: 'relative',
      minHeight: '100vh',
    }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${process.env.PUBLIC_URL}/img/bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.12,
        zIndex: -1,
      }}/>
      <Router>
      <div className="min-h-screen relative">

          <div className="relative">
            <Routes>
              <Route path="/" element={<Home setUser={setUser} />} />
              <Route path="/verify" element={<VerifyDocument />} />
              <Route path="/admin/login" element={<Login role="admin" setUser={setUser} />} />
              <Route path="/vendor/login" element={<Login role="vendor" setUser={setUser} />} />
              <Route element={<ProtectedRoute isAllowed={!!user} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/add-work-order" element={<AddWorkOrder />} />
                <Route path="/admin/view-work-orders" element={<ViewWorkOrders />} />
                <Route path="/admin/add-certificate" element={<AddCertificate />} />
                <Route path="/admin/view-blockchain" element={<ViewBlockchain />} />
                <Route path="/admin/start-auction" element={<StartAuction />} />
                <Route path="/admin/view-auction" element={<ViewAuction />} />
                <Route path="/admin/approve-work-order" element={<ApproveWorkOrder />} />
                <Route path="/vendor" element={<VendorDashboard />} />
                <Route path="/vendor/view-auction" element={<ViewAuctionVendor />} />
                <Route path="/vendor/participate-auction" element={<ParticipateAuction />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sampleUsers = {
  admin: [
    { username: 'admin1', password: 'password1' },
    { username: 'admin2', password: 'password2' }
  ],
  vendor: [
    { username: 'vendor1', password: 'vendorpass' }
  ]
};

function Login({ role, setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = sampleUsers[role];
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setUser(user);
      navigate(role === 'admin' ? '/admin' : '/vendor');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-center">
        <button type="submit" className="w-32 bg-primary text-white px-4 py-2 rounded flex items-center justify-center">
          <img src={`${process.env.PUBLIC_URL}/img/login.png`} alt="Login" className="w-5 h-5 mr-2" />
          Login
        </button>
      </div>


    </form>
  );
}

export default Login;

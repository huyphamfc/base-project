import React, { useState } from 'react';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');

  const handleLogIn = (e) => {
    e.preventDefault();

    if (!email || !password) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((result) => setNotification(result.status));
  };

  const handleLogOut = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/users/logout`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((result) => console.log(result));
  };

  return (
    <form onSubmit={handleLogIn}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <span>{notification}</span>
      <button type="submit">Login</button>
      <button type="button" onClick={handleLogOut}>
        Logout
      </button>
    </form>
  );
}

export default Auth;

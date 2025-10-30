import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);

  if (!user) {
    // If there's no user, redirect to login
    navigate('/login');
    return null;
  }

  const handleSave = () => {
    // For now, this only updates localStorage and local state.
    const updatedUser = { ...user, name, email };
    localStorage.setItem('cloudscape_user', JSON.stringify(updatedUser));
    setEditing(false);
    // Optionally show a toast or confirmation
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl p-10">
        <h1 className="text-3xl font-light mb-6">My Profile</h1>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-400">Name</label>
            <input
              className="w-full mt-2 p-3 bg-transparent border border-gray-700 rounded outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              className="w-full mt-2 p-3 bg-transparent border border-gray-700 rounded outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editing}
            />
          </div>

          <div className="flex gap-4">
            {editing ? (
              <>
                <button onClick={handleSave} className="px-6 py-3 bg-white text-black">Save</button>
                <button onClick={() => { setEditing(false); setName(user.name); setEmail(user.email); }} className="px-6 py-3 border border-gray-700">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="px-6 py-3 bg-white text-black">Edit</button>
                <button onClick={() => { logout(); navigate('/'); }} className="px-6 py-3 border border-gray-700">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

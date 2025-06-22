import React, { useState } from 'react';
import Swal from 'sweetalert2';

function Profile() {
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [ageGroup, setAgeGroup] = useState(localStorage.getItem('ageGroup') || '');

  const handleSave = () => {
    if (!name || !ageGroup) {
      Swal.fire('Error', 'Both fields are required', 'error');
      return;
    }
    localStorage.setItem('name', name);
    localStorage.setItem('ageGroup', ageGroup);
    Swal.fire('Saved!', 'Your profile has been updated.', 'success');
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-bold">Edit Profile</h2>
      <div className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <select
          className="w-full p-2 border rounded"
          value={ageGroup}
          onChange={e => setAgeGroup(e.target.value)}
        >
          <option value="">Select Age Group</option>
          <option value="Under 18">Under 18</option>
          <option value="18-25">18-25</option>
          <option value="26-35">26-35</option>
          <option value="36-50">36-50</option>
          <option value="51+">51+</option>
        </select>
        <button onClick={handleSave} className="bg-blue-600 text-white w-full p-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profile;

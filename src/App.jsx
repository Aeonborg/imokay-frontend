import React, { useState, useEffect } from "react";

function App() {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);

  // Fetch status for current user
  const fetchStatus = async (id) => {
    const res = await fetch(`https://your-backend.onrender.com/status/${id}`);
    const data = await res.json();
    setStatus(data.status);
  };

  // Handle check-in
  const handleCheckin = async () => {
    if (!userId) return;
    await fetch("https://your-backend.onrender.com/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    fetchStatus(userId);
  };

  // Handle change user
  const handleChangeUser = async () => {
    const email = prompt("Enter user's email:");

    const response = await fetch("https://your-backend.onrender.com/findOrCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.error && data.error === "Missing fields to create new user") {
      // Ask for extra info only if user doesn't exist
      const name = prompt("Enter new user's name:");
      const contactEmail = prompt("Enter contact's email:");
      const intervalHours = prompt("Enter check-in interval (hours):");

      const createResponse = await fetch("https://your-backend.onrender.com/findOrCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, contactEmail, intervalHours })
      });

      const createData = await createResponse.json();
      setUserId(createData.userId);
      fetchStatus(createData.userId);
    } else {
      // Existing user found
      setUserId(data.userId);
      fetchStatus(data.userId);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ImOkay</h1>
      <button onClick={handleCheckin}>👍 Tap I'm Okay</button>
      <button onClick={handleChangeUser} style={{ marginLeft: "10px" }}>
        🔄 Change User
      </button>
      <div style={{ marginTop: "20px", fontSize: "40px" }}>
        {status === "okay" && "👍"}
        {status === "missed" && "👎"}
        {!status && "❓"}
      </div>
    </div>
  );
}

export default App;

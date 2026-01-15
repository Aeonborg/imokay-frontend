import React, { useState, useEffect } from "react";

function App() {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);
  const [intervalHours, setIntervalHours] = useState(168); // default 1 week

  // Fetch status
  const fetchStatus = async (id) => {
    const res = await fetch(`https://your-backend.onrender.com/status/${id}`);
    const data = await res.json();
    setStatus(data.status);
    setIntervalHours(data.intervalHours);
  };

  // Check-in
  const handleCheckin = async () => {
    if (!userId) return;
    await fetch("https://your-backend.onrender.com/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    fetchStatus(userId);
  };

  // Double-click thumb → new user
  const handleNewUser = async () => {
    const email = prompt("Enter user's email:");
    if (!email) return;

    const response = await fetch("https://your-backend.onrender.com/findOrCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.error && data.error === "Missing fields to create new user") {
      const name = prompt("Enter new user's name:");
      const contactPerson = prompt("Enter contact person:");
      const contactEmail = prompt("Enter contact's email:");
      const message = prompt("Enter message:");
      const intervalHours = prompt("Enter interval (hours):");

      const createResponse = await fetch("https://your-backend.onrender.com/findOrCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, contactPerson, contactEmail, message, intervalHours })
      });

      const createData = await createResponse.json();
      setUserId(createData.userId);
      fetchStatus(createData.userId);
    } else {
      setUserId(data.userId);
      fetchStatus(data.userId);
    }
  };

  // Edit interval via clock icon
  const handleEditInterval = async () => {
    const newInterval = prompt("Enter new interval (hours):", intervalHours);
    if (!userId || !newInterval) return;

    await fetch("https://your-backend.onrender.com/updateInterval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, intervalHours: newInterval })
    });

    setIntervalHours(newInterval);
    fetchStatus(userId);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ImOkay</h1>
      <div
        style={{ fontSize: "100px", cursor: "pointer", color: status === "missed" ? "red" : "green" }}
        onClick={handleCheckin}
        onDoubleClick={handleNewUser}
      >
        {status === "okay" && "👍"}
        {status === "missed" && "👎"}
        {!status && "❓"}
      </div>
      <div
        style={{ fontSize: "30px", cursor: "pointer", marginTop: "20px" }}
        onClick={handleEditInterval}
      >
        ⏰
      </div>
    </div>
  );
}

export default App;

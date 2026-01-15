import React, { useState } from "react";

function App() {
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);
  const [intervalHours, setIntervalHours] = useState(168); // default 1 week

  // Fetch status from backend
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

  // Double-click thumb → create or load user
  const handleNewUser = async () => {
    const email = prompt("Enter user's email:");
    if (!email) return;

    try {
      const response = await fetch("https://your-backend.onrender.com/findOrCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      // Case 1: User exists
      if (data.userId) {
        setUserId(data.userId);
        await fetchStatus(data.userId);
        return;
      }

      // Case 2: User does not exist → prompt for details
      if (data.error && data.error === "Missing fields to create new user") {
        const name = prompt("Enter new user's name:");
        const contactPerson = prompt("Enter contact person:");
        const contactEmail = prompt("Enter contact's email:");
        const message = prompt("Enter message (default: Please Contact User):") || "Please Contact User";
        const intervalHours = prompt("Enter interval (hours, default 168):") || 168;

        const createResponse = await fetch("https://your-backend.onrender.com/findOrCreate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, contactPerson, contactEmail, message, intervalHours })
        });

        const createData = await createResponse.json();
        setUserId(createData.userId);
        await fetchStatus(createData.userId);
        return;
      }

      alert("Error creating or finding user: " + (data.error || "Unknown error"));
    } catch (err) {
      console.error("handleNewUser error:", err);
      alert("Failed to connect to backend.");
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

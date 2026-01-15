import { useState, useEffect } from "react";

const BACKEND_URL = "https://imokay-backend.onrender.com"; // your backend URL

function App() {
  const savedUser = localStorage.getItem("imokayUser");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  // Setup new user
  const handleSetup = async () => {
    const email = prompt("Enter your email:");
    const name = prompt("Enter your name:");
    const contactEmail = prompt("Enter your contact’s email:");
    const customMessage = prompt("Enter your custom message (optional):");
    const intervalHours = 168;

    const response = await fetch(`${BACKEND_URL}/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, contactEmail, intervalHours, message: customMessage }),
    });

    const data = await response.json();
    const userData = { name, email, contactEmail, intervalHours, message: customMessage, userId: data.userId };
    localStorage.setItem("imokayUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Change user (find or create)
const handleChangeUser = async () => {
  const name = prompt("Enter new user's name:");
  const email = prompt("Enter new user's email:");
  const contactEmail = prompt("Enter contact's email:");
  const intervalHours = prompt("Enter check-in interval (hours):");

  const response = await fetch("https://your-backend.onrender.com/findOrCreate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, contactEmail, intervalHours })
  });

  const data = await response.json();
  setUserId(data.userId);

  // Reset status so thumbs don’t stay stuck
  setStatus(null);

  // Fetch the new user’s status immediately
  const statusResponse = await fetch(`https://your-backend.onrender.com/status/${data.userId}`);
  const statusData = await statusResponse.json();
  setStatus(statusData.status);
};


  // Check-in
  const handleCheckin = async () => {
    await fetch(`${BACKEND_URL}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.userId }),
    });
    setStatus("okay");
  };

  // Fetch status
  useEffect(() => {
    const fetchStatus = async () => {
      if (user?.userId) {
        const response = await fetch(`${BACKEND_URL}/status/${user.userId}`);
        const data = await response.json();
        setStatus(data.status);
        setMessage(data.message);
      }
    };
    fetchStatus();
  }, [user]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>ImOkay</h1>
      {!user && <button onClick={handleSetup}>Setup</button>}
      {user && (
        <>
          <div style={{ fontSize: "100px", color: status === "okay" ? "green" : "black" }}>
            {status === "okay" ? "👍" : "👎"}
          </div>
          <p>{message}</p>
          <button
            onClick={handleCheckin}
            style={{
              fontSize: "30px",
              marginTop: "20px",
              padding: "20px",
              borderRadius: "50%",
              background: "green",
              color: "white",
            }}
          >
            Tap 👍 I'm Okay
          </button>
          <br />
          <button onClick={handleChangeUser} style={{ marginTop: "20px" }}>
            Change User
          </button>
        </>
      )}
    </div>
  );
}

export default App;

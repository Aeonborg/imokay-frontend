import { useState, useEffect } from "react";

function App() {
  const savedUser = localStorage.getItem("imokayUser");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [status, setStatus] = useState("okay");

  const handleSetup = () => {
    const name = prompt("Enter your name:");
    const email = prompt("Enter your email:");
    const contactEmail = prompt("Enter your contact’s email:");
    const userData = { name, email, contactEmail, intervalHours: 168 };
    localStorage.setItem("imokayUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleCheckin = () => {
    localStorage.setItem("lastCheckin", Date.now());
    setStatus("okay");
  };

  useEffect(() => {
    if (user) {
      const last = localStorage.getItem("lastCheckin");
      if (last) {
        const diffHours = (Date.now() - last) / (1000 * 60 * 60);
        if (diffHours > user.intervalHours) {
          setStatus("missed");
        }
      }
    }
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
        </>
      )}
    </div>
  );
}

export default App;

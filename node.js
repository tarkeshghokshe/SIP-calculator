const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tarkesh@007",
  database: "SIP"
});

// Register route (no hashing)
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error during lookup" });
    if (results.length > 0) return res.status(400).json({ message: "Email already registered" });

    // Insert user with plain-text password
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error during registration" });
        res.status(201).json({ message: "Registration successful" });
      }
    );
  });
});

// Login route (plain-text comparison)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid email or password" });

    if (password !== results[0].password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

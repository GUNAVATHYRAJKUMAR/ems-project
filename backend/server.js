const express = require("express");
console.log("🔥 THIS IS THE ACTIVE SERVER FILE");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

/* ===== MYSQL CONNECTION ===== */
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Rajutheparrot@123",
  database: "employee_db",   // ⭐ THIS is enough
  port: 3307
});


// 👉 ADD THIS AFTER connection
db.connect((err) => {
  if (err) {
    console.log("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});
db.connect((err) => {
  if (err) {
    console.log("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

/* ===== ROUTES ===== */

// Test route
app.get("/", (req, res) => {
  res.send("Backend working");
});

// GET employees (FROM DATABASE)
app.get("/employees", (req, res) => {
  db.query("SHOW TABLES", (err, tables) => {
    console.log("TABLES:", tables);

    db.query("SELECT * FROM employees", (err, result) => {
      console.log("DATA FROM TABLE:", result);
      res.json(result);
    });
  });
});
// ADD employee (TO DATABASE)
app.post("/employees", (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.query(
    "INSERT INTO employee (name, role) VALUES (?, ?)",
    [name, role],
    (err, result) => {
      if (err) {
        console.log("POST ERROR:", err);
        res.status(500).json({ error: "POST failed" });
      } else {
        res.json({ id: result.insertId, name, role });
      }
    }
  );
});

// DELETE employee
// UPDATE employee
app.put("/employees/:id", (req, res) => {
  const id = req.params.id;
  const { name, role } = req.body;

  db.query(
    "UPDATE employee SET name = ?, role = ? WHERE id = ?",
    [name, role, id],
    (err, result) => {
      if (err) {
        console.log("UPDATE ERROR:", err);
        res.status(500).json({ error: "UPDATE failed" });
      } else {
        res.json({ success: true });
      }
    }
  );
});
// COUNT employees
app.get("/employees/count", (req, res) => {
  db.query("SELECT COUNT(*) AS count FROM employees", (err, result) => {
    if (err) {
      console.log("COUNT ERROR:", err);
      res.status(500).json({ error: "COUNT failed" });
    } else {
      res.json(result[0]);
    }
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "1234") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

/* ===== START SERVER ===== */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
db.query("SELECT DATABASE() AS db", (err, result) => {
  console.log("CONNECTED DB:", result);
});
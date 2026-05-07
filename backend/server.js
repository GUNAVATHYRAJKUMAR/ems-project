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
  const { name, role, department } = req.body;

  if (!name || !role || !department) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.query(
    "INSERT INTO employees(name, role, department) VALUES (?, ?, ?)",
    [name, role, department],
    (err, result) => {
      if (err) {
        console.log("POST ERROR:", err);
        res.status(500).json({ error: "POST failed" });
      } else {
        res.json({ id: result.insertId, name, role, department });
      }
    }
  );
});

// DELETE employee
app.delete("/employees/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM employees WHERE id = ?",
    [id],
    (err, result) => {

      if(err){
        console.log("DELETE ERROR:", err);
        res.status(500).json({ error: "DELETE failed" });
      }

      else{
        res.json({ success: true });
      }

    }
  );

});
// UPDATE employee
app.put("/employees/:id", (req, res) => {
  const id = req.params.id;
  const { name, role, department } = req.body;

  db.query(
    "UPDATE employees SET name = ?, role = ?, department = ? WHERE id = ?",
    [name, role, department, id],
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

  if(email === "admin@gmail.com" && password === "1234"){

    res.json({
      success: true,
      user: {
        email: email
      }
    });

  }

  else{

    res.json({
      success: false
    });

  }

});
/* ===== START SERVER ===== */

app.listen(5000, () => {
  const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
});
db.query("SELECT DATABASE() AS db", (err, result) => {
  console.log("CONNECTED DB:", result);
});
app.get("/attendance-summary", (req, res) => {

  const query = `
    SELECT 
      status,
      COUNT(*) AS count
    FROM attendance
    GROUP BY status
  `;

  db.query(query, (err, result) => {

    if(err){
      res.status(500).json(err);
    }

    else{
      res.json(result);
    }

  });

});
const express = require("express");
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
  database: "employee_db",
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

/* ===== TEST ROUTE ===== */

app.get("/", (req, res) => {
  res.send("Backend working");
});

/* ===== GET EMPLOYEES ===== */

app.get("/employees", (req, res) => {

  db.query("SELECT * FROM employees", (err, result) => {

    if(err){
      console.log(err);
      res.status(500).json(err);
    }

    else{
      res.json(result);
    }

  });

});

/* ===== ADD EMPLOYEE ===== */

app.post("/employees", (req, res) => {

  const { name, role, department } = req.body;

  db.query(
    "INSERT INTO employees(name, role, department) VALUES (?, ?, ?)",
    [name, role, department],
    (err, result) => {

      if(err){
        console.log(err);
        res.status(500).json(err);
      }

      else{
        res.json(result);
      }

    }
  );

});

/* ===== DELETE EMPLOYEE ===== */

app.delete("/employees/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM employees WHERE id=?",
    [id],
    (err, result) => {

      if(err){
        console.log(err);
        res.status(500).json(err);
      }

      else{
        res.json(result);
      }

    }
  );

});

/* ===== UPDATE EMPLOYEE ===== */

app.put("/employees/:id", (req, res) => {

  const id = req.params.id;

  const { name, role, department } = req.body;

  db.query(
    "UPDATE employees SET name=?, role=?, department=? WHERE id=?",
    [name, role, department, id],
    (err, result) => {

      if(err){
        console.log(err);
        res.status(500).json(err);
      }

      else{
        res.json(result);
      }

    }
  );

});

/* ===== EMPLOYEE COUNT ===== */

app.get("/employees/count", (req, res) => {

  db.query(
    "SELECT COUNT(*) AS count FROM employees",
    (err, result) => {

      if(err){
        console.log(err);
        res.status(500).json(err);
      }

      else{
        res.json(result[0]);
      }

    }
  );

});

/* ===== LOGIN ===== */

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
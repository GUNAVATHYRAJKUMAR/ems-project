const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ===== TEST ROUTE ===== */

app.get("/", (req, res) => {
  res.send("Backend working");
});

/* ===== LOGIN ROUTE ===== */

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
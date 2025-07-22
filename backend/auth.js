// auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("./db"); // this is db.js file

router.post("/login", (req, res) => {
  const { email, password } = req.body;

//Temp for debugging
  console.log("Login attemot: ", email, password);

  // Get user from DB
  const query = "SELECT * FROM Admins WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    //Temp for debugging
    console.log("User found: ", user);

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password_hash);
    //Temp for debugging
    console.log("Password match: ", match);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Success!
    return res.status(200).json({
         message: "Login successful", 
         userId: user.id, 
         companyId: user.company_id 
    });
  });
});

module.exports = router;

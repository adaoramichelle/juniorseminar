const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "You need a username and password" });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid username or password." });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({ error: "Invalid username or password." });
  } else {
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: "Login successful!", user: { id: user.id, username: user.username } });

  }
});

// Get User
router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not logged in" });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session.userId },
      select: { username: true },
    });
    res.json({ id: req.session.userId, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching user session data" });
  }
});

// SignUp Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "You need a username and password" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password has to have at least eight characters" });
  }
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUser) {
    return res.status(400).json({ error: "Usernmae already taken" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      bookshelves: {
        create: [
          { name: "CurrentlyReading" },
          { name: "WanttoRead" },
          { name: "Read" },
        ]
      }
    },
  });
  req.session.userId = newUser.id;
  res.status(201).json({ message: "SignUp sucessful", user: { id: newUser.id, username: newUser.username } });
});

// Logout
router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ message: "Logout successful" });
  });
});
module.exports = router;

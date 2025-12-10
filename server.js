const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Allow frontend origins
app.use(cors({
  origin: "*",  // Allow all frontend hosts
  methods: ["GET", "POST"],
}));

app.use(express.json());

app.post("/api/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,  // your email
        pass: process.env.EMAIL_PASS   // app password
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    });

    res.json({ success: true, msg: "Mail sent successfully!" });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ success: false, msg: "Email failed", error: err });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running properly...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

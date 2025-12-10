const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// Working on localhost + Render
app.post("/api/send-mail", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,   // FIX
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    res.status(500).json({ success: false, error });
  }
});

app.get("/", (req, res) => res.send("Backend running OK"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server started")
);

const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const limiter = require("../middleware/rateLimiter")

router.get("/contact", (req, res) => {
  res.render("contact", {
    extraStyles: ["contact.css"],
  });
});

router.post("/send", limiter, async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (phone) return res.status(400).redirect("/contact");

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required."
    });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      text: `You have received a message from ${name}:\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error sending message. Please try again."
    })
  }
});

module.exports = router;
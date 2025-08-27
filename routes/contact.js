const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const limiter = require("../middleware/rateLimiter")

router.use('/contact', limiter);

router.get("/contact", (req, res) => {
  res.render("contact", {
    extraStyles: ["contact.css"],
  });
});

router.post("/send", limiter, async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (phone) return res.status(400).redirect("/contact");

  if (!name || !email || !message) {
    req.flash("error", "All fields are required.");
    return res.redirect("/contact")
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

    req.flash("success", "Message sent successfully!");
    res.redirect("/contact");
  } catch (error) {
    console.log(error);
    req.flash("error", "Error sending message. Please try again.");
    res.redirect("/contact");
  }
});

module.exports = router;
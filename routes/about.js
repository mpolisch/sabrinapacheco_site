const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about", {
    extraStyles: ["about.css"],
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const projects = require("../data/projects.json");

router.get("/", (req, res) => {
  res.render("work", {
    extraStyles: ["work.css"],
  });
});

router.get("/:work/:href", (req, res, next) => {

  const { work, href } = req.params;
  const category = projects.work[work];

  if (!category) {
    res.status(404);
    return next();
  }

  const project = category.find((p) => p.href === href);

  if (!project) {
    res.status(404);
    return next();
  }

  res.render("project", {
    project,
    work,
    extraStyles: ["project.css"],
  });
});

router.get("/:work", (req, res, next) => {
  const workType = req.params.work;
  const workData = projects.work[workType];

  if (!workData) {
    res.status(404);
    return next();
  }

  res.render("category", {
    workType,
    workData,
    extraStyles: ["category.css"],
  });
});

module.exports = router;
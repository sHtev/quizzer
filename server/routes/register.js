import express from "express";

import Registration from "../../models/Registration.js";

const router = express.Router();

const checkTeam = (req, res) => {
  if (req.session.registeredQuiz.teamName) {
    res.redirect("/quiz");
  } else {
    res.render("register", {
      layout: "default",
      template: "register-template",
    });
  }
};

router.post("/", (req, res, next) => {
  console.log(req.body);
  if (!req.body.team_name) {
    res.redirect("/register");
  } else if (!req.session.registeredQuiz) {
    res.redirect("/");
  } else {
    Registration.findOne({
      registrationCode: req.query.reg_code,
    })
      .populate("quiz")
      .exec((_, registration) => {
        if (!registration) {
          req.session.destroy();
          res.redirect("/");
        } else {
          registration.teamName = req.body.team_name;
          registration.save();
          req.session.registeredQuiz = registration;
          res.redirect("/quiz");
        }
      });
  }
});

router.get("/", (req, res, next) => {
  console.log(req.session.registeredQuiz);
  if (!req.query.reg_code && !req.session.registeredQuiz) {
    res.redirect("/");
    next(res);
  } else if (!req.session.registeredQuiz) {
    console.log("checking registration");
    Registration.findOne({
      registrationCode: req.query.reg_code,
    })
      .populate("quiz")
      .exec((err, registration) => {
        console.log("got something");
        console.log(registration);
        console.log(registration.quiz.slug);
        if (!registration) {
          res.redirect("/");
          next(res);
        } else {
          req.session.registeredQuiz = registration;
          checkTeam(req, res);
        }
      });
  } else {
    checkTeam(req, res);
  }
});

export default router;

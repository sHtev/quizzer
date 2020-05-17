import express from "express";

const router = express.Router();

router.get("/", function (req, res, next) {
  if (req.session.registeredQuiz) {
    if (req.session.registeredQuiz.teamName) {
      res.redirect("/quiz");
    } else {
      res.redirect("/register");
    }
  } else {
    res.render("home", {
      layout: "default",
      template: "home-template",
    });
  }
});

router.post("/", function (req, res, next) {
  res.redirect(`/register?reg_code=${req.body.reg_code}`);
});

export default router;

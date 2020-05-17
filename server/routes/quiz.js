import express from "express";
import Quiz from "../../models/Quiz.js";
import AnswerSheet from "../../models/AnswerSheet.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  if (!req.session.registeredQuiz) {
    res.redirect("/register");
    next(res);
  }
  const quiz = await Quiz.findById(req.session.registeredQuiz.quiz);
  console.log(req.session.registeredQuiz.quiz);
  console.log(quiz);
  if (quiz) {
    req.session.currentQuiz = quiz;
    if (req.session.answerSheet) {
      res.redirect("/quiz/begin");
    } else {
      res.render("quiz-start", {
        title: quiz.name,
        rounds: quiz.rounds.length,
        teamName: req.session.registeredQuiz.teamName,
        layout: "default",
        template: "quiz-template",
      });
    }
  } else {
    res.redirect("/");
  }
});

router.get("/begin", async (req, res, next) => {
  const quiz = req.session.currentQuiz;
  if (!quiz) {
    res.redirect("/quiz");
    next(res);
  }

  if (!req.session.answerSheet) {
    req.session.answerSheet = await AnswerSheet.create({
      currentTotal: 0,
      rounds: [],
    });
  }

  if (!req.session.currentRound) {
    req.session.currentRound = 1;
  }

  const roundSlug = quiz.rounds[req.session.currentRound - 1].roundID;
  console.log(roundSlug);
  res.redirect(`/round/${roundSlug}`);
});

export default router;

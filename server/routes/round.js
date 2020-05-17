import express from "express";
import _ from "lodash";

import Quiz from "../../models/Quiz.js";
import AnswerSheet from "../../models/AnswerSheet.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  if (!req.session.currentQuiz) {
    res.redirect("/register");
    next(res);
  }
  if (!req.session.currentRound) {
    res.redirect("/quiz/begin");
    next(res);
  }

  const roundSlug = quiz.rounds[req.session.currentRound - 1].roundID;
  res.redirect(roundSlug);
});

router.get("/:roundID/answers", async (req, res, next) => {
  if (!req.session.registeredQuiz) {
    res.redirect("/");
    next(res);
  }
  if (!req.session.currentQuiz) {
    res.redirect("/register");
    next(res);
  }
  if (!req.session.registeredQuiz.teamName == "quizmaster") {
    res.redirect(req.params.roundID);
    next(res);
  }

  const quiz = await Quiz.findById(req.session.registeredQuiz.quiz);
  const round = quiz.rounds.find(
    (round) => round.roundID == req.params.roundID
  );

  if (!round) {
    res.redirect("/quiz");
    next(res);
  }

  const nextRound = quiz.rounds[req.session.currentRound];

  let nextSlug;

  if (nextRound) {
    nextSlug = nextRound.roundID;
  } else {
    nextSlug = "end";
  }

  console.log(nextSlug);

  res.render("round-answers", {
    title: quiz.name,
    roundTitle: round.title,
    hasImage: round.type == "film",
    hasSound: round.type == "music",
    currentRound: req.session.currentRound,
    nextRound: nextSlug,
    answers: round.questions,
    layout: "default",
    template: "quiz-template",
  });
});

router.get("/:roundID", async (req, res, next) => {
  if (!req.session.registeredQuiz) {
    res.redirect("/");
    next(res);
  }
  if (!req.session.currentQuiz) {
    res.redirect("/register");
    next(res);
  }
  const isQuizmaster = req.session.registeredQuiz.teamName == "quizmaster";

  const quiz = await Quiz.findById(req.session.registeredQuiz.quiz);
  const round = quiz.rounds.find(
    (round) => round.roundID == req.params.roundID
  );

  req.session.currentRound =
    quiz.rounds.findIndex((round) => round.roundID == req.params.roundID) + 1;

  console.log(req.session.currentRound);

  if (!round) {
    res.redirect("/quiz");
    next(res);
  }
  if (round.type == "multiple") {
    round.questions.forEach((question) => {
      console.log(question);
      const allAnswers = question.correctAnswers.concat(
        question.incorrectAnswers
      );
      console.log(allAnswers);
      question.allAnswers = _.sampleSize(allAnswers, 4);
      question.allAnswers.forEach((answer, index) => {
        question.allAnswers[index] = {
          answer: answer,
          correct: question.correctAnswers.includes(answer),
        };
      });
    });
  }

  console.log(round.type);

  res.render("round-questions", {
    title: quiz.name,
    roundTitle: round.title,
    hasImage: round.type == "film",
    hasSound: round.type == "music",
    isMultiple: round.type == "multiple",
    isBoolean: round.type == "boolean",
    currentRound: req.session.currentRound,
    questions: round.questions,
    showAnswerLink: isQuizmaster,
    layout: "default",
    template: "quiz-template",
  });
});

router.post("/:roundID", async (req, res, next) => {
  if (!req.session.registeredQuiz) {
    res.redirect("/");
    next(res);
  }
  if (!req.session.currentQuiz) {
    res.redirect("/register");
    next(res);
  }
  if (!req.session.answerSheet) {
    res.redirect("/quiz");
    next(res);
  }

  const quiz = await Quiz.findById(req.session.registeredQuiz.quiz);
  const round = quiz.rounds.find(
    (round) => round.roundID == req.params.roundID
  );

  const answers = req.body;
  const answerSheet = req.session.answerSheet;

  if (!answerSheet.rounds[req.session.currentRound - 1]) {
    answerSheet.rounds.push({ roundID: round.roundID, answers: [] });
  }

  console.log(answerSheet);

  answerSheet.rounds[req.session.currentRound - 1].answers = [];

  let scoreSheet = [];
  let score = 0;

  console.log(answers);

  round.questions.forEach((question, index) => {
    if (_.has(answers, `${index}`)) {
      if (question.correctAnswers.includes(answers[`${index}`])) {
        score += 1;
        scoreSheet.push({
          myAnswer: answers[`${index}`],
          rightAnswer: question.correctAnswers[0],
          correct: true,
        });
      } else {
        scoreSheet.push({
          myAnswer: answers[`${index}`],
          rightAnswer: question.correctAnswers[0],
          correct: false,
        });
      }
      answerSheet.rounds[req.session.currentRound - 1].answers.push(
        answers[`${index}`]
      );
    } else if (_.has(answers, `${index}-1`) && _.has(answers, `${index}-2`)) {
      let correct = true;
      const myAnswers = [answers[`${index}-1`], answers[`${index}-2`]];
      if (question.correctAnswers.includes(answers[`${index}-1`])) {
        score += 1;
        correct = correct && true;
      } else {
        correct = correct && false;
      }
      if (question.correctAnswers.includes(answers[`${index}-2`])) {
        score += 1;
        correct = correct && true;
      } else {
        correct = correct && false;
      }
      scoreSheet.push({
        myAnswer: `${myAnswers[0]} - ${myAnswers[1]}`,
        rightAnswer: `${question.correctAnswers[0]} - ${question.correctAnswers[1]}`,
        correct: false,
      });
    } else {
      scoreSheet.push({
        myAnswer: "",
        rightAnswer: question.correctAnswers[0],
        correct: false,
      });
    }
  });

  answerSheet.rounds[req.session.currentRound - 1].roundTotal = score;

  const nextRound = quiz.rounds[req.session.currentRound];

  let nextSlug;

  if (nextRound) {
    nextSlug = nextRound.roundID;
  } else {
    nextSlug = "end";
  }

  res.render("scores", {
    title: quiz.name,
    roundScore: score,
    roundTitle: round.title,
    scores: scoreSheet,
    layout: "default",
    template: "quiz-template",
    nextRound: nextSlug,
  });
});

// router.get("/:roundID/finish")

export default router;

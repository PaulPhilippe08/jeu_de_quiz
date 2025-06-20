const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

const quizQuestions = [
  {
    question: "Quelle est la capitale du Sénégal ?",
    answers: [
      { text: "Saint-Louis", correct: false },
      { text: "Thiès", correct: false },
      { text: "Dakar", correct: true },
      { text: "Ziguinchor", correct: false },
    ],
  },
  {
    question: "Quel est le plus grand océan du monde ?",
    answers: [
      { text: "Océan Atlantique", correct: false },
      { text: "Océan Pacifique", correct: true },
      { text: "Océan Indien", correct: false },
      { text: "Océan Arctique", correct: false },
    ],
  },
  {
    question: "Quelle entreprise a développé Android ?",
    answers: [
      { text: "Samsung", correct: false },
      { text: "Apple", correct: false },
      { text: "Microsoft", correct: false },
      { text: "Google", correct: true },
    ],
  },
  {
    question: "Quel est l'animal le plus rapide du monde ?",
    answers: [
      { text: "Lièvre", correct: false },
      { text: "Guépard", correct: false },
      { text: "Faucon pèlerin", correct: true },
      { text: "Antilope", correct: false },
    ],
  },
  {
    question: "Quelle est la planète la plus proche du Soleil ?",
    answers: [
      { text: "Mercure", correct: true },
      { text: "Vénus", correct: false },
      { text: "Terre", correct: false },
      { text: "Mars", correct: false },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let timer;
let timerDuration = 30;
let timeLeft;
let timerElement;

const victoryAudio = new Audio("sounds/victory.mp3");

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuestion();
}

function showQuestion() {
  answersDisabled = false;
  clearTimeout(timer);
  resetTimer();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";
  quizScreen.classList.remove("fade");
  void quizScreen.offsetWidth;
  quizScreen.classList.add("fade");

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answers-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });

  startTimer();
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;
  clearTimeout(timer);

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
    playSound("sounds/correct.mp3");
  } else {
    playSound("sounds/wrong.mp3");
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");
  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;
  if (percentage === 100) {
    resultMessage.textContent = "Félicitations!🎉👑🥇";
    victoryAudio.play();
  } else if (percentage >= 80) {
    resultMessage.textContent =
      "Réessaye je sais que tu peux le faire champion(ne)😇";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Pas mal!😊";
  } else if (percentage >= 40) {
    resultMessage.textContent =
      "Tu n'es qu'au début de ton ascension persevere!👊";
  } else if (percentage >= 20) {
    resultMessage.textContent = "C’est en trébuchant qu’on apprend à marcher ! 💪";
  } else {
    resultMessage.textContent = "Ce n’est pas un échec, c’est un point de départ. 🌱";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");
  victoryAudio.pause();
  victoryAudio.currentTime = 0;
  startQuiz();
}

function startTimer() {
  timeLeft = timerDuration;
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSkipQuestion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (!timerElement) {
    timerElement = document.createElement("div");
    timerElement.classList.add("timer");
    quizScreen.querySelector(".quiz-header").appendChild(timerElement);
  }
  timerElement.textContent = `Temps restant : ${timeLeft}s`;
}

function resetTimer() {
  if (timerElement) timerElement.remove();
  timerElement = null;
}

function autoSkipQuestion() {
  answersDisabled = true;
  playSound("sounds/wrong.mp3");

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
  });

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function playSound(path) {
  const audio = new Audio(path);
  audio.play();
}

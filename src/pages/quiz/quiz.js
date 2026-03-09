// Quiz questions about Vietnamese Communist Party history
const quizQuestions = [
  {
    question: "Đảng Cộng Sản Việt Nam được thành lập vào năm nào?",
    answers: ["1925", "1930", "1935", "1940"],
    correct: 1,
    explanation:
      "Đảng Cộng Sản Việt Nam được thành lập vào ngày 3 tháng 2 năm 1930 tại Hồng Kông dưới sự lãnh đạo của Hồ Chí Minh.",
  },
  {
    question: "Hồ Chí Minh được bầu làm Tổng Bí Thư của Đảng vào năm nào?",
    answers: ["1930", "1941", "1945", "1950"],
    correct: 1,
    explanation:
      "Hồ Chí Minh được bầu làm Tổng Bí Thư lần đầu tiên vào năm 1941 tại Tuần Châu, Vịnh Hạ Long.",
  },
  {
    question: "Kỳ Đại hội Đảng thứ mấy đã đạt được Độc lập?",
    answers: ["VI", "VII", "VIII", "IX"],
    correct: 2,
    explanation:
      "Kỳ VIII của Đại hội Đảng được coi là kỳ đại hội lịch sử diễn ra trước Cách mạng Tháng Tám 1945.",
  },
  {
    question:
      "Cách mạng Tháng Tám 1945 được Đảng lãnh đạo đã giải phóng miền nước nào trước?",
    answers: ["Nam", "Bắc", "Trung", "Cả nước"],
    correct: 1,
    explanation:
      "Cách mạng Tháng Tám 1945 giải phóng Bắc Kỳ, thủ phủ là Hà Nội, sau đó lan rộng sang các địa phương khác.",
  },
  {
    question: "Đại hội Đảng Cộng Sản Việt Nam thứ II diễn ra ở đâu?",
    answers: ["Hà Nội", "Hải Phòng", "Viêng Chân (Lào)", "Quảng Châu"],
    correct: 2,
    explanation:
      "Đại hội II của Đảng được tổ chức tại Viêng Chân, Lào (nay là Viêng Chân) vào năm 1951.",
  },
  {
    question: "Kháng chiến chống Pháp (1945-1954) kéo dài bao lâu?",
    answers: ["7 năm", "8 năm", "9 năm", "10 năm"],
    correct: 2,
    explanation:
      "Kháng chiến chống Pháp kéo dài 9 năm (1945-1954), kết thúc với chiến thắng Điện Biên Phủ.",
  },
  {
    question: "Chiến thắng Điện Biên Phủ xảy ra vào năm nào?",
    answers: ["1952", "1953", "1954", "1955"],
    correct: 2,
    explanation:
      "Chiến thắng Điện Biên Phủ diễn ra từ ngày 13/3 đến 7/5/1954, đánh dấu bước ngoặt của kháng chiến.",
  },
  {
    question: "Hiệp định Genève 1954 định chia Việt Nam bằng đường gì?",
    answers: ["Vĩ tuyến 17", "Vĩ tuyến 19", "Vĩ tuyến 15", "Vĩ tuyến 21"],
    correct: 0,
    explanation:
      "Hiệp định Genève năm 1954 quy định tạm thời chia Việt Nam bằng vĩ tuyến 17.",
  },
  {
    question:
      "Đảng Cộng Sản Việt Nam ngành lãnh đạo kháng chiến chống Mỹ cứu nước trong khoảng thời gian nào?",
    answers: ["1955-1965", "1959-1975", "1960-1975", "1962-1973"],
    correct: 2,
    explanation:
      "Kháng chiến chống Mỹ cứu nước dưới sự lãnh đạo của Đảng Cộng Sản Việt Nam kéo dài từ 1960 đến 1975.",
  },
  {
    question: "Chiến dịch Tây Nguyên lịch sử diễn ra khi nào?",
    answers: ["1972", "1973", "1974", "1975"],
    correct: 3,
    explanation:
      "Chiến dịch Tây Nguyên được tiến hành vào cuối năm 1974 và đầu năm 1975 dẫn đến chiến thắng 30/4/1975.",
  },
];

// Game state
let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerInterval = null;
let gameStarted = false;
let currentQuestions = [];

// Shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Start quiz
function startQuiz() {
  // Select 10 random questions from the pool
  currentQuestions = shuffleArray(quizQuestions).slice(0, 10);
  currentQuestion = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  timeLeft = 300;
  gameStarted = true;

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("result-screen").classList.add("hidden");

  showQuestion();
  startTimer();
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Show question
function showQuestion() {
  if (currentQuestion >= currentQuestions.length || timeLeft <= 0) {
    endQuiz();
    return;
  }

  const question = currentQuestions[currentQuestion];
  document.getElementById("question").textContent = question.question;
  document.getElementById("progress").textContent = `${currentQuestion + 1}/10`;
  document.getElementById("progress-bar").style.width =
    `${((currentQuestion + 1) / 10) * 100}%`;

  const container = document.getElementById("answers-container");
  container.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className =
      "w-full text-left p-4 border-2 border-gray-300 rounded-lg answer-btn hover:border-blue-500 transition-colors";
    button.textContent = answer;
    button.onclick = () => selectAnswer(index);
    container.appendChild(button);
  });
}

// Select answer
function selectAnswer(index) {
  if (gameStarted === false) return;

  const question = currentQuestions[currentQuestion];
  const buttons = document.querySelectorAll(".answer-btn");

  // Disable all buttons
  buttons.forEach((btn) => (btn.disabled = true));

  if (index === question.correct) {
    buttons[index].classList.add("correct");
    score += 10;
    correctAnswers++;
  } else {
    buttons[index].classList.add("incorrect");
    buttons[question.correct].classList.add("correct");
    wrongAnswers++;
  }

  document.getElementById("score").textContent = score;

  // Move to next question after 1 second
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < currentQuestions.length && timeLeft > 0) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
}

// End quiz
function endQuiz() {
  clearInterval(timerInterval);
  gameStarted = false;

  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  const accuracy = Math.round((correctAnswers / 10) * 100);
  let message = "";

  if (accuracy >= 90) {
    message = "🏆 Xuất sắc! Bạn là chuyên gia lịch sử Đảng!";
  } else if (accuracy >= 70) {
    message = "👏 Rất tốt! Bạn có kiến thức vững về lịch sử Đảng!";
  } else if (accuracy >= 50) {
    message = "📚 Khá tốt! Hãy tiếp tục ôn tập để cải thiện hơn nữa!";
  } else {
    message = "💪 Cố gắng lên! Hãy ôn tập thêm và thử lại!";
  }

  document.getElementById("final-score").textContent = score;
  document.getElementById("result-message").textContent = message;
  document.getElementById("correct-count").textContent = correctAnswers;
  document.getElementById("wrong-count").textContent = wrongAnswers;
  document.getElementById("accuracy").textContent = `${accuracy}%`;
}

// Navigation scroll effect
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("bg-black/80", "backdrop-blur-sm");
    nav.classList.remove("bg-transparent");
  } else {
    nav.classList.remove("bg-black/80", "backdrop-blur-sm");
    nav.classList.add("bg-transparent");
  }
});

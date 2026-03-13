// Check login before allowing quiz access
(function checkLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    alert("Chức năng này cần đăng nhập để tiếp tục");
    window.location.href = "login.html";
    return;
  }
})();

// Quiz questions about Vietnamese Communist Party history
const quizQuestions = [
  {
    question:
      "Thắng lợi của cuộc kháng chiến chống thực dân Pháp (1945–1954) trước hết có ý nghĩa gì đối với thành quả của Cách mạng tháng Tám năm 1945?",
    answers: [
      "Làm thay đổi hoàn toàn cơ cấu kinh tế của xã hội Việt Nam theo mô hình xã hội chủ nghĩa",
      "Bảo vệ và phát triển những thành quả căn bản của Cách mạng tháng Tám đã giành được",
      "Chấm dứt hoàn toàn sự phụ thuộc của Việt Nam vào hệ thống kinh tế của phương Tây",
      "Tạo điều kiện để Việt Nam nhanh chóng hoàn thành công nghiệp hóa trong giai đoạn đầu",
    ],
    correct: 1,
    explanation:
      "Thắng lợi kháng chiến chống Pháp giúp bảo vệ và phát triển những thành quả của Cách mạng tháng Tám năm 1945, giữ vững chính quyền cách mạng non trẻ.",
  },
  {
    question:
      "Thắng lợi của cuộc kháng chiến chống Pháp đã tạo ra điều kiện lịch sử nào quan trọng nhất đối với cách mạng Việt Nam sau năm 1954?",
    answers: [
      "Hoàn thành triệt để cách mạng dân tộc dân chủ trong phạm vi cả nước",
      "Giải phóng hoàn toàn miền Bắc và tạo cơ sở để tiến lên xây dựng chủ nghĩa xã hội",
      "Thực hiện thống nhất đất nước bằng con đường hòa bình trong thời gian ngắn",
      "Thiết lập ngay lập tức một nền kinh tế xã hội chủ nghĩa trên phạm vi toàn quốc",
    ],
    correct: 1,
    explanation:
      "Sau năm 1954, miền Bắc được giải phóng hoàn toàn, trở thành căn cứ địa để xây dựng chủ nghĩa xã hội và hậu phương lớn cho cách mạng miền Nam.",
  },
  {
    question:
      "Đại hội nào của Đảng do Hồ Chí Minh chủ trì đã quyết định đổi tên Đảng thành Đảng Lao động Việt Nam?",
    answers: [
      "Đại hội đại biểu toàn quốc lần thứ II của Đảng Cộng sản Đông Dương năm 1951 tại Tuyên Quang",
      "Đại hội đại biểu toàn quốc lần thứ I của Đảng Cộng sản Đông Dương năm 1935 tại Ma Cao",
      "Hội nghị Trung ương lần thứ 8 của Đảng Cộng sản Đông Dương năm 1941 tại Cao Bằng",
      "Đại hội đại biểu toàn quốc lần thứ III của Đảng Lao động Việt Nam năm 1960 tại Hà Nội",
    ],
    correct: 0,
    explanation:
      "Đại hội II của Đảng (1951) quyết định đổi tên Đảng Cộng sản Đông Dương thành Đảng Lao động Việt Nam.",
  },
  {
    question:
      "Một trong những ý nghĩa quốc tế quan trọng của thắng lợi kháng chiến chống Pháp của Việt Nam là gì?",
    answers: [
      "Làm suy yếu hoàn toàn hệ thống thuộc địa của chủ nghĩa thực dân",
      "Góp phần làm thay đổi trật tự chính trị thế giới sau Chiến tranh thế giới thứ hai",
      "Cổ vũ mạnh mẽ phong trào đấu tranh giải phóng dân tộc ở các nước thuộc địa",
      "Tạo điều kiện hình thành liên minh quân sự chống chủ nghĩa thực dân tại châu Á",
    ],
    correct: 2,
    explanation:
      "Chiến thắng Điện Biên Phủ đã cổ vũ mạnh mẽ phong trào giải phóng dân tộc ở châu Á, châu Phi và Mỹ Latinh.",
  },
  {
    question:
      "Theo đường lối kháng chiến do Đảng đề ra, yếu tố nào được xem là nền tảng để phát huy sức mạnh của toàn dân tộc?",
    answers: [
      "Xây dựng lực lượng quân sự hiện đại ngang tầm với các cường quốc",
      "Phát huy sức mạnh đại đoàn kết toàn dân trong sự nghiệp kháng chiến lâu dài",
      "Tập trung nguồn lực vào phát triển công nghiệp quốc phòng",
      "Đẩy mạnh chiến tranh chính quy quy mô lớn",
    ],
    correct: 1,
    explanation:
      "Đường lối kháng chiến toàn dân nhấn mạnh sức mạnh đại đoàn kết dân tộc là nền tảng của thắng lợi.",
  },
  {
    question:
      "Trong đường lối kháng chiến chống thực dân Pháp, nguyên tắc “tự lực cánh sinh” được hiểu chủ yếu theo nội dung nào?",
    answers: [
      "Dựa hoàn toàn vào nguồn viện trợ quốc tế",
      "Chủ yếu dựa vào sức mình, đồng thời tranh thủ sự giúp đỡ quốc tế",
      "Tập trung phát triển kinh tế thị trường",
      "Phụ thuộc vào hỗ trợ quân sự trực tiếp từ các nước xã hội chủ nghĩa",
    ],
    correct: 1,
    explanation:
      "Nguyên tắc tự lực cánh sinh nhấn mạnh dựa vào sức mình là chính nhưng vẫn tranh thủ sự giúp đỡ của lực lượng tiến bộ quốc tế.",
  },
  {
    question:
      "Trong quá trình lãnh đạo kháng chiến chống Pháp, Đảng đã xác định mối quan hệ giữa “kháng chiến” và “kiến quốc” như thế nào?",
    answers: [
      "Tạm thời gác nhiệm vụ xây dựng đất nước",
      "Kết hợp chặt chẽ giữa kháng chiến và xây dựng đất nước",
      "Ưu tiên phát triển kinh tế trước",
      "Chỉ xây dựng bộ máy nhà nước cuối chiến tranh",
    ],
    correct: 1,
    explanation:
      "Đảng xác định phải vừa kháng chiến vừa kiến quốc, kết hợp xây dựng đất nước với đấu tranh chống xâm lược.",
  },
  {
    question:
      "Một trong những kinh nghiệm quan trọng của Đảng trong lãnh đạo kháng chiến chống Pháp là gì?",
    answers: [
      "Xây dựng quân đội chính quy ngay từ đầu",
      "Phát triển chiến tranh nhân dân với nhiều hình thức đấu tranh linh hoạt",
      "Đẩy mạnh chiến tranh tổng lực trong thời gian ngắn",
      "Phòng thủ cố định tại các khu vực chiến lược",
    ],
    correct: 1,
    explanation:
      "Chiến tranh nhân dân với nhiều hình thức đấu tranh linh hoạt là một đặc trưng nổi bật của kháng chiến chống Pháp.",
  },
  {
    question:
      "Sự kiện nào gắn liền với lời kêu gọi toàn quốc kháng chiến của Hồ Chí Minh?",
    answers: [
      "19/12/1946 công bố Lời kêu gọi Toàn quốc kháng chiến",
      "2/9/1945 đọc Tuyên ngôn Độc lập",
      "6/3/1946 ký Hiệp định Sơ bộ",
      "11/11/1945 tuyên bố giải tán Đảng Cộng sản Đông Dương",
    ],
    correct: 0,
    explanation:
      "Ngày 19/12/1946 Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến, mở đầu cuộc kháng chiến lâu dài chống Pháp.",
  },
  {
    question:
      "Chiến tranh nhân dân trong kháng chiến chống Pháp thể hiện rõ nhất qua đặc điểm nào?",
    answers: [
      "Kết hợp lực lượng chính trị của quần chúng và lực lượng vũ trang",
      "Xây dựng quân đội theo mô hình châu Âu",
      "Chủ yếu sử dụng các trận đánh lớn",
      "Phụ thuộc viện trợ quốc tế",
    ],
    correct: 0,
    explanation:
      "Chiến tranh nhân dân dựa trên sự kết hợp giữa lực lượng chính trị quần chúng và lực lượng vũ trang nhân dân.",
  },
  {
    question:
      "Phương châm tác chiến quan trọng trong nghệ thuật quân sự của kháng chiến chống Pháp là gì?",
    answers: [
      "Đánh nhanh thắng nhanh",
      "Đánh chắc tiến chắc",
      "Tổng tiến công tổng nổi dậy",
      "Chiến tranh chớp nhoáng",
    ],
    correct: 1,
    explanation:
      "Phương châm 'đánh chắc, tiến chắc' giúp đảm bảo thắng lợi từng bước vững chắc trong chiến dịch lớn.",
  },
  {
    question:
      "Đặc điểm nổi bật của lực lượng vũ trang nhân dân trong kháng chiến chống Pháp là gì?",
    answers: [
      "Theo mô hình quân đội hiện đại hoàn toàn",
      "Hệ thống ba thứ quân",
      "Chỉ tập trung bộ đội chủ lực",
      "Chỉ dựa vào dân quân",
    ],
    correct: 1,
    explanation:
      "Lực lượng vũ trang được tổ chức theo mô hình ba thứ quân phù hợp với chiến tranh nhân dân.",
  },
  {
    question:
      "Ba lực lượng cấu thành hệ thống vũ trang nhân dân gồm những lực lượng nào?",
    answers: [
      "Bộ đội chủ lực, bộ đội địa phương, công an",
      "Bộ đội chủ lực, bộ đội địa phương, dân quân du kích",
      "Quân đội chính quy, bán vũ trang, công an",
      "Bộ đội chủ lực, công an, tự vệ thành thị",
    ],
    correct: 1,
    explanation:
      "Ba lực lượng gồm bộ đội chủ lực, bộ đội địa phương và dân quân du kích.",
  },
  {
    question:
      "Việc xây dựng lực lượng vũ trang vững mạnh về chính trị thể hiện ở yếu tố nào?",
    answers: [
      "Trang bị vũ khí hiện đại",
      "Quân đội có bản lĩnh chính trị vững vàng và gắn bó với nhân dân",
      "Đào tạo sĩ quan theo mô hình phương Tây",
      "Phát triển quân đội chuyên nghiệp quy mô lớn",
    ],
    correct: 1,
    explanation:
      "Quân đội nhân dân Việt Nam được xây dựng vững mạnh về chính trị và gắn bó với nhân dân.",
  },
  {
    question:
      "Một trong những bài học quan trọng của Đảng trong lãnh đạo kháng chiến là gì?",
    answers: [
      "Luôn tấn công quân sự quy mô lớn",
      "Không ngừng hoàn thiện phương thức lãnh đạo phù hợp thực tiễn",
      "Xây dựng phòng thủ cố định",
      "Phụ thuộc viện trợ bên ngoài",
    ],
    correct: 1,
    explanation:
      "Đảng luôn điều chỉnh và hoàn thiện phương thức lãnh đạo phù hợp với thực tiễn cách mạng.",
  },
];

// Game state
const TOTAL_QUESTIONS = 25;

let currentQuestion = 0;
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
  // Combine all 30 questions and pick TOTAL_QUESTIONS at random
  const allQuestions = [...quizQuestions, ...additionalQuestions];
  currentQuestions = shuffleArray(allQuestions).slice(0, TOTAL_QUESTIONS);
  currentQuestion = 0;
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
  document.getElementById("progress").textContent =
    `${currentQuestion + 1}/${TOTAL_QUESTIONS}`;
  document.getElementById("progress-bar").style.width =
    `${((currentQuestion + 1) / TOTAL_QUESTIONS) * 100}%`;

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
    correctAnswers++;
  } else {
    buttons[index].classList.add("incorrect");
    buttons[question.correct].classList.add("correct");
    wrongAnswers++;
  }

  document.getElementById("score").textContent = correctAnswers;

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

  const timeTaken = 300 - timeLeft;

  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  const answeredCount = correctAnswers + wrongAnswers;
  const accuracy =
    answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;
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

  document.getElementById("final-score").textContent =
    `${correctAnswers}/${answeredCount}`;
  document.getElementById("result-message").textContent = message;
  document.getElementById("correct-count").textContent = correctAnswers;
  document.getElementById("wrong-count").textContent = wrongAnswers;
  document.getElementById("accuracy").textContent = `${accuracy}%`;
  document.getElementById("time-taken-display").textContent =
    formatTime(timeTaken);

  submitScore(timeTaken).then(() => {
    document.getElementById("leaderboard").classList.remove("hidden");
    renderLeaderboard({
      bodyId: "leaderboard-body",
      loadingId: "leaderboard-loading",
      listId: "leaderboard-list",
    });
  });
}

// Submit score to MockAPI
async function submitScore(timeTaken) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

  try {
    const records = await fetch(SCORES_API, {
      method: "GET",
    }).then((r) => r.json());
    const record = records.find((r) => r.userId === user.id);
    if (record) {
      await fetch(`${SCORES_API}/${record.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }
    await fetch(SCORES_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.username,
        userId: user.id,
        correctAnswers,
        timeTaken,
        date: dateStr,
      }),
    });
  } catch (error) {
    console.error("Lỗi khi gửi điểm:", error);
  }
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

// User menu logic (maintain login session from index page)
const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("login-link").style.display = "none";
  document.getElementById("register-link").style.display = "none";
  const navRight = document.getElementById("nav-right");
  const userDiv = document.createElement("div");
  userDiv.className = "relative";
  userDiv.innerHTML = `
    <button id="user-menu-button" class="text-white hover:text-orange-400">Welcome, ${user.username} ▼</button>
    <div id="user-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-50">
      <a href="./profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Xem thông tin</a>
      <a href="./index.html" id="logout-btn" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
    </div>
  `;
  navRight.appendChild(userDiv);
  document.getElementById("user-menu-button").addEventListener("click", () => {
    document.getElementById("user-menu").classList.toggle("hidden");
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

// Mobile nav toggle
(function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", function () {
    menu.classList.toggle("hidden");
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.add("hidden");
    });
  });
  // Update mobile menu if logged in
  if (user) {
    var ml = document.getElementById("mobile-login-link");
    var mr = document.getElementById("mobile-register-link");
    if (ml) {
      ml.textContent = user.username;
      ml.href = "profile.html";
    }
    if (mr) {
      mr.textContent = "\u0110\u0103ng xu\u1ea5t";
      mr.href = "#";
      mr.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("user");
        location.reload();
      });
    }
  }
})();

const user = JSON.parse(localStorage.getItem("user"));
const RECORD_GAME_API =
  "https://69abf1aa9ca639a5217dcdec.mockapi.io/recordGame";

if (!user) {
  window.location.href = "index.html";
} else {
  document.getElementById("username-display").textContent = user.username;
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("profile-display-name").textContent = user.username;
  document.getElementById("profile-id").textContent = "#" + user.id;

  // Avatar initial
  var avatar = document.getElementById("profile-avatar");
  if (avatar && user.username) {
    avatar.textContent = user.username.charAt(0).toUpperCase();
  }

  loadQuizStats();

  // Joined date (today as placeholder since API doesn't store it)
  document.getElementById("stat-joined").textContent = "2026";

  document.getElementById("user-menu-button").addEventListener("click", () => {
    const menu = document.getElementById("user-menu");
    menu.classList.toggle("hidden");
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });

  document
    .getElementById("profile-logout-btn")
    .addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
}

async function loadQuizStats() {
  var currentUser = JSON.parse(localStorage.getItem("user"));
  if (!currentUser) return;

  var statQuizzesEl = document.getElementById("stat-quizzes");
  var statScoreEl = document.getElementById("stat-score");

  try {
    var records = await fetch(`${RECORD_GAME_API}?limit=1000`).then((r) =>
      r.json(),
    );

    if (!Array.isArray(records)) {
      records = [];
    }

    var userRecords = records.filter(function (record) {
      if (!record) return false;
      var sameUserId = String(record.userId || "") === String(currentUser.id);
      var sameUsername = record.username === currentUser.username;
      return sameUserId || sameUsername;
    });

    var quizCount = userRecords.length;
    var bestScore = 0;

    if (quizCount > 0) {
      bestScore = Math.max.apply(
        null,
        userRecords.map(function (record) {
          return Number(record.correctAnswers ?? record.score ?? 0);
        }),
      );
    }

    if (statQuizzesEl) statQuizzesEl.textContent = String(quizCount);
    if (statScoreEl) statScoreEl.textContent = String(bestScore);
  } catch (error) {
    console.error("Không thể tải thống kê quiz từ API:", error);

    // Fallback to local cache if API is temporarily unavailable.
    try {
      var leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
      if (!Array.isArray(leaderboard)) leaderboard = [];

      var userScores = leaderboard.filter(function (e) {
        return e && e.username === currentUser.username;
      });

      var fallbackBest =
        userScores.length > 0
          ? Math.max.apply(
              null,
              userScores.map(function (e) {
                return Number(e.correctAnswers ?? e.score ?? 0);
              }),
            )
          : 0;

      if (statQuizzesEl) statQuizzesEl.textContent = String(userScores.length);
      if (statScoreEl) statScoreEl.textContent = String(fallbackBest);
    } catch (e) {
      if (statQuizzesEl) statQuizzesEl.textContent = "0";
      if (statScoreEl) statScoreEl.textContent = "0";
    }
  }
}

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
  var logoutBtn = document.getElementById("mobile-logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
})();

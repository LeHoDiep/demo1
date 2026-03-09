const user = JSON.parse(localStorage.getItem("user"));

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

  // Load quiz stats from leaderboard data
  try {
    var leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    var userScores = leaderboard.filter(function(e) { return e.username === user.username; });
    document.getElementById("stat-quizzes").textContent = userScores.length;
    if (userScores.length > 0) {
      var best = Math.max.apply(null, userScores.map(function(e) { return e.score || 0; }));
      document.getElementById("stat-score").textContent = best;
    }
  } catch (e) {}

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

  document.getElementById("profile-logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
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

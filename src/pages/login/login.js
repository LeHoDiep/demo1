// Password hashing function using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Get login form
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Clear previous errors
  document.getElementById("username-error").style.display = "none";
  document.getElementById("password-error").style.display = "none";

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    // Fetch users from API
    const response = await fetch(
      "https://69abf1aa9ca639a5217dcdec.mockapi.io/users",
    );
    const users = await response.json();

    // Find user with matching username and password
    const user = users.find(
      (u) => u.username === username && u.password === hashedPassword,
    );

    if (user) {
      // Login successful
      const modal = document.getElementById("success-modal");
      modal.classList.remove("hidden");
      localStorage.setItem(
        "user",
        JSON.stringify({ username: user.username, id: user.id }),
      );
      setTimeout(() => {
        modal.classList.add("hidden");
        window.location.href = "index.html";
      }, 2000);
    } else {
      // Login failed - could be wrong username or password
      const userExists = users.find((u) => u.username === username);
      if (!userExists) {
        document.getElementById("username-error").textContent =
          "Username không tồn tại";
        document.getElementById("username-error").style.display = "block";
      } else {
        document.getElementById("password-error").textContent =
          "Password không đúng";
        document.getElementById("password-error").style.display = "block";
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Lỗi khi đăng nhập. Vui lòng thử lại!");
  }
});

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
})();

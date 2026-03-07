let currentSlide = 0;
const totalSlides = 5;
let autoplayInterval;

function showSlide(n) {
  const items = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");

  items.forEach((item) => item.classList.add("hidden"));
  indicators.forEach((ind) => {
    ind.classList.remove("bg-blue-600");
    ind.classList.add("bg-gray-300");
  });

  items[n].classList.remove("hidden");
  indicators[n].classList.remove("bg-gray-300");
  indicators[n].classList.add("bg-blue-600");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

function goToSlide(n) {
  currentSlide = n;
  showSlide(currentSlide);
}

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Initialize first slide
showSlide(0);
startAutoplay();

// Stop autoplay on user interaction
document.querySelectorAll('button[onclick*="Slide"]').forEach((btn) => {
  btn.addEventListener("click", resetAutoplay);
});

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

// User menu logic
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
      <a href="profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Xem thông tin</a>
      <a href="#" id="logout-btn" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>
    </div>
  `;
  navRight.appendChild(userDiv);
  document.getElementById("user-menu-button").addEventListener("click", () => {
    const menu = document.getElementById("user-menu");
    menu.classList.toggle("hidden");
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

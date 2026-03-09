// Carousel data
const articles = [
  {
    title: "Trung bình lớp học ai tờ",
    content:
      "hình ảnh người đàn ông dạy học lớp ai tờ cho đám trò trẻ, trong thời kỳ cách mạng công nghiệp 4.0, với phong cách hoạt hình vui nhộn và màu sắc tươi sáng.",
    image: "../images/rp1.jpg",
  },
  {
    title: "Tiêu đề bài báo 2",
    content:
      "Đây là nội dung tóm tắt của bài báo thứ hai. Mô tả chi tiết về các sự kiện lịch sử quan trọng. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "../images/rp2.jpg",
  },
  {
    title: "Tiêu đề bài báo 3",
    content:
      "Bài báo thứ ba cung cấp thông tin chi tiết về các giai đoạn phát triển. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    image: "../images/rp3.jpg",
  },
  {
    title: "Tiêu đề bài báo 4",
    content:
      "Bài báo thứ tư tập trung vào những khía cạnh quan trọng của lịch sử. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
    image: "../images/rp4.jpg",
  },
  {
    title: "Tiêu đề bài báo 5",
    content:
      "Bài báo cuối cùng kết luận về những điểm chính và tầm quan trọng của việc học lịch sử. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    image: "../images/rp5.jpg",
  },
];

// Render carousel items
function renderCarousel() {
  const container = document.getElementById("carousel-container");
  articles.forEach((article, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item hidden";
    item.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-lg">
        <div class="h-96 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-gray-800 mb-4">${article.title}</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">${article.content}</p>
          <a href="#" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-max">Đọc thêm</a>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// Render indicators
function renderIndicators() {
  const container = document.getElementById("indicators-container");
  articles.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = `indicator w-3 h-3 rounded-full transition-all ${index === 0 ? "bg-blue-600" : "bg-gray-300"}`;
    button.onclick = () => goToSlide(index);
    container.appendChild(button);
  });
}

let currentSlide = 0;
let totalSlides = articles.length;
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

// Render carousel on page load
renderCarousel();
renderIndicators();

// Initialize first slide
showSlide(0);
startAutoplay();

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

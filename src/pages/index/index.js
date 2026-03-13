// Carousel data — fetched from API, fallback to defaults
const ARTICLES_API = "https://69057f58ee3d0d14c132c727.mockapi.io/articles";
const FALLBACK_ARTICLES = [
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

let articles = [];
let currentSlide = 0;
let totalSlides = 0;
let autoplayInterval;

// Render carousel items
function renderCarousel() {
  const container = document.getElementById("carousel-container");
  container.innerHTML = "";
  articles.forEach((article, index) => {
    const item = document.createElement("div");
    item.className = "carousel-item hidden";
    item.innerHTML = `
      <div class="flex flex-col md:grid md:grid-cols-2 sm:grid-cols-1 gap-4 md:gap-8 bg-white p-3 sm:p-4 md:p-8 rounded-lg shadow-lg">
        <div class="h-44 sm:h-56 md:h-96 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
          <img src="${article.image}" alt="${article.title}" class="w-full h-full object-cover" />
        </div>
        <div class="flex flex-col justify-center p-1 sm:p-2 md:p-0">
          <h3 class="text-base sm:text-lg md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2 md:mb-4">${article.title}</h3>
          <p class="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 md:mb-6 leading-relaxed line-clamp-3 md:line-clamp-none">${article.content}</p>
          <a href="./articles.html${article.id ? "?id=" + article.id : ""}" class="inline-block bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors w-max text-xs sm:text-sm md:text-base">Đọc thêm</a>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

// Render indicators
function renderIndicators() {
  const container = document.getElementById("indicators-container");
  container.innerHTML = "";
  articles.forEach((_, index) => {
    const button = document.createElement("button");
    button.className = `indicator w-3 h-3 rounded-full transition-all ${index === 0 ? "bg-blue-600" : "bg-gray-300"}`;
    button.onclick = () => goToSlide(index);
    container.appendChild(button);
  });
}

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

// Fetch carousel articles from API, then render
fetch(ARTICLES_API)
  .then(function (r) {
    return r.json();
  })
  .then(function (data) {
    if (Array.isArray(data) && data.length > 0) {
      var carousel = data
        .filter(function (a) {
          return a.showInCarousel;
        })
        .sort(function (a, b) {
          return a.order - b.order;
        });
      if (carousel.length > 0) {
        articles = carousel.map(function (a) {
          return {
            id: a.id,
            title: a.title,
            content: a.summary || a.content,
            image: a.image,
          };
        });
      }
    }
    if (articles.length === 0) articles = FALLBACK_ARTICLES;
    totalSlides = articles.length;
    renderCarousel();
    renderIndicators();
    showSlide(0);
    startAutoplay();
  })
  .catch(function () {
    articles = FALLBACK_ARTICLES;
    totalSlides = articles.length;
    renderCarousel();
    renderIndicators();
    showSlide(0);
    startAutoplay();
  });

// Touch swipe for articles carousel
(function initCarouselSwipe() {
  const container = document.getElementById("carousel-container");
  if (!container) return;
  let startX = 0;
  let diffX = 0;
  container.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      diffX = 0;
    },
    { passive: true },
  );
  container.addEventListener(
    "touchmove",
    function (e) {
      diffX = e.touches[0].clientX - startX;
    },
    { passive: true },
  );
  container.addEventListener("touchend", function () {
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) nextSlide();
      else prevSlide();
      resetAutoplay();
    }
  });

  // Mouse drag support
  let isDragging = false;
  container.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.clientX;
    diffX = 0;
    container.style.cursor = "grabbing";
  });
  container.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    diffX = e.clientX - startX;
  });
  container.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = "";
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) nextSlide();
      else prevSlide();
      resetAutoplay();
    }
  });
  container.addEventListener("mouseleave", function () {
    if (isDragging) {
      isDragging = false;
      container.style.cursor = "";
    }
  });
})();

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

// Leaderboard on index page — delegates to shared.js renderLeaderboard
const leaderboardConfig = {
  bodyId: "index-leaderboard-body",
  loadingId: "index-leaderboard-loading",
  listId: "index-leaderboard-list",
  emptyId: "index-leaderboard-empty",
};

renderLeaderboard(leaderboardConfig);
setInterval(() => renderLeaderboard(leaderboardConfig), 30000);

// User menu logic
const user = JSON.parse(localStorage.getItem("user"));
const adminClearScoresBtn = document.getElementById("admin-clear-scores-btn");
const RECORD_GAME_API =
  "https://69abf1aa9ca639a5217dcdec.mockapi.io/recordGame";

if (user && user.isAdmin && adminClearScoresBtn) {
  adminClearScoresBtn.classList.remove("hidden");
  adminClearScoresBtn.addEventListener("click", async function () {
    const isConfirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ dữ liệu bảng kết quả quiz?",
    );
    if (!isConfirmed) return;

    const originalText = adminClearScoresBtn.textContent;
    adminClearScoresBtn.disabled = true;
    adminClearScoresBtn.textContent = "Đang xóa...";

    try {
      // Repeatedly GET records -> build id array -> DELETE each id until empty.
      const maxRounds = 20;
      for (let round = 0; round < maxRounds; round++) {
        const records = await fetch(`${RECORD_GAME_API}?limit=1000`).then((r) =>
          r.json(),
        );

        if (!Array.isArray(records) || records.length === 0) {
          break;
        }

        const ids = records
          .map((record) => record && record.id)
          .filter((id) => id !== undefined && id !== null && id !== "");

        if (ids.length === 0) {
          break;
        }

        for (const id of ids) {
          await fetch(`${RECORD_GAME_API}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      alert("Đã xóa toàn bộ dữ liệu bảng kết quả quiz.");

      // Refresh leaderboard UI immediately after delete.
      const bodyEl = document.getElementById(leaderboardConfig.bodyId);
      const loadingEl = document.getElementById(leaderboardConfig.loadingId);
      const listEl = document.getElementById(leaderboardConfig.listId);
      const emptyEl = document.getElementById(leaderboardConfig.emptyId);

      if (bodyEl) bodyEl.innerHTML = "";
      if (loadingEl) loadingEl.classList.remove("hidden");
      if (listEl) listEl.classList.add("hidden");
      if (emptyEl) emptyEl.classList.add("hidden");

      renderLeaderboard(leaderboardConfig);
      setTimeout(() => renderLeaderboard(leaderboardConfig), 800);
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu bảng kết quả quiz:", error);
      alert("Không thể xóa dữ liệu. Vui lòng thử lại.");
    } finally {
      adminClearScoresBtn.disabled = false;
      adminClearScoresBtn.textContent = originalText;
    }
  });
}

if (user) {
  document.getElementById("login-link").style.display = "none";
  document.getElementById("register-link").style.display = "none";
  // Also update mobile menu
  const mobileLogin = document.getElementById("mobile-login-link");
  const mobileRegister = document.getElementById("mobile-register-link");
  if (mobileLogin) {
    mobileLogin.textContent = user.username;
    mobileLogin.href = "profile.html";
  }
  if (mobileRegister) {
    mobileRegister.textContent = "Đăng xuất";
    mobileRegister.href = "#";
    mobileRegister.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      location.reload();
    });
  }
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
    const menu = document.getElementById("user-menu");
    menu.classList.toggle("hidden");
  });
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    location.reload();
  });
}

// ===== Mobile Nav Toggle =====
(function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });
})();

// ===== Team Members Carousel =====
const teamMembers = [
  {
    name: "Trần Thị Xuân Hồng",
    role: "Nhóm trưởng",
    avatar: "../images/avatar1.png",
  },
  {
    name: "Người vô hình",
    role: "???",
    avatar: "../images/avatarAno.png",
  },
  {
    name: "Người vô hình",
    role: "???",
    avatar: "../images/avatarAno.png",
  },
];

let teamCurrentIndex = 0;

function renderTeamCarousel() {
  const carousel = document.getElementById("team-carousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  const total = teamMembers.length;

  for (let i = -2; i <= 2; i++) {
    const idx = (teamCurrentIndex + i + total) % total;
    const member = teamMembers[idx];
    const isCenter = i === 0;

    const card = document.createElement("div");
    card.className = "team-card" + (isCenter ? " team-card-active" : "");
    card.setAttribute("data-offset", i);

    card.innerHTML = `
      <div class="team-avatar">
        <img src="${member.avatar}" alt="${member.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'team-avatar-fallback\\'>${member.name.charAt(0)}</span>'" />
      </div>
      <div class="team-info ${isCenter ? "" : "team-info-hidden"}">
        <h4 class="text-white font-bold text-lg">${member.name}</h4>
        <p class="text-yellow-400 text-sm">${member.role}</p>
      </div>
    `;

    carousel.appendChild(card);
  }

  renderTeamIndicators();
}

function renderTeamIndicators() {
  const container = document.getElementById("team-indicators");
  if (!container) return;
  container.innerHTML = "";
  teamMembers.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className =
      "w-2.5 h-2.5 rounded-full transition-all " +
      (i === teamCurrentIndex
        ? "bg-yellow-400 scale-125"
        : "bg-white/30 hover:bg-white/50");
    dot.onclick = () => {
      teamCurrentIndex = i;
      renderTeamCarousel();
    };
    container.appendChild(dot);
  });
}

function nextTeamSlide() {
  teamCurrentIndex = (teamCurrentIndex + 1) % teamMembers.length;
  renderTeamCarousel();
}

function prevTeamSlide() {
  teamCurrentIndex =
    (teamCurrentIndex - 1 + teamMembers.length) % teamMembers.length;
  renderTeamCarousel();
}

renderTeamCarousel();

// Touch & mouse drag for team carousel
(function initTeamSwipe() {
  const carousel = document.getElementById("team-carousel");
  if (!carousel) return;
  let startX = 0,
    diffX = 0,
    isDragging = false;

  carousel.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      diffX = 0;
    },
    { passive: true },
  );
  carousel.addEventListener(
    "touchmove",
    function (e) {
      diffX = e.touches[0].clientX - startX;
    },
    { passive: true },
  );
  carousel.addEventListener("touchend", function () {
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) nextTeamSlide();
      else prevTeamSlide();
    }
  });

  carousel.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.clientX;
    diffX = 0;
    carousel.style.cursor = "grabbing";
  });
  carousel.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    diffX = e.clientX - startX;
  });
  carousel.addEventListener("mouseup", function () {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = "";
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) nextTeamSlide();
      else prevTeamSlide();
    }
  });
  carousel.addEventListener("mouseleave", function () {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = "";
    }
  });
})();

// Smooth scroll for About me link
document.querySelectorAll('a[href="./#about-me"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.getElementById("about-me");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ===== AI Face Match Section =====
(function initFaceMatch() {
  // Historical Figures Database
  const fmFigures = [
    {
      name: "Hồ Chí Minh",
      years: "1890 – 1969",
      file: "hochiminh.jpg",
      image: "",
      description:
        "Chủ tịch nước Việt Nam Dân chủ Cộng hòa, lãnh tụ vĩ đại của dân tộc Việt Nam, người sáng lập Đảng Cộng sản Việt Nam và khai sinh nước Việt Nam Dân chủ Cộng hòa.",
      emoji: "⭐",
    },
    {
      name: "Võ Nguyên Giáp",
      years: "1911 – 2013",
      file: "vonguyengiap.jpg",
      image: "",
      description:
        "Đại tướng đầu tiên của Quân đội Nhân dân Việt Nam, người chỉ huy chiến dịch Điện Biên Phủ lịch sử năm 1954, một trong những vị tướng tài ba nhất thế kỷ 20.",
      emoji: "🎖️",
    },
    {
      name: "Trần Phú",
      years: "1904 – 1931",
      file: "tranphu.jpg",
      image: "",
      description:
        "Tổng Bí thư đầu tiên của Đảng Cộng sản Đông Dương, tác giả bản Luận cương chính trị năm 1930. Ông hy sinh khi mới 27 tuổi với câu nói bất hủ 'Hãy giữ vững chí khí chiến đấu!'.",
      emoji: "🔥",
    },
    {
      name: "Lê Hồng Phong",
      years: "1902 – 1942",
      file: "lehongphong.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Đông Dương (1935-1936), nhà cách mạng kiên cường. Ông đã hy sinh anh dũng tại nhà tù Côn Đảo.",
      emoji: "✊",
    },
    {
      name: "Lê Duẩn",
      years: "1907 – 1986",
      file: "leduan.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Việt Nam (1960-1986), người lãnh đạo cuộc kháng chiến chống Mỹ và thống nhất đất nước năm 1975.",
      emoji: "🏛️",
    },
    {
      name: "Nguyễn Văn Cừ",
      years: "1912 – 1941",
      file: "nguyenVanCujpg.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Đông Dương (1938-1940), tác giả tác phẩm 'Tự chỉ trích'. Ông hy sinh anh dũng năm 29 tuổi.",
      emoji: "📜",
    },
    {
      name: "Nguyễn Văn Linh",
      years: "1915 – 1998",
      file: "nguyenvanlinh.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Việt Nam (1986-1991), người khởi xướng công cuộc Đổi Mới, mở ra thời kỳ phát triển mới cho đất nước.",
      emoji: "🌟",
    },
    {
      name: "Phạm Văn Đồng",
      years: "1906 – 2000",
      file: "phamvandong.jpg",
      image: "",
      description:
        "Thủ tướng Chính phủ trong suốt 32 năm (1955-1987), học trò xuất sắc của Chủ tịch Hồ Chí Minh, đóng vai trò quan trọng trong hai cuộc kháng chiến.",
      emoji: "📋",
    },
    {
      name: "Trường Chinh",
      years: "1907 – 1988",
      file: "truong-chinh-edit.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Việt Nam, Chủ tịch Hội đồng Nhà nước. Ông là nhà lý luận xuất sắc, đóng góp lớn cho cách mạng Việt Nam.",
      emoji: "📖",
    },
    {
      name: "Hà Huy Tập",
      years: "1906 – 1941",
      file: "Ha_Huy_Tap.jpg",
      image: "",
      description:
        "Tổng Bí thư Đảng Cộng sản Đông Dương (1936-1938). Ông có công lớn trong việc khôi phục tổ chức Đảng sau thời kỳ khủng bố trắng và hy sinh anh dũng năm 1941.",
      emoji: "🪶",
    },
  ];

  const FM_MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
  let fmModelsLoaded = false;
  let fmUserImageSrc = null;
  let fmCameraStream = null;
  let fmImageBase = "../images/historical/"; // default for dist

  // Auto-detect correct image base path (src vs dist folder structure)
  function fmProbeImageBase() {
    return new Promise(function (resolve) {
      var bases = ["../images/historical/", "../../images/historical/"];
      var testFile = fmFigures[0].file;
      var tried = 0;
      bases.forEach(function (base) {
        var img = new Image();
        img.onload = function () {
          fmImageBase = base;
          resolve(base);
        };
        img.onerror = function () {
          tried++;
          if (tried === bases.length) resolve(fmImageBase);
        };
        img.src = base + testFile;
      });
    });
  }

  // DOM Elements
  const fmUploadZone = document.getElementById("fm-upload-zone");
  const fmFileInput = document.getElementById("fm-file-input");
  const fmPreviewImage = document.getElementById("fm-preview-image");
  const fmUploadPlaceholder = document.getElementById("fm-upload-placeholder");
  const fmCameraBtn = document.getElementById("fm-camera-btn");
  const fmClearBtn = document.getElementById("fm-clear-btn");
  const fmCameraContainer = document.getElementById("fm-camera-container");
  const fmCameraVideo = document.getElementById("fm-camera-video");
  const fmCameraCanvas = document.getElementById("fm-camera-canvas");
  const fmCaptureBtn = document.getElementById("fm-capture-btn");
  const fmCancelCameraBtn = document.getElementById("fm-cancel-camera-btn");
  const fmAnalyzeBtn = document.getElementById("fm-analyze-btn");
  const fmModelStatus = document.getElementById("fm-model-status");
  const fmModelStatusText = document.getElementById("fm-model-status-text");
  const fmResultPlaceholder = document.getElementById("fm-result-placeholder");
  const fmResultLoading = document.getElementById("fm-result-loading");
  const fmResultMatch = document.getElementById("fm-result-match");
  const fmResultError = document.getElementById("fm-result-error");
  const fmLoadingText = document.getElementById("fm-loading-text");

  if (!fmUploadZone) return; // Section not on this page

  // Load AI Models
  async function fmLoadModels() {
    try {
      fmModelStatusText.textContent = "Đang tải mô hình nhận diện khuôn mặt...";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(FM_MODEL_URL);
      fmModelStatusText.textContent = "Đang tải mô hình landmarks...";
      await faceapi.nets.faceLandmark68Net.loadFromUri(FM_MODEL_URL);
      fmModelStatusText.textContent = "Đang tải mô hình nhận diện...";
      await faceapi.nets.faceRecognitionNet.loadFromUri(FM_MODEL_URL);

      fmModelsLoaded = true;
      fmModelStatus.querySelector("div").classList.add("fm-model-ready");
      fmModelStatus.querySelector(".fm-loading-spinner").style.display = "none";
      fmModelStatusText.textContent = "✅ AI sẵn sàng! Tải ảnh lên để bắt đầu.";

      // Re-enable analyze button if image was uploaded before models loaded
      if (fmUserImageSrc) {
        fmAnalyzeBtn.disabled = false;
        fmAnalyzeBtn.classList.add("fm-pulse-ready");
      }

      // Detect correct image path and update gallery
      await fmProbeImageBase();
      fmFigures.forEach(function (f) {
        f.image = fmImageBase + f.file;
      });
      fmRenderGallery();
    } catch (err) {
      console.error("FM: Failed to load models:", err);
      fmModelStatusText.textContent =
        "❌ Không thể tải AI models. Vui lòng tải lại trang.";
    }
  }

  // Load image as HTMLImageElement (works with file:// and http://)
  function fmLoadImage(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        reject(new Error("Image load failed: " + src));
      };
      img.src = src;
    });
  }

  // Use face descriptor (128 float values) to deterministically pick a historical figure
  // Same face always produces the same match
  function fmMatchFigure(descriptor) {
    // Sum descriptor values to create a deterministic index
    var sum = 0;
    for (var i = 0; i < descriptor.length; i++) {
      // Use absolute values and weight by position for better distribution
      sum += Math.abs(descriptor[i]) * (i + 1);
    }
    var index = Math.floor(Math.abs(sum * 1000)) % fmFigures.length;

    // Generate a fun similarity score (60-95%) from different descriptor values
    var scoreSum = 0;
    for (var j = 0; j < descriptor.length; j += 3) {
      scoreSum += Math.abs(descriptor[j]);
    }
    var similarity = 60 + Math.floor((scoreSum * 100) % 36); // 60-95 range

    return { figure: fmFigures[index], similarity: similarity };
  }

  // Render Gallery
  function fmRenderGallery() {
    var gallery = document.getElementById("fm-figures-gallery");
    if (!gallery) return;
    var cards = fmFigures
      .map(function (f) {
        var src = f.image || fmImageBase + f.file;
        return (
          '<div class="fm-figure-card">' +
          '<img src="' +
          src +
          '" alt="' +
          f.name +
          "\" onerror=\"this.style.display='none';this.nextElementSibling.style.display='flex'\" />" +
          '<div class="fm-figure-fallback" style="display:none">' +
          f.emoji +
          "</div>" +
          '<div class="fm-figure-name">' +
          f.name +
          "</div>" +
          '<div class="fm-figure-role">' +
          f.years +
          "</div>" +
          "</div>"
        );
      })
      .join("");
    // Duplicate cards for seamless infinite scroll
    gallery.innerHTML =
      '<div class="fm-gallery-track">' + cards + cards + "</div>";
  }

  // File Upload
  fmUploadZone.addEventListener("click", function (e) {
    if (e.target === fmFileInput) return;
    fmFileInput.click();
  });
  fmUploadZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    fmUploadZone.classList.add("drag-over");
  });
  fmUploadZone.addEventListener("dragleave", function () {
    fmUploadZone.classList.remove("drag-over");
  });
  fmUploadZone.addEventListener("drop", function (e) {
    e.preventDefault();
    fmUploadZone.classList.remove("drag-over");
    if (e.dataTransfer.files[0]) fmHandleFile(e.dataTransfer.files[0]);
  });
  fmFileInput.addEventListener("change", function (e) {
    if (e.target.files[0]) fmHandleFile(e.target.files[0]);
  });

  function fmHandleFile(file) {
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert("Chỉ hỗ trợ file JPG hoặc PNG!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File quá lớn! Tối đa 5MB.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      fmSetPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function fmSetPreview(src) {
    fmUserImageSrc = src;
    fmPreviewImage.src = src;
    fmPreviewImage.classList.remove("hidden");
    fmUploadPlaceholder.classList.add("hidden");
    fmUploadZone.classList.add("has-image");
    fmClearBtn.classList.remove("hidden");
    fmAnalyzeBtn.disabled = !fmModelsLoaded;
    if (fmModelsLoaded) fmAnalyzeBtn.classList.add("fm-pulse-ready");
  }

  function fmClearPreview() {
    fmUserImageSrc = null;
    fmPreviewImage.src = "";
    fmPreviewImage.classList.add("hidden");
    fmUploadPlaceholder.classList.remove("hidden");
    fmUploadZone.classList.remove("has-image");
    fmClearBtn.classList.add("hidden");
    fmAnalyzeBtn.disabled = true;
    fmAnalyzeBtn.classList.remove("fm-pulse-ready");
    fmFileInput.value = "";
    fmShowState("placeholder");
  }

  fmClearBtn.addEventListener("click", fmClearPreview);

  // Camera
  fmCameraBtn.addEventListener("click", async function () {
    try {
      fmCameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      fmCameraVideo.srcObject = fmCameraStream;
      fmCameraContainer.classList.remove("hidden");
      fmCameraBtn.classList.add("hidden");
    } catch (err) {
      alert("Không thể truy cập camera. Vui lòng cấp quyền hoặc tải ảnh lên.");
    }
  });

  fmCaptureBtn.addEventListener("click", function () {
    var ctx = fmCameraCanvas.getContext("2d");
    fmCameraCanvas.width = fmCameraVideo.videoWidth;
    fmCameraCanvas.height = fmCameraVideo.videoHeight;
    ctx.drawImage(fmCameraVideo, 0, 0);
    fmSetPreview(fmCameraCanvas.toDataURL("image/jpeg", 0.9));
    fmStopCamera();
  });

  fmCancelCameraBtn.addEventListener("click", fmStopCamera);

  function fmStopCamera() {
    if (fmCameraStream) {
      fmCameraStream.getTracks().forEach(function (t) {
        t.stop();
      });
      fmCameraStream = null;
    }
    fmCameraContainer.classList.add("hidden");
    fmCameraBtn.classList.remove("hidden");
  }

  // Analyze
  fmAnalyzeBtn.addEventListener("click", fmAnalyze);

  async function fmAnalyze() {
    if (!fmModelsLoaded || !fmUserImageSrc) return;

    fmAnalyzeBtn.disabled = true;
    fmAnalyzeBtn.classList.remove("fm-pulse-ready");
    fmShowState("loading");
    fmLoadingText.textContent = "Đang phát hiện khuôn mặt...";

    try {
      var img = await fmLoadImage(fmUserImageSrc);
      fmLoadingText.textContent = "Đang phân tích đặc điểm khuôn mặt...";

      // Detect user's face with SSD MobileNet
      var detection = await faceapi
        .detectSingleFace(
          img,
          new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        fmShowState("error");
        document.getElementById("fm-error-title").textContent =
          "Không phát hiện khuôn mặt";
        document.getElementById("fm-error-desc").textContent =
          "Vui lòng thử lại với ảnh rõ nét hơn, đảm bảo khuôn mặt nhìn thẳng và đủ ánh sáng.";
        fmAnalyzeBtn.disabled = false;
        return;
      }

      fmLoadingText.textContent = "Đang so sánh với nhân vật lịch sử...";

      // Use face descriptor to deterministically match a historical figure
      var result = fmMatchFigure(detection.descriptor);
      var matchedFigure = result.figure;
      var displaySim = result.similarity;

      // Ensure figure has correct image path
      if (!matchedFigure.image) {
        matchedFigure.image = fmImageBase + matchedFigure.file;
      }

      fmShowState("match");
      fmDisplayMatch(matchedFigure, displaySim);
    } catch (err) {
      console.error("FM analysis failed:", err);
      fmShowState("error");
      document.getElementById("fm-error-title").textContent = "Lỗi phân tích";
      document.getElementById("fm-error-desc").textContent =
        "Đã xảy ra lỗi. Vui lòng thử lại.";
    }

    fmAnalyzeBtn.disabled = false;
  }

  // Display Functions
  function fmShowState(state) {
    fmResultPlaceholder.classList.add("hidden");
    fmResultLoading.classList.add("hidden");
    fmResultMatch.classList.add("hidden");
    fmResultError.classList.add("hidden");
    var el = {
      placeholder: fmResultPlaceholder,
      loading: fmResultLoading,
      match: fmResultMatch,
      error: fmResultError,
    }[state];
    if (el) el.classList.remove("hidden");
  }

  function fmDisplayMatch(figure, similarity) {
    document.getElementById("fm-result-user-img").src = fmUserImageSrc;

    var matchImg = document.getElementById("fm-result-match-img");
    matchImg.src = figure.image;
    matchImg.onerror = function () {
      this.style.display = "none";
      this.parentElement.innerHTML =
        '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-blue-500/20 text-4xl">' +
        figure.emoji +
        "</div>";
    };

    document.getElementById("fm-result-match-name").textContent = figure.name;
    document.getElementById("fm-result-figure-name").textContent = figure.name;
    document.getElementById("fm-result-figure-years").textContent =
      figure.years;
    document.getElementById("fm-result-figure-desc").textContent =
      figure.description;

    var scoreEl = document.getElementById("fm-similarity-score");
    var barEl = document.getElementById("fm-similarity-bar");
    var barTextEl = document.getElementById("fm-similarity-bar-text");

    scoreEl.textContent = "0%";
    scoreEl.classList.add("fm-score-animate");
    barEl.style.width = "0%";

    setTimeout(function () {
      scoreEl.textContent = similarity + "%";
      barEl.style.width = similarity + "%";
      barTextEl.textContent = similarity + "%";
    }, 300);

    if (similarity >= 70) {
      barEl.className =
        "h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000";
    } else if (similarity >= 40) {
      barEl.className =
        "h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-1000";
    } else {
      barEl.className =
        "h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000";
    }
  }

  // Retry buttons
  document
    .getElementById("fm-try-again-btn")
    .addEventListener("click", fmClearPreview);
  document
    .getElementById("fm-error-retry-btn")
    .addEventListener("click", function () {
      fmShowState("placeholder");
    });

  // Init - show gallery with default paths first
  fmFigures.forEach(function (f) {
    f.image = fmImageBase + f.file;
  });
  fmRenderGallery();

  var fmApiWaitCount = 0;
  function fmWaitForApi() {
    if (typeof faceapi !== "undefined") {
      fmLoadModels();
    } else {
      fmApiWaitCount++;
      if (fmApiWaitCount > 75) {
        fmModelStatusText.textContent =
          "❌ Không thể tải thư viện AI. Kiểm tra kết nối mạng và tải lại trang.";
        fmModelStatus.querySelector(".fm-loading-spinner").style.display =
          "none";
      } else {
        setTimeout(fmWaitForApi, 200);
      }
    }
  }
  fmWaitForApi();
})();

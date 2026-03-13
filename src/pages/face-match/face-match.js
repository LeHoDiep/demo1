// ===== Vietnamese Historical Figures Database =====
const historicalFigures = [
  {
    name: "Hồ Chí Minh",
    years: "1890 – 1969",
    image: "../images/historical/ho-chi-minh.jpg",
    description:
      "Chủ tịch nước Việt Nam Dân chủ Cộng hòa, lãnh tụ vĩ đại của dân tộc Việt Nam, người sáng lập Đảng Cộng sản Việt Nam và khai sinh nước Việt Nam Dân chủ Cộng hòa.",
    emoji: "⭐",
  },
  {
    name: "Võ Nguyên Giáp",
    years: "1911 – 2013",
    image: "../images/historical/vo-nguyen-giap.jpg",
    description:
      "Đại tướng đầu tiên của Quân đội Nhân dân Việt Nam, người chỉ huy chiến dịch Điện Biên Phủ lịch sử năm 1954, được mệnh danh là 'Anh Cả' của Quân đội.",
    emoji: "🎖️",
  },
  {
    name: "Trần Hưng Đạo",
    years: "1228 – 1300",
    image: "../images/historical/tran-hung-dao.jpg",
    description:
      "Quốc công Tiết chế, chỉ huy quân đội nhà Trần ba lần đánh thắng quân Nguyên - Mông xâm lược, được tôn là Đức Thánh Trần.",
    emoji: "⚔️",
  },
  {
    name: "Lê Lợi",
    years: "1385 – 1433",
    image: "../images/historical/le-loi.jpg",
    description:
      "Vua sáng lập nhà Hậu Lê, anh hùng dân tộc đã lãnh đạo cuộc khởi nghĩa Lam Sơn (1418-1427) đánh đuổi quân Minh, giành lại độc lập cho đất nước.",
    emoji: "👑",
  },
  {
    name: "Nguyễn Huệ (Quang Trung)",
    years: "1753 – 1792",
    image: "../images/historical/nguyen-hue.jpg",
    description:
      "Hoàng đế Quang Trung, vị anh hùng áo vải, lãnh đạo phong trào Tây Sơn, đại phá quân Thanh trong trận Ngọc Hồi - Đống Đa mùa xuân 1789.",
    emoji: "🏹",
  },
  {
    name: "Phan Bội Châu",
    years: "1867 – 1940",
    image: "../images/historical/phan-boi-chau.jpg",
    description:
      "Nhà yêu nước, chí sĩ cách mạng đầu thế kỷ 20, người khởi xướng phong trào Đông Du, lãnh đạo Việt Nam Quang Phục Hội.",
    emoji: "📜",
  },
  {
    name: "Nguyễn Thị Minh Khai",
    years: "1910 – 1941",
    image: "../images/historical/nguyen-thi-minh-khai.jpg",
    description:
      "Nữ chiến sĩ cách mạng kiên cường, Bí thư Thành ủy Sài Gòn - Chợ Lớn, hy sinh anh dũng trong cuộc đấu tranh giành độc lập.",
    emoji: "🌸",
  },
  {
    name: "Tôn Đức Thắng",
    years: "1888 – 1980",
    image: "../images/historical/ton-duc-thang.jpg",
    description:
      "Chủ tịch nước Việt Nam Dân chủ Cộng hòa (1969-1976), Chủ tịch nước Cộng hòa Xã hội Chủ nghĩa Việt Nam (1976-1980), người bạn chiến đấu thân thiết của Chủ tịch Hồ Chí Minh.",
    emoji: "🏛️",
  },
  {
    name: "Phạm Văn Đồng",
    years: "1906 – 2000",
    image: "../images/historical/pham-van-dong.jpg",
    description:
      "Thủ tướng Chính phủ Việt Nam Dân chủ Cộng hòa và CHXHCN Việt Nam trong suốt 32 năm (1955-1987), học trò xuất sắc của Chủ tịch Hồ Chí Minh.",
    emoji: "📋",
  },
  {
    name: "Hai Bà Trưng",
    years: "14 – 43",
    image: "../images/historical/hai-ba-trung.jpg",
    description:
      "Hai chị em Trưng Trắc và Trưng Nhị, nữ anh hùng dân tộc đầu tiên, lãnh đạo cuộc khởi nghĩa chống quân Đông Hán năm 40, giành lại độc lập cho đất nước.",
    emoji: "🐘",
  },
];

// ===== Global State =====
const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";
let modelsLoaded = false;
let historicalDescriptors = [];
let userImageSrc = null;
let cameraStream = null;

// ===== DOM Elements =====
const uploadZone = document.getElementById("upload-zone");
const fileInput = document.getElementById("file-input");
const previewImage = document.getElementById("preview-image");
const uploadPlaceholder = document.getElementById("upload-placeholder");
const cameraBtn = document.getElementById("camera-btn");
const clearBtn = document.getElementById("clear-btn");
const cameraContainer = document.getElementById("camera-container");
const cameraVideo = document.getElementById("camera-video");
const cameraCanvas = document.getElementById("camera-canvas");
const captureBtn = document.getElementById("capture-btn");
const cancelCameraBtn = document.getElementById("cancel-camera-btn");
const analyzeBtn = document.getElementById("analyze-btn");
const modelStatus = document.getElementById("model-status");
const modelStatusText = document.getElementById("model-status-text");

// Result elements
const resultPlaceholder = document.getElementById("result-placeholder");
const resultLoading = document.getElementById("result-loading");
const resultMatch = document.getElementById("result-match");
const resultError = document.getElementById("result-error");
const loadingText = document.getElementById("loading-text");

// ===== Load AI Models =====
async function loadModels() {
  try {
    modelStatusText.textContent = "Đang tải mô hình nhận diện khuôn mặt...";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

    modelStatusText.textContent = "Đang tải mô hình landmarks...";
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

    modelStatusText.textContent = "Đang tải mô hình nhận diện...";
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    modelsLoaded = true;
    modelStatus.querySelector("div").classList.add("model-ready");
    modelStatus.querySelector(".loading-spinner").style.display = "none";
    modelStatusText.textContent = "✅ AI sẵn sàng! Tải ảnh lên để bắt đầu.";

    // Load historical figure descriptors
    await loadHistoricalDescriptors();
  } catch (err) {
    console.error("Failed to load models:", err);
    modelStatusText.textContent =
      "❌ Không thể tải AI models. Vui lòng tải lại trang.";
    modelStatus.querySelector("div").style.borderColor = "rgba(239,68,68,0.3)";
    modelStatus.querySelector("div").style.color = "#f87171";
  }
}

// ===== Load Historical Figure Descriptors =====
async function loadHistoricalDescriptors() {
  modelStatusText.textContent = "Đang phân tích nhân vật lịch sử...";
  historicalDescriptors = [];

  let loaded = 0;
  for (const figure of historicalFigures) {
    try {
      const img = await faceapi.fetchImage(figure.image);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        historicalDescriptors.push({
          ...figure,
          descriptor: detection.descriptor,
        });
        loaded++;
      }
    } catch (e) {
      // Image not available yet - skip silently
      console.warn("Could not load image for " + figure.name + ":", e.message);
    }
  }

  if (loaded > 0) {
    modelStatusText.textContent =
      "✅ AI sẵn sàng! Đã tải " +
      loaded +
      "/" +
      historicalFigures.length +
      " nhân vật.";
  } else {
    modelStatusText.textContent =
      "✅ AI sẵn sàng! Chưa có ảnh nhân vật lịch sử — hãy thêm ảnh vào thư mục images/historical/";
  }
}

// ===== Render Gallery =====
function renderGallery() {
  const gallery = document.getElementById("figures-gallery");
  if (!gallery) return;

  gallery.innerHTML = historicalFigures
    .map(
      (figure) => `
    <div class="figure-card">
      <img
        src="${figure.image}"
        alt="${figure.name}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
      />
      <div class="figure-fallback" style="display:none">${figure.emoji}</div>
      <div class="figure-name">${figure.name}</div>
      <div class="figure-role">${figure.years}</div>
    </div>
  `,
    )
    .join("");
}

// ===== File Upload Handling =====
uploadZone.addEventListener("click", () => fileInput.click());

uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("drag-over");
});

uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("drag-over");
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  // Validate file type
  if (!file.type.match(/^image\/(jpeg|png)$/)) {
    alert("Chỉ hỗ trợ file JPG hoặc PNG!");
    return;
  }
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert("File quá lớn! Tối đa 5MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    setPreviewImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function setPreviewImage(src) {
  userImageSrc = src;
  previewImage.src = src;
  previewImage.classList.remove("hidden");
  uploadPlaceholder.classList.add("hidden");
  uploadZone.classList.add("has-image");
  clearBtn.classList.remove("hidden");
  analyzeBtn.disabled = !modelsLoaded;
  if (modelsLoaded) analyzeBtn.classList.add("pulse-ready");
}

function clearPreview() {
  userImageSrc = null;
  previewImage.src = "";
  previewImage.classList.add("hidden");
  uploadPlaceholder.classList.remove("hidden");
  uploadZone.classList.remove("has-image");
  clearBtn.classList.add("hidden");
  analyzeBtn.disabled = true;
  analyzeBtn.classList.remove("pulse-ready");
  fileInput.value = "";
  showResultState("placeholder");
}

clearBtn.addEventListener("click", clearPreview);

// ===== Camera Handling =====
cameraBtn.addEventListener("click", async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    });
    cameraVideo.srcObject = cameraStream;
    cameraContainer.classList.remove("hidden");
    cameraBtn.classList.add("hidden");
  } catch (err) {
    alert(
      "Không thể truy cập camera. Vui lòng cấp quyền hoặc sử dụng tải ảnh lên.",
    );
  }
});

captureBtn.addEventListener("click", () => {
  const ctx = cameraCanvas.getContext("2d");
  cameraCanvas.width = cameraVideo.videoWidth;
  cameraCanvas.height = cameraVideo.videoHeight;
  ctx.drawImage(cameraVideo, 0, 0);
  const dataUrl = cameraCanvas.toDataURL("image/jpeg", 0.9);
  setPreviewImage(dataUrl);
  stopCamera();
});

cancelCameraBtn.addEventListener("click", stopCamera);

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  cameraContainer.classList.add("hidden");
  cameraBtn.classList.remove("hidden");
}

// ===== Face Analysis =====
analyzeBtn.addEventListener("click", analyzeFace);

async function analyzeFace() {
  if (!modelsLoaded || !userImageSrc) return;

  analyzeBtn.disabled = true;
  analyzeBtn.classList.remove("pulse-ready");
  showResultState("loading");
  loadingText.textContent = "Đang phát hiện khuôn mặt...";

  try {
    // Create image element from user photo
    const img = await faceapi.fetchImage(userImageSrc);

    loadingText.textContent = "Đang phân tích đặc điểm khuôn mặt...";

    // Detect face with landmarks and descriptor
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      showResultState("error");
      document.getElementById("error-title").textContent =
        "Không phát hiện khuôn mặt";
      document.getElementById("error-desc").textContent =
        "Vui lòng thử lại với ảnh rõ nét hơn, đảm bảo khuôn mặt nhìn thẳng và đủ ánh sáng.";
      analyzeBtn.disabled = false;
      return;
    }

    loadingText.textContent = "Đang so sánh với nhân vật lịch sử...";

    if (historicalDescriptors.length === 0) {
      showResultState("error");
      document.getElementById("error-title").textContent =
        "Chưa có dữ liệu nhân vật";
      document.getElementById("error-desc").textContent =
        "Cần thêm ảnh nhân vật lịch sử vào thư mục src/images/historical/ để hệ thống hoạt động. Xem hướng dẫn bên dưới.";
      analyzeBtn.disabled = false;
      return;
    }

    // Find best match
    let bestMatch = null;
    let bestDistance = Infinity;

    for (const figure of historicalDescriptors) {
      const distance = faceapi.euclideanDistance(
        detection.descriptor,
        figure.descriptor,
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = figure;
      }
    }

    // Convert distance to similarity percentage
    // face-api distance ranges from 0 (identical) to ~1.5+ (very different)
    // We'll map 0-1.0 to 100%-0% with a curve
    const similarity = Math.max(
      0,
      Math.min(100, (1 - bestDistance / 1.0) * 100),
    );
    const displaySimilarity = Math.round(similarity);

    // Show results
    showResultState("match");
    displayMatch(bestMatch, displaySimilarity);
  } catch (err) {
    console.error("Analysis failed:", err);
    showResultState("error");
    document.getElementById("error-title").textContent = "Lỗi phân tích";
    document.getElementById("error-desc").textContent =
      "Đã xảy ra lỗi trong quá trình phân tích. Vui lòng thử lại.";
  }

  analyzeBtn.disabled = false;
}

// ===== Display Functions =====
function showResultState(state) {
  resultPlaceholder.classList.add("hidden");
  resultLoading.classList.add("hidden");
  resultMatch.classList.add("hidden");
  resultError.classList.add("hidden");

  switch (state) {
    case "placeholder":
      resultPlaceholder.classList.remove("hidden");
      break;
    case "loading":
      resultLoading.classList.remove("hidden");
      break;
    case "match":
      resultMatch.classList.remove("hidden");
      break;
    case "error":
      resultError.classList.remove("hidden");
      break;
  }
}

function displayMatch(figure, similarity) {
  // Set user image
  document.getElementById("result-user-img").src = userImageSrc;

  // Set match image
  const matchImg = document.getElementById("result-match-img");
  matchImg.src = figure.image;
  matchImg.onerror = function () {
    this.style.display = "none";
    this.parentElement.innerHTML =
      '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-blue-500/20 text-4xl">' +
      figure.emoji +
      "</div>";
  };

  // Set match info
  document.getElementById("result-match-name").textContent = figure.name;
  document.getElementById("result-figure-name").textContent = figure.name;
  document.getElementById("result-figure-years").textContent = figure.years;
  document.getElementById("result-figure-desc").textContent =
    figure.description;

  // Animate similarity score
  const scoreEl = document.getElementById("similarity-score");
  const barEl = document.getElementById("similarity-bar");
  const barTextEl = document.getElementById("similarity-bar-text");

  scoreEl.textContent = "0%";
  scoreEl.classList.add("score-animate");
  barEl.style.width = "0%";

  // Animate after a short delay
  setTimeout(() => {
    scoreEl.textContent = similarity + "%";
    barEl.style.width = similarity + "%";
    barTextEl.textContent = similarity + "%";
  }, 300);

  // Set bar color based on similarity
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

// ===== Try Again / Retry Buttons =====
document.getElementById("try-again-btn").addEventListener("click", () => {
  clearPreview();
});

document.getElementById("error-retry-btn").addEventListener("click", () => {
  showResultState("placeholder");
});

// ===== Mobile Nav Toggle =====
(function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!toggle || !mobileMenu) return;

  toggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });
})();

// ===== User Menu Logic =====
(function initUserMenu() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";

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
  if (navRight) {
    const userDiv = document.createElement("div");
    userDiv.className = "relative";
    userDiv.innerHTML =
      '<button id="user-menu-button" class="text-white hover:text-orange-400">Welcome, ' +
      user.username +
      " ▼</button>" +
      '<div id="user-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-50">' +
      '<a href="./profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Xem thông tin</a>' +
      '<a href="./#" id="logout-btn" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>' +
      "</div>";
    navRight.appendChild(userDiv);
    document
      .getElementById("user-menu-button")
      .addEventListener("click", () => {
        document.getElementById("user-menu").classList.toggle("hidden");
      });
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  }
})();

// ===== Initialize =====
renderGallery();

// Wait for face-api.js to load, then load models
function waitForFaceApi() {
  if (typeof faceapi !== "undefined") {
    loadModels();
  } else {
    setTimeout(waitForFaceApi, 200);
  }
}
waitForFaceApi();

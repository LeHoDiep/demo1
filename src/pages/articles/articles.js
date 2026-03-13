// ===== Articles Page =====

// --- API config ---
const ARTICLES_API = "https://69057f58ee3d0d14c132c727.mockapi.io/articles";

// --- API helpers ---
function getArticles() {
  return fetch(ARTICLES_API)
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      return Array.isArray(data) ? data : [];
    })
    .catch(function () {
      return [];
    });
}

function createArticle(article) {
  return fetch(ARTICLES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  }).then(function (r) {
    return r.json();
  });
}

function updateArticle(id, updates) {
  return fetch(ARTICLES_API + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  }).then(function (r) {
    return r.json();
  });
}

function deleteArticleAPI(id) {
  return fetch(ARTICLES_API + "/" + id, {
    method: "DELETE",
  }).then(function (r) {
    return r.json();
  });
}

// --- Seed default articles if API is empty ---
function seedDefaults() {
  return getArticles().then(function (articles) {
    if (articles.length > 0) return Promise.resolve();
    var defaults = [
      {
        title: "Trung bình lớp học ai tờ",
        summary:
          "hình ảnh người đàn ông dạy học lớp ai tờ cho đám trò trẻ, trong thời kỳ cách mạng công nghiệp 4.0, với phong cách hoạt hình vui nhộn và màu sắc tươi sáng.",
        content:
          "# Trung bình lớp học ai tờ\n\nhình ảnh người đàn ông dạy học lớp ai tờ cho đám trò trẻ, trong thời kỳ cách mạng công nghiệp 4.0, với phong cách hoạt hình vui nhộn và màu sắc tươi sáng.\n\n## Nội dung chi tiết\n\nĐây là nội dung mẫu cho bài viết đầu tiên. Bạn có thể chỉnh sửa nội dung này bằng Markdown.",
        image: "../images/rp1.jpg",
        order: 0,
        showInCarousel: true,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Tiêu đề bài báo 2",
        summary:
          "Đây là nội dung tóm tắt của bài báo thứ hai. Mô tả chi tiết về các sự kiện lịch sử quan trọng.",
        content:
          "# Tiêu đề bài báo 2\n\nĐây là nội dung tóm tắt của bài báo thứ hai. Mô tả chi tiết về các sự kiện lịch sử quan trọng.\n\n## Chi tiết\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "../images/rp2.jpg",
        order: 1,
        showInCarousel: true,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Tiêu đề bài báo 3",
        summary:
          "Bài báo thứ ba cung cấp thông tin chi tiết về các giai đoạn phát triển.",
        content:
          "# Tiêu đề bài báo 3\n\nBài báo thứ ba cung cấp thông tin chi tiết về các giai đoạn phát triển.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
        image: "../images/rp3.jpg",
        order: 2,
        showInCarousel: true,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Tiêu đề bài báo 4",
        summary:
          "Bài báo thứ tư tập trung vào những khía cạnh quan trọng của lịch sử.",
        content:
          "# Tiêu đề bài báo 4\n\nBài báo thứ tư tập trung vào những khía cạnh quan trọng của lịch sử.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
        image: "../images/rp4.jpg",
        order: 3,
        showInCarousel: true,
        createdAt: new Date().toISOString(),
      },
      {
        title: "Tiêu đề bài báo 5",
        summary:
          "Bài báo cuối cùng kết luận về những điểm chính và tầm quan trọng của việc học lịch sử.",
        content:
          "# Tiêu đề bài báo 5\n\nBài báo cuối cùng kết luận về những điểm chính và tầm quan trọng của việc học lịch sử.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
        image: "../images/rp5.jpg",
        order: 4,
        showInCarousel: true,
        createdAt: new Date().toISOString(),
      },
    ];
    return Promise.all(
      defaults.map(function (d) {
        return createArticle(d);
      }),
    );
  });
}

// --- Auth / Admin ---
const currentUser = JSON.parse(localStorage.getItem("user"));
const isAdmin = currentUser && currentUser.isAdmin === true;

// --- DOM refs ---
const listView = document.getElementById("articles-list");
const emptyMsg = document.getElementById("articles-empty");
const detailView = document.getElementById("article-detail");
const editorPanel = document.getElementById("editor-panel");
const adminManage = document.getElementById("admin-manage");
const btnNew = document.getElementById("btn-new-article");
const btnBack = document.getElementById("btn-back");
const btnSave = document.getElementById("btn-save-article");
const btnCloseEditor = document.getElementById("btn-close-editor");
const btnCancelEditor = document.getElementById("btn-cancel-editor");

let editingId = null; // null = new article

// --- Configure marked for safe rendering ---
if (typeof marked !== "undefined") {
  marked.setOptions({ breaks: true, gfm: true });
}

function renderMarkdown(md) {
  if (typeof marked !== "undefined") {
    // DOMPurify not available, but marked with default options is relatively safe
    // We sanitize by stripping script tags from output
    var html = marked.parse(md || "");
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    tmp.querySelectorAll("script").forEach(function (s) {
      s.remove();
    });
    return tmp.innerHTML;
  }
  // Fallback: plain text with line breaks
  return (md || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

// --- Render articles list ---
function renderList() {
  getArticles().then(function (articles) {
    articles.sort(function (a, b) {
      return a.order - b.order;
    });
    listView.innerHTML = "";

    if (articles.length === 0) {
      emptyMsg.classList.remove("hidden");
      listView.classList.add("hidden");
      return;
    }

    emptyMsg.classList.add("hidden");
    listView.classList.remove("hidden");

    articles.forEach(function (art) {
      var card = document.createElement("div");
      card.className = "article-card flex flex-col sm:flex-row relative";
      card.setAttribute("data-id", art.id);

      // Admin action buttons overlay
      var adminHtml = "";
      if (isAdmin) {
        adminHtml =
          '<div class="admin-card-actions absolute top-2 right-2 flex gap-1.5 z-10">' +
          '<button class="card-pin-btn flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ' +
          (art.showInCarousel
            ? "bg-yellow-500 text-gray-900"
            : "bg-white/10 text-white/60 hover:bg-white/20") +
          '" data-id="' +
          art.id +
          '" title="Hiển thị trên carousel trang chủ">📌</button>' +
          '<button class="card-edit-btn px-2 py-1 rounded text-xs bg-white/10 text-white/60 hover:bg-blue-500/30 hover:text-blue-300 transition-colors" data-id="' +
          art.id +
          '" title="Chỉnh sửa">✏️</button>' +
          '<button class="card-delete-btn px-2 py-1 rounded text-xs bg-white/10 text-white/60 hover:bg-red-500/30 hover:text-red-300 transition-colors" data-id="' +
          art.id +
          '" title="Xóa">🗑️</button>' +
          "</div>";
      }

      card.innerHTML =
        adminHtml +
        '<div class="sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-orange-900/50">' +
        '<img src="' +
        escapeAttr(art.image) +
        '" alt="' +
        escapeAttr(art.title) +
        '" class="w-full h-full object-cover" onerror="this.style.display=\'none\'" />' +
        "</div>" +
        '<div class="p-5 flex flex-col justify-center flex-1">' +
        '<h3 class="text-lg md:text-xl font-bold text-white mb-2">' +
        escapeHtml(art.title) +
        "</h3>" +
        '<p class="text-sm text-white/60 mb-3 line-clamp-2">' +
        escapeHtml(art.summary || "") +
        "</p>" +
        '<span class="text-xs text-white/30">' +
        formatDate(art.createdAt) +
        "</span>" +
        "</div>";

      // Admin: wire up edit/delete/pin buttons (stopPropagation to avoid opening detail)
      if (isAdmin) {
        card
          .querySelector(".card-edit-btn")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            openEditor(art.id);
          });
        card
          .querySelector(".card-delete-btn")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            if (confirm("Xoá bài viết: " + art.title + "?")) {
              deleteArticle(art.id);
            }
          });
        card
          .querySelector(".card-pin-btn")
          .addEventListener("click", function (e) {
            e.stopPropagation();
            toggleCarousel(art.id, !art.showInCarousel);
            renderList();
          });
      }

      card.addEventListener("click", function () {
        showDetail(art.id);
      });
      listView.appendChild(card);
    });
  }); // end getArticles().then
}

// --- Show single article ---
function showDetail(id) {
  getArticles().then(function (articles) {
    var art = articles.find(function (a) {
      return a.id === id;
    });
    if (!art) return;

    listView.parentElement
      .querySelector(".flex.items-center.justify-between")
      .classList.add("hidden");
    listView.classList.add("hidden");
    emptyMsg.classList.add("hidden");
    if (adminManage) adminManage.classList.add("hidden");

    detailView.classList.remove("hidden");

    var img = document.getElementById("detail-image");
    img.src = art.image;
    img.alt = art.title;
    img.onerror = function () {
      this.style.display = "none";
    };
    document.getElementById("detail-title").textContent = art.title;
    document.getElementById("detail-date").textContent = formatDate(
      art.createdAt,
    );
    document.getElementById("detail-content").innerHTML = renderMarkdown(
      art.content,
    );

    // Update URL hash
    history.pushState(null, "", "articles.html?id=" + art.id);
  });
}

function showList() {
  detailView.classList.add("hidden");
  listView.parentElement
    .querySelector(".flex.items-center.justify-between")
    .classList.remove("hidden");
  if (adminManage && isAdmin) adminManage.classList.remove("hidden");
  renderList();
  history.pushState(null, "", "articles.html");
}

// --- Admin: Editor ---
function openEditor(id) {
  editingId = id || null;
  var heading = document.getElementById("editor-heading");

  if (editingId) {
    heading.textContent = "Chỉnh sửa bài viết";
    getArticles().then(function (articles) {
      var art = articles.find(function (a) {
        return a.id === editingId;
      });
      if (art) {
        document.getElementById("editor-title").value = art.title;
        document.getElementById("editor-summary").value = art.summary || "";
        document.getElementById("editor-image").value = art.image || "";
        document.getElementById("editor-content").value = art.content || "";
      }
    });
  } else {
    heading.textContent = "Tạo bài viết mới";
    document.getElementById("editor-title").value = "";
    document.getElementById("editor-summary").value = "";
    document.getElementById("editor-image").value = "";
    document.getElementById("editor-content").value = "";
  }

  // Reset to write tab
  switchEditorTab("write");
  editorPanel.classList.remove("hidden");
  listView.classList.add("hidden");
  document.body.style.overflow = "hidden";
}

function closeEditor() {
  editorPanel.classList.add("hidden");
  listView.classList.remove("hidden");
  document.body.style.overflow = "";
  editingId = null;
}

function saveArticle() {
  var title = document.getElementById("editor-title").value.trim();
  var summary = document.getElementById("editor-summary").value.trim();
  var image = document.getElementById("editor-image").value.trim();
  var content = document.getElementById("editor-content").value;

  if (!title) {
    alert("Vui lòng nhập tiêu đề bài viết.");
    return;
  }

  var promise;
  if (editingId) {
    promise = updateArticle(editingId, {
      title: title,
      summary: summary,
      image: image,
      content: content,
    });
  } else {
    promise = getArticles().then(function (articles) {
      return createArticle({
        title: title,
        summary: summary,
        image: image,
        content: content,
        order: articles.length,
        showInCarousel: false,
        createdAt: new Date().toISOString(),
      });
    });
  }

  promise.then(function () {
    closeEditor();
    renderList();
  });
}

// --- Admin: Manage list with drag & carousel toggle ---
function renderAdminList() {
  var container = document.getElementById("admin-article-list");
  if (!container) return;
  getArticles().then(function (articles) {
    articles.sort(function (a, b) {
      return a.order - b.order;
    });
    container.innerHTML = "";

    articles.forEach(function (art) {
      var row = document.createElement("div");
      row.className = "admin-row";
      row.setAttribute("draggable", "true");
      row.setAttribute("data-id", art.id);
      row.innerHTML =
        '<span class="drag-handle" title="Kéo để sắp xếp">⠿</span>' +
        '<span class="flex-1 text-white text-sm truncate">' +
        escapeHtml(art.title) +
        "</span>" +
        '<label class="carousel-toggle" title="Hiển thị trên carousel trang chủ">' +
        '<input type="checkbox" ' +
        (art.showInCarousel ? "checked" : "") +
        " />" +
        '<span class="slider"></span>' +
        "</label>" +
        '<button class="admin-edit-btn text-yellow-400 hover:text-yellow-300 text-sm flex-shrink-0" data-id="' +
        art.id +
        '">✏️</button>' +
        '<button class="admin-delete-btn text-red-400 hover:text-red-300 text-sm flex-shrink-0" data-id="' +
        art.id +
        '">🗑️</button>';

      // Carousel toggle
      row
        .querySelector("input[type=checkbox]")
        .addEventListener("change", function (e) {
          toggleCarousel(art.id, e.target.checked);
        });

      // Edit button
      row
        .querySelector(".admin-edit-btn")
        .addEventListener("click", function () {
          openEditor(art.id);
        });

      // Delete button
      row
        .querySelector(".admin-delete-btn")
        .addEventListener("click", function () {
          if (confirm("Xoá bài viết: " + art.title + "?")) {
            deleteArticle(art.id);
          }
        });

      // Drag events
      row.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", art.id);
        row.classList.add("dragging");
      });
      row.addEventListener("dragend", function () {
        row.classList.remove("dragging");
      });
      row.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      row.addEventListener("drop", function (e) {
        e.preventDefault();
        var draggedId = e.dataTransfer.getData("text/plain");
        if (draggedId !== art.id) {
          reorderArticles(draggedId, art.id);
        }
      });

      container.appendChild(row);
    });
  });
}

function toggleCarousel(id, value) {
  updateArticle(id, { showInCarousel: value });
}

function deleteArticle(id) {
  deleteArticleAPI(id).then(function () {
    renderList();
  });
}

function reorderArticles(draggedId, targetId) {
  getArticles().then(function (articles) {
    articles.sort(function (a, b) {
      return a.order - b.order;
    });
    var draggedIdx = articles.findIndex(function (a) {
      return a.id === draggedId;
    });
    var targetIdx = articles.findIndex(function (a) {
      return a.id === targetId;
    });
    if (draggedIdx < 0 || targetIdx < 0) return;

    var item = articles.splice(draggedIdx, 1)[0];
    articles.splice(targetIdx, 0, item);
    var updates = articles.map(function (a, i) {
      return updateArticle(a.id, { order: i });
    });
    Promise.all(updates).then(function () {
      renderAdminList();
      renderList();
    });
  });
}

// --- Editor tabs ---
function switchEditorTab(tab) {
  var writeArea = document.getElementById("editor-content");
  var previewArea = document.getElementById("editor-preview");
  var tabs = document.querySelectorAll(".editor-tab");

  tabs.forEach(function (t) {
    t.classList.remove("active");
    t.classList.add("bg-white/5", "text-white/50");
    t.classList.remove("bg-white/20", "text-white");
  });

  if (tab === "preview") {
    writeArea.classList.add("hidden");
    previewArea.classList.remove("hidden");
    previewArea.innerHTML = renderMarkdown(writeArea.value);
    tabs[1].classList.add("active");
    tabs[1].classList.remove("bg-white/5", "text-white/50");
    tabs[1].classList.add("bg-white/20", "text-white");
  } else {
    writeArea.classList.remove("hidden");
    previewArea.classList.add("hidden");
    tabs[0].classList.add("active");
    tabs[0].classList.remove("bg-white/5", "text-white/50");
    tabs[0].classList.add("bg-white/20", "text-white");
  }
}

document.querySelectorAll(".editor-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    switchEditorTab(this.getAttribute("data-tab"));
  });
});

// --- Helpers ---
function escapeHtml(str) {
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(iso) {
  if (!iso) return "";
  var d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- Event listeners ---
btnBack.addEventListener("click", showList);

if (isAdmin) {
  btnNew.classList.remove("hidden");

  btnNew.addEventListener("click", function () {
    openEditor(null);
  });
  btnSave.addEventListener("click", saveArticle);
  btnCloseEditor.addEventListener("click", closeEditor);
  btnCancelEditor.addEventListener("click", closeEditor);
}

// --- User menu (same pattern as other pages) ---
if (currentUser) {
  document.getElementById("login-link").style.display = "none";
  document.getElementById("register-link").style.display = "none";
  var mobileLogin = document.getElementById("mobile-login-link");
  var mobileRegister = document.getElementById("mobile-register-link");
  if (mobileLogin) {
    mobileLogin.textContent = currentUser.username;
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
  var navRight = document.getElementById("nav-right");
  var userDiv = document.createElement("div");
  userDiv.className = "relative";
  userDiv.innerHTML =
    '<button id="user-menu-button" class="text-white hover:text-orange-400">Welcome, ' +
    escapeHtml(currentUser.username) +
    " ▼</button>" +
    '<div id="user-menu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-50">' +
    '<a href="./profile.html" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Xem thông tin</a>' +
    '<a href="./#" id="logout-btn" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</a>' +
    "</div>";
  navRight.appendChild(userDiv);
  document
    .getElementById("user-menu-button")
    .addEventListener("click", function () {
      document.getElementById("user-menu").classList.toggle("hidden");
    });
  document.getElementById("logout-btn").addEventListener("click", function () {
    localStorage.removeItem("user");
    location.reload();
  });
}

// Mobile nav toggle
(function () {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      menu.classList.toggle("hidden");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.add("hidden");
      });
    });
  }
})();

// --- Init ---
// Seed defaults then render
seedDefaults().then(function () {
  var params = new URLSearchParams(window.location.search);
  var articleId = params.get("id");
  if (articleId) {
    showDetail(articleId);
  } else {
    renderList();
  }
});

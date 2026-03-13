// ===== History Page JS =====

// User menu
(function initUserMenu() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  if (user && loginLink && registerLink) {
    loginLink.textContent = user.username;
    loginLink.href = "profile.html";
    registerLink.textContent = "Đăng xuất";
    registerLink.href = "#";
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      location.reload();
    });
  }
})();

// Scroll spy — highlight active sidebar link
(function initScrollSpy() {
  const links = document.querySelectorAll(".timeline-link[data-target]");
  if (!links.length) return;

  const targets = [];
  links.forEach(function (link) {
    const id = link.getAttribute("data-target");
    const el = document.getElementById(id);
    if (el) targets.push({ link: link, el: el });
  });

  function onScroll() {
    const scrollY = window.scrollY + 140;

    let current = null;
    for (let i = targets.length - 1; i >= 0; i--) {
      if (targets[i].el.offsetTop <= scrollY) {
        current = targets[i];
        break;
      }
    }

    links.forEach(function (l) {
      l.classList.remove("active");
    });
    if (current) {
      current.link.classList.add("active");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// Smooth scroll on timeline click
document.querySelectorAll('.timeline-link[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const id = this.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Nav shadow on scroll
(function initNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 10) {
        nav.classList.add("shadow-xl");
      } else {
        nav.classList.remove("shadow-xl");
      }
    },
    { passive: true },
  );
})();

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
  var user = JSON.parse(localStorage.getItem("user"));
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

// ===== COMMENTS SECTION =====
(function initComments() {
  var COMMENTS_API =
    "https://69057f58ee3d0d14c132c727.mockapi.io/commentQuestion";
  var currentUser = JSON.parse(localStorage.getItem("user"));

  var loginPrompt = document.getElementById("comment-login-prompt");
  var commentForm = document.getElementById("comment-form");
  var commentInput = document.getElementById("comment-input");
  var commentSubmit = document.getElementById("comment-submit");
  var commentAvatar = document.getElementById("comment-avatar");
  var commentsList = document.getElementById("comments-list");
  var commentsLoading = document.getElementById("comments-loading");
  var commentsEmpty = document.getElementById("comments-empty");

  if (!commentsList) return;

  if (currentUser) {
    commentForm.classList.remove("hidden");
    commentAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
  } else {
    loginPrompt.classList.remove("hidden");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function timeAgo(dateStr) {
    if (!dateStr) return "";
    var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "v\u1EEBa xong";
    if (diff < 3600)
      return Math.floor(diff / 60) + " ph\u00FAt tr\u01B0\u1EDBc";
    if (diff < 86400)
      return Math.floor(diff / 3600) + " gi\u1EDD tr\u01B0\u1EDBc";
    if (diff < 2592000)
      return Math.floor(diff / 86400) + " ng\u00E0y tr\u01B0\u1EDBc";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  }

  function getAvatarColor(name) {
    var colors = [
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    var hash = 0;
    for (var i = 0; i < (name || "").length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  function fetchComments() {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, 8000);
    return fetch(COMMENTS_API, { signal: controller.signal })
      .then(function (r) {
        clearTimeout(timer);
        return r.json();
      })
      .then(function (data) {
        return Array.isArray(data) ? data : [];
      })
      .catch(function (err) {
        clearTimeout(timer);
        console.error("Fetch comments failed:", err);
        return [];
      });
  }

  function postComment(body) {
    return fetch(COMMENTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json();
    });
  }

  function deleteCommentAPI(id) {
    return fetch(COMMENTS_API + "/" + id, { method: "DELETE" }).then(
      function (r) {
        return r.json();
      },
    );
  }

  function getCascadeDeleteIds(rootId, comments) {
    var childrenByParent = {};
    comments.forEach(function (c) {
      var p = String(c.parentId || "");
      if (!childrenByParent[p]) childrenByParent[p] = [];
      childrenByParent[p].push(String(c.id));
    });

    var ids = [];
    function visit(id) {
      var children = childrenByParent[String(id)] || [];
      children.forEach(visit);
      ids.push(String(id));
    }

    visit(String(rootId));
    return ids;
  }

  function buildTree(comments) {
    var map = {};
    var roots = [];
    comments.forEach(function (c) {
      map[c.id] = Object.assign({}, c, { children: [] });
    });
    comments.forEach(function (c) {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].children.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });
    function sortByDate(arr) {
      arr.sort(function (a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      arr.forEach(function (c) {
        sortByDate(c.children);
      });
    }
    sortByDate(roots);
    return { roots: roots, map: map };
  }

  function renderComments() {
    commentsLoading.classList.remove("hidden");
    commentsList.classList.add("hidden");
    commentsEmpty.classList.add("hidden");

    fetchComments().then(function (data) {
      commentsLoading.classList.add("hidden");
      if (data.length === 0) {
        commentsEmpty.classList.remove("hidden");
        return;
      }
      var tree = buildTree(data);
      commentsList.innerHTML = "";
      tree.roots.forEach(function (node) {
        commentsList.appendChild(renderCommentNode(node, tree.map));
      });
      commentsList.classList.remove("hidden");
    });
  }

  function renderCommentNode(node, map) {
    var wrapper = document.createElement("div");
    var item = document.createElement("div");
    item.className = "comment-item";

    var avatarColor = getAvatarColor(node.username);
    var isOwner = currentUser && currentUser.username === node.username;
    var isAdmin = currentUser && currentUser.isAdmin;
    var likesArr = (node.likes || "").split(",").filter(Boolean);
    var hasLiked = currentUser && likesArr.indexOf(currentUser.username) >= 0;
    var likeCount = likesArr.length;

    item.innerHTML =
      '<div class="flex gap-3">' +
      '<div class="comment-avatar ' +
      avatarColor +
      ' text-white">' +
      escapeHtml((node.username || "?").charAt(0).toUpperCase()) +
      "</div>" +
      '<div class="flex-1 min-w-0">' +
      '<div class="flex items-center gap-2 flex-wrap">' +
      '<span class="text-sm font-semibold text-white">' +
      escapeHtml(node.username || "Kh\u00E1ch") +
      "</span>" +
      (node.isAdmin
        ? '<span class="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">Admin</span>'
        : "") +
      '<span class="text-xs text-gray-500">' +
      timeAgo(node.createdAt) +
      "</span>" +
      "</div>" +
      '<p class="text-sm text-gray-300 mt-1 break-words">' +
      escapeHtml(node.content) +
      "</p>" +
      '<div class="flex items-center gap-1 mt-2">' +
      '<button class="comment-btn like-btn text-gray-400 ' +
      (hasLiked ? "liked" : "") +
      '" data-id="' +
      node.id +
      '">' +
      '<span class="like-icon"></span> ' +
      '<span class="like-count">' +
      (likeCount > 0 ? likeCount : "") +
      "</span>" +
      "</button>" +
      (currentUser
        ? '<button class="comment-btn reply-btn text-gray-400 hover:text-yellow-400" data-id="' +
          node.id +
          '" data-username="' +
          escapeHtml(node.username) +
          '">\uD83D\uDCAC Tr\u1EA3 l\u1EDDi</button>'
        : "") +
      (isOwner || isAdmin
        ? '<button class="comment-btn delete-btn text-gray-500 hover:text-red-400" data-id="' +
          node.id +
          '">\uD83D\uDDD1\uFE0F X\u00F3a</button>'
        : "") +
      "</div>" +
      "</div>" +
      "</div>";

    wrapper.appendChild(item);

    var replySlot = document.createElement("div");
    replySlot.className = "reply-form hidden";
    replySlot.setAttribute("data-reply-for", node.id);
    wrapper.appendChild(replySlot);

    if (node.children.length > 0) {
      var repliesDiv = document.createElement("div");
      repliesDiv.className = "comment-replies space-y-3";
      node.children.forEach(function (child) {
        repliesDiv.appendChild(renderCommentNode(child, map));
      });
      wrapper.appendChild(repliesDiv);
    }

    var likeBtn = item.querySelector(".like-btn");
    if (likeBtn)
      likeBtn.addEventListener("click", function () {
        handleLike(node, likesArr, hasLiked);
      });

    var replyBtn = item.querySelector(".reply-btn");
    if (replyBtn)
      replyBtn.addEventListener("click", function () {
        toggleReplyForm(node.id, node.username);
      });

    var deleteBtn = item.querySelector(".delete-btn");
    if (deleteBtn)
      deleteBtn.addEventListener("click", function () {
        handleDelete(node);
      });

    return wrapper;
  }

  function handleLike(node, likesArr, hasLiked) {
    if (!currentUser) return;
    var newLikes;
    if (hasLiked) {
      newLikes = likesArr.filter(function (u) {
        return u !== currentUser.username;
      });
    } else {
      newLikes = likesArr.concat(currentUser.username);
    }
    fetch(COMMENTS_API + "/" + node.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: newLikes.join(",") }),
    }).then(function () {
      renderComments();
    });
  }

  function toggleReplyForm(parentId, parentUsername) {
    document.querySelectorAll(".reply-form").forEach(function (el) {
      el.classList.add("hidden");
      el.innerHTML = "";
    });
    var slot = document.querySelector('[data-reply-for="' + parentId + '"]');
    if (!slot) return;
    slot.classList.remove("hidden");
    slot.innerHTML =
      '<div class="flex gap-2 mt-2">' +
      '<div class="comment-avatar ' +
      getAvatarColor(currentUser.username) +
      ' text-white" style="width:28px;height:28px;font-size:0.75rem;">' +
      escapeHtml(currentUser.username.charAt(0).toUpperCase()) +
      "</div>" +
      '<div class="flex-1">' +
      '<textarea class="reply-input w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 resize-none" rows="2" placeholder="Tr\u1EA3 l\u1EDDi ' +
      escapeHtml(parentUsername) +
      '..."></textarea>' +
      '<div class="flex justify-end gap-2 mt-1">' +
      '<button class="reply-cancel text-xs text-gray-400 hover:text-white px-3 py-1 rounded">H\u1EE7y</button>' +
      '<button class="reply-send bg-yellow-500 hover:bg-yellow-400 text-gray-900 text-xs font-semibold px-4 py-1 rounded-lg transition-colors">G\u1EEDi</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    slot.querySelector(".reply-cancel").addEventListener("click", function () {
      slot.classList.add("hidden");
      slot.innerHTML = "";
    });
    slot.querySelector(".reply-send").addEventListener("click", function () {
      var input = slot.querySelector(".reply-input");
      var text = input.value.trim();
      if (!text) return;
      submitComment(text, parentId);
    });
    slot.querySelector(".reply-input").focus();
  }

  function handleDelete(node) {
    if (
      !confirm(
        "X\u00F3a b\u00ECnh lu\u1EADn n\u00E0y" +
          (node.children.length > 0
            ? " v\u00E0 t\u1EA5t c\u1EA3 c\u00E2u tr\u1EA3 l\u1EDDi?"
            : "?"),
      )
    )
      return;

    fetchComments()
      .then(function (allComments) {
        var idsToDelete = getCascadeDeleteIds(node.id, allComments);
        return idsToDelete.reduce(function (chain, id) {
          return chain.then(function () {
            return deleteCommentAPI(id);
          });
        }, Promise.resolve());
      })
      .then(function () {
        renderComments();
      })
      .catch(function (err) {
        console.error("Delete comment failed:", err);
        alert("Khong the xoa binh luan luc nay. Vui long thu lai.");
      });
  }

  function submitComment(text, parentId) {
    if (!currentUser || !text) return;
    postComment({
      username: currentUser.username,
      content: text,
      parentId: parentId || "",
      likes: "",
      isAdmin: currentUser.isAdmin || false,
      createdAt: new Date().toISOString(),
    }).then(function () {
      renderComments();
    });
  }

  if (commentSubmit) {
    commentSubmit.addEventListener("click", function () {
      var text = commentInput.value.trim();
      if (!text) return;
      commentInput.value = "";
      submitComment(text, "");
    });
  }

  if (commentInput) {
    commentInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        commentSubmit.click();
      }
    });
  }

  renderComments();
})();

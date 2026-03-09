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

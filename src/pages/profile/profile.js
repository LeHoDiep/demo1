const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "index.html";
} else {
  document.getElementById("username-display").textContent = user.username;
  document.getElementById("profile-username").textContent = user.username;
  document.getElementById("user-menu-button").addEventListener("click", () => {
    const menu = document.getElementById("user-menu");
    menu.classList.toggle("hidden");
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
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

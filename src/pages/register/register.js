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

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate password
  const passwordRegex =
    /^(?!.*[/\'"*])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    const errorDiv = document.getElementById("password-validate-error");
    errorDiv.textContent =
      "Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất 1 số và 1 ký tự đặc biệt, không chứa / ' \" *";
    errorDiv.style.display = "block";
    return;
  } else {
    document.getElementById("password-validate-error").style.display = "none";
  }

  // Check if username exists
  try {
    const response = await fetch(
      "https://69abf1aa9ca639a5217dcdec.mockapi.io/users",
    );
    const users = await response.json();
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      const errorDiv = document.getElementById("username-error");
      errorDiv.textContent = "Username đã tồn tại!";
      errorDiv.style.display = "block";
      return;
    } else {
      document.getElementById("username-error").style.display = "none";
    }
  } catch (error) {
    alert("Lỗi kiểm tra username!");
    return;
  }

  if (password !== confirmPassword) {
    const errorDiv = document.getElementById("password-error");
    errorDiv.textContent = "Mật khẩu xác nhận không khớp!";
    errorDiv.style.display = "block";
    return;
  } else {
    document.getElementById("password-error").style.display = "none";
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    const response = await fetch(
      "https://69abf1aa9ca639a5217dcdec.mockapi.io/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      },
    );
    if (response.ok) {
      const modal = document.getElementById("success-modal");
      modal.classList.remove("hidden");
      localStorage.setItem("user", JSON.stringify({ username: username }));
      setTimeout(() => {
        modal.classList.add("hidden");
        window.location.href = "index.html";
      }, 2000);
    } else {
      alert("Đăng ký thất bại!");
    }
  } catch (error) {
    alert("Lỗi kết nối!");
  }
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

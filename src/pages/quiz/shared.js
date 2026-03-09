// Shared utilities for leaderboard — used by both index.js and quiz.js
const SCORES_API = "https://69abf1aa9ca639a5217dcdec.mockapi.io/recordGame";

// Sort: correctAnswers DESC, then timeTaken ASC (tiebreaker)
function sortLeaderboard(data) {
  return [...data].sort((a, b) => {
    const ca = Number(a.correctAnswers ?? a.score ?? 0);
    const cb = Number(b.correctAnswers ?? b.score ?? 0);
    if (cb !== ca) return cb - ca;
    const ta = Number(a.timeTaken ?? 99999);
    const tb = Number(b.timeTaken ?? 99999);
    return ta - tb;
  });
}

function formatTime(seconds) {
  if (seconds == null) return "-";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// Generic leaderboard renderer
// Options: { bodyId, loadingId, listId, emptyId (optional) }
function renderLeaderboard({ bodyId, loadingId, listId, emptyId }) {
  const loadingEl = document.getElementById(loadingId);
  const listEl = document.getElementById(listId);
  const bodyEl = document.getElementById(bodyId);
  const emptyEl = emptyId ? document.getElementById(emptyId) : null;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  fetch(SCORES_API)
    .then((r) => r.json())
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        if (loadingEl) loadingEl.classList.add("hidden");
        if (emptyEl) emptyEl.classList.remove("hidden");
        return;
      }

      const sorted = sortLeaderboard(data);
      bodyEl.innerHTML = "";
      sorted.forEach((entry, index) => {
        const tr = document.createElement("tr");
        const isCurrentUser =
          currentUser && entry.username === currentUser.username;
        tr.className = isCurrentUser
          ? "bg-yellow-100 font-bold border-b"
          : index % 2 === 0
            ? "bg-white border-b"
            : "bg-gray-50 border-b";

        const rank = index + 1;
        const medal =
          rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
        const correctVal = entry.correctAnswers ?? entry.score ?? "-";
        const timeVal = formatTime(entry.timeTaken);

        tr.innerHTML = `
          <td class="p-2 border font-semibold">${medal}</td>
          <td class="p-2 border">${entry.username}${isCurrentUser ? " (Bạn)" : ""}</td>
          <td class="p-2 border text-center font-semibold">${correctVal}/25</td>
          <td class="p-2 border text-center">${timeVal}</td>
          <td class="p-2 border text-gray-500">${entry.date || ""}</td>
        `;
        bodyEl.appendChild(tr);
      });

      if (loadingEl) loadingEl.classList.add("hidden");
      if (listEl) listEl.classList.remove("hidden");
    })
    .catch((err) => {
      console.error("Lỗi khi tải bảng xếp hạng:", err);
      if (loadingEl) loadingEl.textContent = "Không thể tải bảng xếp hạng.";
    });
}

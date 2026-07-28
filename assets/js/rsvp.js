(() => {
  const PER_PAGE = 4;

  function statusLabel(status) {
    return status === "attending" ? "Attending" : "Not Attending";
  }

  function renderWish(item) {
    const card = document.createElement("article");
    card.className = "wish-card";
    card.innerHTML = `
      <div class="name">${escapeHtml(item.name)}
        <span class="status ${item.status === "not_attending" ? "not_attending" : ""}">${statusLabel(item.status)}</span>
      </div>
      <p class="msg">${escapeHtml(item.message || "")}</p>
    `;
    return card;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function loadWishes() {
    const res = await fetch("assets/js/wishes-data.json");
    const data = await res.json();
    const stored = JSON.parse(localStorage.getItem("claire_wishes") || "[]");
    return [...stored, ...data];
  }

  function paginate(items, page) {
    const start = (page - 1) * PER_PAGE;
    return items.slice(start, start + PER_PAGE);
  }

  function renderPager(total, page, onPage) {
    const pages = Math.max(1, Math.ceil(total / PER_PAGE));
    const pager = document.getElementById("wishes-pager");
    if (!pager) return;
    pager.innerHTML = "";
    for (let i = 1; i <= pages; i += 1) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `Page ${i}`;
      if (i === page) btn.classList.add("is-current");
      btn.addEventListener("click", () => onPage(i));
      pager.appendChild(btn);
    }
    if (page < pages) {
      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "Next »";
      next.addEventListener("click", () => onPage(page + 1));
      pager.appendChild(next);
    }
  }

  function renderFeed(items, page) {
    const list = document.getElementById("wishes-list");
    if (!list) return;
    list.innerHTML = "";
    paginate(items, page).forEach((item) => list.appendChild(renderWish(item)));
    renderPager(items.length, page, (p) => renderFeed(items, p));
  }

  function updateCharCount(input, counterSel, max) {
    const counter = document.querySelector(counterSel);
    if (!counter) return;
    const update = () => {
      counter.textContent = `(${input.value.length}/${max})`;
    };
    input.addEventListener("input", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("rsvp-form");
    const attendance = document.getElementById("attendance_status");
    const eventsWrap = document.getElementById("rsvp-event-selection-wrapper");
    const guestWrap = document.getElementById("rsvp-guest-count-wrapper");
    const message = document.getElementById("message");
    const guestName = document.getElementById("guest_name");

    if (guestName) updateCharCount(guestName, ".rsvpkit-name-count", 100);
    if (message) updateCharCount(message, ".rsvpkit-msg-count", 500);

    document.querySelectorAll(".event-card").forEach((card) => {
      const input = card.querySelector('input[type="checkbox"]');
      card.addEventListener("click", () => {
        input.checked = !input.checked;
        card.classList.toggle("is-checked", input.checked);
      });
    });

    attendance?.addEventListener("change", () => {
      const attending = attendance.value === "attending";
      eventsWrap?.classList.toggle("show", attending);
      guestWrap?.classList.toggle("show", attending);
    });

    let wishes = [];
    try {
      wishes = await loadWishes();
    } catch {
      wishes = [];
    }
    renderFeed(wishes, 1);

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const msgEl = document.getElementById("rsvp-form-message");
      const name = guestName?.value?.trim();
      const status = attendance?.value;
      const wish = message?.value?.trim() || "";

      if (!name || !status) {
        if (msgEl) {
          msgEl.textContent = "Please complete all required fields.";
          msgEl.className = "rsvp-message is-error";
        }
        return;
      }
      if (status === "attending") {
        const checked = [...document.querySelectorAll('input[name="events[]"]:checked')];
        if (!checked.length) {
          if (msgEl) {
            msgEl.textContent = "Please select at least one event.";
            msgEl.className = "rsvp-message is-error";
          }
          return;
        }
      }

      const entry = { name, status, message: wish || "—" };
      const stored = JSON.parse(localStorage.getItem("claire_wishes") || "[]");
      stored.unshift(entry);
      localStorage.setItem("claire_wishes", JSON.stringify(stored));
      wishes = [entry, ...wishes];
      renderFeed(wishes, 1);

      if (msgEl) {
        msgEl.textContent = "Thank you! Your RSVP has been received.";
        msgEl.className = "rsvp-message is-success";
      }
      if (message) message.value = "";
      attendance.value = "";
      eventsWrap?.classList.remove("show");
      guestWrap?.classList.remove("show");
      document.querySelectorAll(".event-card").forEach((card) => {
        card.classList.remove("is-checked");
        const input = card.querySelector("input");
        if (input) input.checked = false;
      });
    });
  });
})();

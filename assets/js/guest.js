(() => {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("to");
  const guestName = raw ? decodeURIComponent(raw.replace(/\+/g, " ")).trim() : "Guest";
  const maxGuests = parseInt(params.get("max"), 10);

  function applyGuestName(name) {
    document.querySelectorAll(".bp-dynamic-guest-name").forEach((el) => {
      el.textContent = name;
      el.dataset.fallback = name;
    });
    const input = document.querySelector('input[name="guest_name"]');
    if (input) {
      input.value = name;
      const counter = document.querySelector(".rsvpkit-name-count");
      if (counter) counter.textContent = `(${name.length}/100)`;
    }
  }

  function applyMaxGuests(max) {
    const select = document.querySelector('select[name="guest_count"]');
    if (!select || Number.isNaN(max) || max < 1) return;
    select.innerHTML = "";
    for (let i = 1; i <= max; i += 1) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = String(i);
      select.appendChild(opt);
    }
    select.value = "1";
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyGuestName(guestName || "Guest");
    if (!Number.isNaN(maxGuests) && maxGuests >= 1) applyMaxGuests(maxGuests);
  });

  window.ClaireGuest = { guestName, maxGuests };
})();

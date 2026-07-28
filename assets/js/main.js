(() => {
  /** Configurable wedding countdown target (local). */
  const COUNTDOWN_TARGET = new Date("2026-08-21T08:00:00+07:00");

  const cover = document.getElementById("section-cover");
  const openBtn = document.getElementById("btn-lets-open");
  const audio = document.getElementById("song");
  const audioBtn = document.getElementById("audio-toggle");
  const audioWrap = document.querySelector(".audio-control");
  const menuBtn = document.getElementById("btn-menu");
  const navPopup = document.getElementById("popup-nav");
  const bankPopup = document.getElementById("popup-bank");
  const openGiftBtn = document.getElementById("btn-open-gift");

  function openInvite() {
    if (!cover) return;
    cover.classList.add("hidden", "blur-out");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-open", "hero-on-dark");
    if (audio) {
      audio.play().catch(() => {
        audioWrap?.classList.add("is-paused");
      });
    }
  }

  function toggleAudio() {
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      audioWrap?.classList.remove("is-paused");
    } else {
      audio.pause();
      audioWrap?.classList.add("is-paused");
    }
  }

  function openPopup(el) {
    el?.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closePopup(el) {
    el?.classList.remove("is-open");
    if (![navPopup, bankPopup].some((p) => p?.classList.contains("is-open"))) {
      document.body.style.overflow = "";
    }
  }

  function tickCountdown() {
    const root = document.querySelector("[data-countdown]");
    if (!root) return;
    const now = Date.now();
    let diff = Math.max(0, COUNTDOWN_TARGET.getTime() - now);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    const map = { days, hours, mins, secs };
    root.querySelectorAll("[data-cd]").forEach((el) => {
      const key = el.getAttribute("data-cd");
      el.textContent = String(map[key] ?? 0).padStart(2, "0");
    });
  }

  function initReveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  function initHeroTheme() {
    const hero = document.querySelector(".overlay-sec");
    if (!hero) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        document.body.classList.toggle("hero-on-dark", entry.isIntersecting && entry.intersectionRatio > 0.35);
      },
      { threshold: [0.2, 0.35, 0.5] }
    );
    io.observe(hero);
  }

  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const value = btn.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(value);
          btn.classList.add("is-copied");
          setTimeout(() => btn.classList.remove("is-copied"), 1200);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = value;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          btn.classList.add("is-copied");
          setTimeout(() => btn.classList.remove("is-copied"), 1200);
        }
      });
    });
  }

  function initGiftForm() {
    const form = document.getElementById("gift-confirm-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = form.querySelector(".form-msg");
      if (msg) {
        msg.textContent = "Thank you! Your confirmation has been recorded (demo).";
        msg.classList.add("is-show");
      }
      form.reset();
    });
  }

  function initVideoPlay() {
    const section = document.querySelector(".video-play");
    const btn = document.getElementById("btn-play-video");
    const video = section?.querySelector("video");
    if (!section || !btn || !video) return;
    btn.addEventListener("click", () => {
      section.classList.add("is-playing");
      video.play();
      if (audio && !audio.paused) {
        audio.pause();
        audioWrap?.classList.add("is-paused");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("is-locked");
    openBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      openInvite();
    });
    audioBtn?.addEventListener("click", toggleAudio);
    menuBtn?.addEventListener("click", () => openPopup(navPopup));
    openGiftBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      openPopup(bankPopup);
    });

    document.querySelectorAll("[data-close-popup]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closePopup(btn.closest(".popup-backdrop"));
      });
    });
    document.querySelectorAll(".popup-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closePopup(backdrop);
      });
    });
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", () => closePopup(navPopup));
    });

    tickCountdown();
    setInterval(tickCountdown, 1000);
    initReveal();
    initHeroTheme();
    initCopyButtons();
    initGiftForm();
    initVideoPlay();
  });
})();

(() => {
  const images = [
    "assets/img/gallery-00203.jpg",
    "assets/img/gallery-00155.jpg",
    "assets/img/gallery-00208.jpg",
    "assets/img/gallery-00207.jpg",
    "assets/img/gallery-00198.jpg",
    "assets/img/gallery-00192.jpg",
    "assets/img/gallery-00169.jpg",
    "assets/img/gallery-00168.jpg",
    "assets/img/gallery-00179.jpg",
    "assets/img/story-00195.jpg",
    "assets/img/gallery-4975645b.jpg",
    "assets/img/gallery-4975645a.jpg",
    "assets/img/story-00145.jpg",
    "assets/img/gallery-49756523.jpg",
    "assets/img/gallery-00182.jpg",
    "assets/img/gallery-00153.jpg"
  ];

  let index = 0;

  function buildMasonry() {
    const root = document.getElementById("gallery-masonry");
    if (!root) return;
    root.innerHTML = "";
    images.forEach((src, i) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "gallery-item";
      item.setAttribute("aria-label", `Open gallery image ${i + 1}`);
      item.innerHTML = `<img src="${src}" alt="Pre-wedding ${i + 1}" loading="lazy" />`;
      item.addEventListener("click", () => openLightbox(i));
      root.appendChild(item);
    });
  }

  function openLightbox(i) {
    index = i;
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    if (!lb || !img) return;
    img.src = images[index];
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    lb?.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function step(delta) {
    index = (index + delta + images.length) % images.length;
    const img = document.getElementById("lightbox-img");
    if (img) img.src = images[index];
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildMasonry();
    document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev")?.addEventListener("click", () => step(-1));
    document.getElementById("lightbox-next")?.addEventListener("click", () => step(1));
    document.getElementById("lightbox")?.addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      const lb = document.getElementById("lightbox");
      if (!lb?.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  });
})();

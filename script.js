document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle"),
    nav = document.querySelector(".nav");
  if (toggle && nav)
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "×" : "☰";
    });
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
  document.body.classList.add("reveal-ready");
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.innerHTML = "<span></span>";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);
  const bar = progress.querySelector("span");
  const targets = document.querySelectorAll(
    "main section:not(.hero):not(.page-hero),.category-card,.product-card,.value-grid article,.promise-items article,.faq-list details,.contact-form,.story-visual",
  );
  targets.forEach((el, i) => {
    el.classList.add("reveal");
    if (i % 4 === 1) el.style.transitionDelay = ".1s";
    if (i % 4 === 2) el.style.transitionDelay = ".2s";
  });
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, o) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            o.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -25px 0px" },
    );
    targets.forEach((el) => obs.observe(el));
  } else targets.forEach((el) => el.classList.add("is-visible"));
  const top = document.createElement("button");
  top.className = "back-to-top";
  top.type = "button";
  top.setAttribute("aria-label", "Back to top");
  top.textContent = "↑";
  document.body.appendChild(top);
  top.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  let pending = false;
  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    top.classList.toggle("visible", scrollY > 500);
    pending = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!pending) {
        requestAnimationFrame(update);
        pending = true;
      }
    },
    { passive: true },
  );
  update();
  const form = document.getElementById("contactForm");
  if (form) {
    const params = new URLSearchParams(location.search);
    const product = params.get("product");
    if (product) {
      const msg = form.querySelector('[name="message"]');
      if (msg)
        msg.value = "I am interested in: " + product.replaceAll("-", " ") + ".";
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = encodeURIComponent(
        "Product enquiry — " + d.get("interest"),
      );
      const body = encodeURIComponent(
        "Name: " +
          d.get("name") +
          "\nBusiness: " +
          (d.get("business") || "Not provided") +
          "\nEmail: " +
          d.get("email") +
          "\nPhone: " +
          (d.get("phone") || "Not provided") +
          "\nInterest: " +
          d.get("interest") +
          "\n\nMessage:\n" +
          d.get("message"),
      );
      const status = form.querySelector(".form-status");
      status.textContent = "Opening your email app with your enquiry draft.";
      location.href =
        "mailto:dryvineglobal@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
});

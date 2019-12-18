const slideMenu = ({ currentTarget: chamburgerBtn }, menu) => {
  chamburgerBtn.classList.toggle("hidden");
  menu.classList.toggle("hidden");

  const bodyScrollY = document.body.style.overflowY;
  setTimeout(() => {
    document.body.style.overflowY =
      bodyScrollY === "hidden" ? "auto" : "hidden";
  }, 1400);
};

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".nav-wrapper");
  const hamburgerBtn = document.querySelector(".nav-hamburger-btn");

  hamburgerBtn.addEventListener("click", e => slideMenu(e, menu));
});

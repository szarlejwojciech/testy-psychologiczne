document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = localStorage.getItem("current-theme") || "light";
  const themeToggler = document.querySelector(".theme-btn");
  themeToggler.addEventListener("click", () => themeToggle(currentTheme));

  if (currentTheme === "dark") document.body.classList.add("dark-theme");
  else document.body.classList.remove("dark-theme");
});

const currentYear = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  const currentYearSpan = document.querySelector("#current-year");
  currentYearSpan.textContent = currentYear;
});

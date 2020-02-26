const defaultAnswers = groupAssignment(prokosDefault);
const answers = JSON.parse(localStorage.getItem(localStorageNames.prokos)) || defaultAnswers;

const renderResultBox = (container, groupName, raw, stens) => {
  let polishGroupName = "";

  switch (groupName) {
    case "group-a":
      polishGroupName = "Kompetencje asertywne";
      break;
    case "group-k":
      polishGroupName = "Kompetencje kooperacyjne";
      break;
    case "group-t":
      polishGroupName = "Kompetencje towarzyskie";
      break;
    case "group-z":
      polishGroupName = "Zazdrość społeczna";
      break;
    case "group-s":
      polishGroupName = "Kompetencje społecznikowskie";
      break;
    case "total":
      polishGroupName = "Wynik ogólny";
      break;

    default:
      polishGroupName = "";
      break;
  }
  container.innerHTML += `<div class="box">
          <div class="wrapper">
            <h3>${polishGroupName}</h3>
          </div>
          <div class="wrapper">
            <span>wynik surowy</span>
            <span>steny</span>
          </div>
          <div class="wrapper">
            <span>${raw}</span>
            <span>${stens}</span>
          </div>
        </div>`;
};

const displayResult = async answers => {
  const STENS_URL = "./scripts/stens.json";
  const resultBox = document.querySelector(".result-box");
  const gender = document.querySelector(".gender-group input:checked").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const boxesContainer = resultBox.querySelector(".boxes");
  const groupNamesList = ["group-a", "group-k", "group-t", "group-z", "group-s", "total"];

  boxesContainer.innerHTML = "";
  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  displayGenderSpan.textContent = gender === "male" ? '"męszczyzn"' : '"kobiet"';

  const overallResult = answers.filter(el => el.type).reduce((a, b) => a + b.answer, 0);

  try {
    const response = await fetch(STENS_URL);
    const data = await response.json();

    groupNamesList.map(groupName => {
      const group = answers.filter(answ => answ.type === groupName);
      const groupTotal = group.reduce((total, answ) => total + answ.answer, 0);
      const pointRange = data[gender][groupName];

      const [sten] = pointRange
        .filter(({ min, max, sten }) => {
          if (groupName === "total") return overallResult >= min && overallResult <= max;
          else return groupTotal >= min && groupTotal <= max;
        })
        .map(item => item.sten);
      renderResultBox(boxesContainer, groupName, groupName === "total" ? overallResult : groupTotal, sten);
    });
  } catch (err) {
    displayError(err, resultBox);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  //containers
  const answersDiv = document.querySelector(".answers");
  const resultBox = document.querySelector(".result-box");
  //btns
  const resetBtn = document.getElementById("reset");
  const resultBtn = document.getElementById("result");

  //theme
  const currentTheme = localStorage.getItem("current-theme") || "light";
  const themeToggler = document.querySelector(".theme-btn");

  renderAnswers(prokosDefault.testName, answers, answersDiv);

  answersDiv.addEventListener("click", e => changeAnswer(e, answers, localStorageNames.prokos));
  resultBtn.addEventListener("click", () => displayResult(answers));
  resultBox.addEventListener("click", e => closeResultBox(e, resultBox, document.body));
  resetBtn.addEventListener("click", () => resetAnswers(answers, localStorageNames.prokos, prokosDefault.testName, renderAnswers, answersDiv));
  themeToggler.addEventListener("click", () => themeToggle(currentTheme));

  if (currentTheme === "dark") document.body.classList.add("dark-theme");
  else document.body.classList.remove("dark-theme");
});

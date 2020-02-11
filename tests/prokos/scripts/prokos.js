const defaultAnswers = groupAssignment(prokosDefault);

const answers = JSON.parse(localStorage.getItem(localStorageNames.prokos)) || defaultAnswers;

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

const displayResult = answers => {
  const STENS_URL = "./scripts/stens.json";
  const gender = document.querySelector(".gender input:checked").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const groupNamesList = ["group-a", "group-k", "group-t", "group-z", "group-s", "total"];

  let overallResult = 0;

  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  displayGenderSpan.textContent = gender === "male" ? '"męszczyzn"' : '"kobiet"';

  //async map metod of all groups
  groupNamesList.map(async groupName => {
    const group = answers.filter(answ => answ.type === groupName);
    const groupTotal = group.reduce((total, answ) => total + answ.answer, 0);
    // get spans and display results
    const groupSpanRaw = document.querySelector(`.${groupName}-raw`);
    const groupSpanStens = document.querySelector(`.${groupName}-stens`);
    // get overall result
    overallResult += groupTotal;
    //fetch data
    try {
      const response = await fetch(STENS_URL);
      const data = await response.json();
      // get range
      const pointRange = data[gender][groupName];
      // destructure sten result of range
      const [sten] = pointRange
        .filter(({ min, max, sten }) => {
          if (groupName === "total") return overallResult >= min && overallResult <= max;
          else return groupTotal >= min && groupTotal <= max;
        })
        .map(item => item.sten);
      //display sten in span
      groupSpanStens.textContent = sten;
    } catch (err) {
      console.error(`Brak danych. Błąd: ${err}`);
    }
    //display in spans groups & overall result
    groupSpanRaw.textContent = groupName === "total" ? overallResult : groupTotal;
  });
};

answersDiv.addEventListener("click", e => changeAnswer(e, answers, localStorageNames.prokos));
resultBtn.addEventListener("click", () => displayResult(answers));
resetBtn.addEventListener("click", () => resetAnswers(answers, localStorageNames.prokos, prokosDefault.testName, renderAnswers, answersDiv));

resultBox.addEventListener("click", e => closeResultBox(e, resultBox, document.body));

themeToggler.addEventListener("click", () => themeToggle(currentTheme));
document.addEventListener("DOMContentLoaded", () => {
  if (currentTheme === "dark") document.body.classList.add("dark-theme");
  else document.body.classList.remove("dark-theme");
});

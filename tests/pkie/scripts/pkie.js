const defaultAnswers = groupAssignment(pkieDefault);
const answers = JSON.parse(localStorage.getItem(localStorageNames.pkie)) || defaultAnswers;

const renderResultBox = (container, groupName, raw, stens) => {
  let polishGroupName = "";

  switch (groupName) {
    case "group-akc":
      polishGroupName = "Akceptowanie";
      break;
    case "group-emp":
      polishGroupName = "Empatia";
      break;
    case "group-kon":
      polishGroupName = "Koncentracja";
      break;
    case "group-roz":
      polishGroupName = "Rozumienie";
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
  const ageGroup = document.querySelector(".age-group input:checked").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const displayAgeGroupSpan = resultBox.querySelector(".display-group");
  const boxesContainer = resultBox.querySelector(".boxes");
  const groupNamesList = ["group-akc", "group-emp", "group-kon", "group-roz", "total"];

  boxesContainer.innerHTML = "";
  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  displayGenderSpan.textContent = gender === "male" ? '"męszczyzn"' : '"kobiet"';

  if (ageGroup === "pupils") displayAgeGroupSpan.textContent = '"uczniowie"';
  else if (ageGroup === "adults") displayAgeGroupSpan.textContent = '"dorośli"';

  // get overall result
  const overallResult = answers.reduce((total, answ) => {
    if (!answ.answer) return total + 0;
    else return total + (answ.reverseScoring ? 6 - answ.answer : answ.answer);
  }, 0);

  //fetch data
  try {
    const response = await fetch(STENS_URL);
    const data = await response.json();
    //map over the groups
    groupNamesList.map(groupName => {
      const group = answers.filter(answ => answ.type === groupName);
      // get group everall resulr
      const groupTotal = group.reduce((total, answ) => {
        if (!answ.answer) return total + 0;
        else return total + (answ.reverseScoring ? 6 - answ.answer : answ.answer);
      }, 0);
      // get range
      const pointRange = data[ageGroup][gender][groupName];
      if (!pointRange) return;

      // destructure sten result of range
      const [sten] = pointRange
        .filter(({ min, max }) => {
          if (groupName === "total") return overallResult >= min && overallResult <= max;
          else return groupTotal >= min && groupTotal <= max;
        })
        .map(item => item.sten);

      //render results of group
      renderResultBox(boxesContainer, groupName, groupName === "total" ? overallResult : groupTotal, sten);
    });
  } catch (err) {
    displayError(err, resultBox);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  onDOMLoad();

  const answersDiv = document.querySelector(".answers");
  const resetBtn = document.getElementById("reset");
  const resultBtn = document.getElementById("result");

  renderAnswers(pkieDefault.testName, answers, answersDiv);

  answersDiv.addEventListener("click", e => changeAnswer(e, answers, localStorageNames.pkie));

  resultBtn.addEventListener("click", () => displayResult(answers));
  resetBtn.addEventListener("click", () => resetAnswers(answers, localStorageNames.pkie, pkieDefault.testName, renderAnswers, answersDiv));
});

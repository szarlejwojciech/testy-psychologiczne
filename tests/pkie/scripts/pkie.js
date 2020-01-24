const defaultAnswers = groupAssignment;

const answers = JSON.parse(localStorage.getItem("answersPKIE")) || defaultAnswers();

//containers
const answersDiv = document.querySelector(".answers");
const resultBox = document.querySelector(".result-box");
//btns
const resetBtn = document.getElementById("reset");
const resultBtn = document.getElementById("result");

//render results boxes
const render = array => {
  answersDiv.innerHTML = array
    .map(
      ({ id, type, answer }) =>
        `<div class="answer-box" id="box${id}" data-type="${type}">
          <ul>
            <li>${id}</li>
            <li>
              <input id="answer-${id}-1" data-key="${id}" type="radio" name="answer-${id}" ${answer === 1 ? "checked" : ""} value="1">
              <label for="answer-${id}-1">1</label>
            </li>
            <li>
              <input id="answer-${id}-2" data-key="${id}" type="radio" name="answer-${id}" ${answer === 2 ? "checked" : ""} value="2">
              <label for="answer-${id}-2">2</label>
            </li>
            <li>
              <input id="answer-${id}-3" data-key="${id}" type="radio" name="answer-${id}" ${answer === 3 ? "checked" : ""} value="3">
              <label for="answer-${id}-3">3</label>
            </li>
            <li>
              <input id="answer-${id}-4" data-key="${id}" type="radio" name="answer-${id}" ${answer === 4 ? "checked" : ""} value="4">
              <label for="answer-${id}-4">4</label>
            </li>
            <li>
              <input id="answer-${id}-5" data-key="${id}" type="radio" name="answer-${id}" ${answer === 5 ? "checked" : ""} value="5">
              <label for="answer-${id}-5">5</label>
            </li>
          </ul>
        </div>`
    )
    .join("");
};
render(answers);

const resetAnswers = answers => {
  answers.forEach(el => (el.answer = null));

  localStorage.setItem("answersPKIE", JSON.stringify(answers));
  render(answers);
};

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
  const gender = document.querySelector(".gender input:checked").value;
  const ageGroup = document.querySelector("#people-group").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const displayAgeGroupSpan = resultBox.querySelector(".display-group");
  let boxesContainer = resultBox.querySelector(".boxes");
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
      if (!pointRange) return console.log("nie ma: " + groupName); // delete clg
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
    console.error(`Brak danych. Błąd: ${err}`);
  }
};

const closeResultBox = e => {
  if (e.target === resultBox || e.target.classList.contains("close-results")) {
    resultBox.classList.remove("visible");
    document.body.classList.remove("no-scroll");
  }
};

answersDiv.addEventListener("click", e => changeAnswer(e, answers, "answersPKIE"));
// answersDiv.addEventListener("touchstart", e => changeAnswer(e, answers));

resultBtn.addEventListener("click", () => displayResult(answers));
resetBtn.addEventListener("click", () => resetAnswers(answers));

resultBox.addEventListener("click", closeResultBox);
// resultBox.addEventListener("touchstart", closeResultBox);

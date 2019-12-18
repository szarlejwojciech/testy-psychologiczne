const defaultAnswers = () => {
  const array = [];

  for (let i = 1; i <= 90; i++) {
    const id = i;
    let type = "";
    let className = "";

    switch (id) {
      case 6:
      case 11:
      case 14:
      case 15:
      case 18:
      case 24:
      case 29:
      case 34:
      case 35:
      case 52:
      case 63:
      case 68:
      case 81:
      case 82:
        type = "group-a";
        break;
      case 4:
      case 7:
      case 17:
      case 21:
      case 26:
      case 45:
      case 47:
      case 19:
      case 59:
      case 60:
      case 69:
      case 72:
      case 77:
      case 80:
      case 85:
      case 87:
        type = "group-k";
        break;
      case 1:
      case 2:
      case 5:
      case 12:
      case 32:
      case 40:
      case 58:
      case 62:
      case 65:
      case 86:
      case 89:
        type = "group-t";
        break;
      case 27:
      case 37:
      case 42:
      case 44:
      case 53:
      case 55:
      case 56:
      case 64:
      case 70:
      case 74:
      case 78:
      case 84:
      case 88:
        type = "group-z";
        break;
      case 13:
      case 39:
      case 48:
      case 51:
      case 73:
      case 90:
        type = "group-s";
        break;
      default:
        type = "";
        break;
    }
    const item = {
      id: id,
      type: type,
      answer: 0
    };
    array.push(item);
  }
  return array;
};

const answers =
  JSON.parse(localStorage.getItem("answersPROKOS")) || defaultAnswers();

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
              <input id="answer-${id}-1" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 1 ? "checked" : ""
        } value="1">
              <label for="answer-${id}-1">1</label>
            </li>
            <li>
              <input id="answer-${id}-2" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 2 ? "checked" : ""
        } value="2">
              <label for="answer-${id}-2">2</label>
            </li>
            <li>
              <input id="answer-${id}-3" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 3 ? "checked" : ""
        } value="3">
              <label for="answer-${id}-3">3</label>
            </li>
            <li>
              <input id="answer-${id}-4" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 4 ? "checked" : ""
        } value="4">
              <label for="answer-${id}-4">4</label>
            </li>
          </ul>
        </div>`
    )
    .join("");
};
render(answers);

const changeAnswer = (e, answers) => {
  if (e.target.type !== "radio") return;
  const index = e.target.dataset.key - 1;
  const input = document.querySelector(`#box${index + 1} input:checked`);
  answers[index].answer = Number.parseInt(input.value);

  localStorage.setItem("answersPROKOS", JSON.stringify(answers));
  render(answers);
  document.querySelector(`#box${index + 1} input:checked`).focus();
};

const resetAnswers = answers => {
  answers.forEach(el => (el.answer = null));

  localStorage.setItem("answersPROKOS", JSON.stringify(answers));
  render(answers);
};

const displayResult = answers => {
  const STENS_URL = "./scripts/stens.json";
  const gender = document.querySelector(".gender input:checked").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const groupNamesList = [
    "group-a",
    "group-k",
    "group-t",
    "group-z",
    "group-s",
    "total"
  ];

  let overallResult = 0;

  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  displayGenderSpan.textContent =
    gender === "male" ? '"męszczyzn"' : '"kobiet"';

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
          if (groupName === "total")
            return overallResult >= min && overallResult <= max;
          else return groupTotal >= min && groupTotal <= max;
        })
        .map(item => item.sten);
      //display sten in span
      groupSpanStens.textContent = sten;
    } catch (err) {
      console.error(`Brak danych. Błąd: ${err}`);
    }

    //display in spans groups & overall result
    groupSpanRaw.textContent =
      groupName === "total" ? overallResult : groupTotal;
  });
};

const closeResultBox = e => {
  if (e.target === resultBox || e.target.classList.contains("close-results")) {
    resultBox.classList.remove("visible");
    document.body.classList.remove("no-scroll");
  }
};

answersDiv.addEventListener("click", e => changeAnswer(e, answers));
resultBtn.addEventListener("click", () => displayResult(answers));
resetBtn.addEventListener("click", () => resetAnswers(answers));

resultBox.addEventListener("click", closeResultBox);
resultBox.addEventListener("touchstart", closeResultBox);

const defaultAnswers = () => {
  const array = [];

  for (let i = 1; i <= 28; i++) {
    const id = i;
    let type = "";
    let className = "";

    switch (id) {
      case 5:
      case 9:
      case 19:
      case 20:
        type = "linguistic";
        break;
      case 6:
      case 11:
      case 22:
      case 28:
        type = "math";
        break;
      case 2:
      case 12:
      case 18:
      case 24:
        type = "visual";
        break;
      case 4:
      case 10:
      case 17:
      case 27:
        type = "music";
        break;
      case 3:
      case 8:
      case 13:
      case 23:
        type = "interpersonal";
        break;
      case 7:
      case 15:
      case 16:
      case 26:
        type = "intrapersonal";
        break;
      case 1:
      case 14:
      case 21:
      case 25:
        type = "kinesthetic";
        break;
      default:
        type = "";
        break;
    }
    const item = {
      id: id,
      type: type,
      answer: null
    };
    array.push(item);
  }
  return array;
};

const answers =
  JSON.parse(localStorage.getItem("answersKWI")) || defaultAnswers();

//containers
const answersDiv = document.querySelector(".answers");
const resultBox = document.querySelector(".result-box");
//btns
const resetBtn = document.getElementById("reset");
const resultBtn = document.getElementById("result");

//results boxes

const render = array => {
  answersDiv.innerHTML = array
    .map(
      ({ id, type, answer }) =>
        `<div class="answer-box" id="box${id}" data-type="${type}">
          <ul>
            <li>${id}</li>
            <li>
              <input id="answer-${id}-0" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 0 ? "checked" : ""
        } value="0">
              <label for="answer-${id}-0">0</label>
            </li><li>
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
            <li>
              <input id="answer-${id}-5" data-key="${id}" type="radio" name="answer-${id}" ${
          answer === 5 ? "checked" : ""
        } value="5">
              <label for="answer-${id}-5">5</label>
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

  localStorage.setItem("answersKWI", JSON.stringify(answers));
  render(answers);
  document.querySelector(`#box${index + 1} input:checked`).focus();
};

const resetAnswers = answers => {
  answers.forEach(el => (el.answer = null));

  localStorage.setItem("answersKWI", JSON.stringify(answers));
  render(answers);
};

const getCords = (cont, box) => {
  const {
    x: contX,
    y: contY,
    width: contW,
    height: contH
  } = cont.getBoundingClientRect();
  const {
    x: boxX,
    y: boxY,
    width: boxW,
    height: boxH
  } = box.getBoundingClientRect();
  // console.log(`Container: ${contX}, ${contY}, width: ${contW}, Height:${contH}`);
  // console.log(`Box: ${boxX}, ${boxY}, width: ${boxW},Height: ${boxH}`);

  const xPercent = ((boxX - contX + boxW / 2) / contW) * 100; //20/200*100
  const yPercent = ((boxY - contY + boxH / 2) / contH) * 100;
  return {
    x: xPercent,
    y: yPercent
  };
};

const displayResult = answers => {
  const groupNamesList = [
    "linguistic",
    "math",
    "visual",
    "music",
    "interpersonal",
    "intrapersonal",
    "kinesthetic"
  ];

  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  const pointsContainer = document.querySelector(`.points`);
  const path = document.querySelector(".path");
  let chartPathCords = "";

  resultBox.addEventListener("transitionend", () => {
    groupNamesList.map(groupName => {
      const group = answers.filter(answ => answ.type === groupName);
      const groupTotal = group.reduce((total, answ) => total + answ.answer, 0);
      const maxPoints = 20;
      // get spans and display results
      const groupSpan = document.querySelector(`.${groupName}`);
      const groupSpanTotal = document.querySelector(`.${groupName}-total`);
      const chartPointsBox = document.querySelector(`.${groupName}-point-box`);

      groupSpanTotal.textContent = groupTotal;
      chartPointsBox.textContent = groupTotal;
      chartPointsBox.style.right = `${(groupTotal / maxPoints) * 100}%`;

      //***************** display result for every answer
      groupSpan.innerHTML = group
        .map(
          ({ id, answer }) =>
            `${id} <span class="answer-number">(${
              answer === null ? 0 : answer
            })</span>`
        )
        .join(", ");
      //**************

      const { x, y } = getCords(pointsContainer, chartPointsBox);
      chartPathCords += `${x.toFixed()}% ${y.toFixed()}%,`;
    });
    path.style.clipPath = `polygon(${chartPathCords.slice(0, -1)})`;
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

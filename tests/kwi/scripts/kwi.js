const defaultAnswers = groupAssignment(kwiDefault); //"imported" from helpers.js

const answers = JSON.parse(localStorage.getItem(localStorageNames.kwi)) || defaultAnswers;

//containers
const answersDiv = document.querySelector(".answers");
const resultBox = document.querySelector(".result-box");
//btns
const resetBtn = document.getElementById("reset");
const resultBtn = document.getElementById("result");

renderAnswers(kwiDefault.testName, answers, answersDiv);

const getPercentCords = (container, box) => {
  const { x: containerX, y: containerY, width: containerW, height: containerH } = container.getBoundingClientRect();
  const { x: boxX, y: boxY, width: boxW, height: boxH } = box.getBoundingClientRect();
  // console.log(`Container: ${contX}, ${contY}, width: ${contW}, Height:${contH}`);
  // console.log(`Box: ${boxX}, ${boxY}, width: ${boxW},Height: ${boxH}`);

  const xPercent = ((boxX - containerX + boxW / 2) / containerW) * 100;
  const yPercent = ((boxY - containerY + boxH / 2) / containerH) * 100;
  return {
    x: xPercent,
    y: yPercent
  };
};

const displayResult = answers => {
  const groupNamesList = ["linguistic", "math", "visual", "music", "interpersonal", "intrapersonal", "kinesthetic"];

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
      groupSpan.innerHTML = group.map(({ id, answer }) => `${id} <span class="answer-number">(${answer === null ? 0 : answer})</span>`).join(", ");
      //**************

      const { x, y } = getPercentCords(pointsContainer, chartPointsBox);
      chartPathCords += `${x.toFixed()}% ${y.toFixed()}%,`;
    });
    path.style.clipPath = `polygon(${chartPathCords.slice(0, -1)})`;
  });
};

answersDiv.addEventListener("click", e => changeAnswer(e, answers, localStorageNames.kwi));
resultBtn.addEventListener("click", () => displayResult(answers));
resetBtn.addEventListener("click", () => resetAnswers(answers, localStorageNames.kwi, kwiDefault.testName, renderAnswers, answersDiv));
resultBox.addEventListener("click", e => closeResultBox(e, resultBox, document.body));

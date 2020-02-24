const defaultAnswers = groupAssignment(epqrDefault);

const answers = JSON.parse(localStorage.getItem(localStorageNames.epqr)) || defaultAnswers;

//preveiw boxes
const answersDiv = document.querySelector(".answers"),
  previewContainer = document.querySelector(".preview");

//btns
const resetBtn = document.getElementById("reset"),
  resultBtn = document.getElementById("result");

//results boxes
const resultBox = document.querySelector(".result-box"),
  titleGender = resultBox.querySelector("span.gender"),
  titleGroup = resultBox.querySelector("span.group");

//theme
const currentTheme = localStorage.getItem("current-theme") || "light";
const themeToggler = document.querySelector(".theme-btn");
themeToggler.addEventListener("click", () => themeToggle(currentTheme));

const calculateAnswers = array => {
  return [
    {
      items: array.filter(item => item.type === "psyhotyzm-yes" && item.answer === "yes"),
      divName: psyhoPosDiv,
      group: "psyhotyzm"
    },
    {
      items: array.filter(item => item.type === "psyhotyzm-no" && item.answer === "no"),
      divName: psyhoNegDiv,
      group: "psyhotyzm"
    },

    {
      items: array.filter(item => item.type === "extroversion-yes" && item.answer === "yes"),
      divName: extroPosDiv,
      group: "extroversion"
    },

    {
      items: array.filter(item => item.type === "extroversion-no" && item.answer === "no"),
      divName: extroNegDiv,
      group: "extroversion"
    },

    {
      items: array.filter(item => item.type === "neuroticism-yes" && item.answer === "yes"),
      divName: neuroPosDiv,
      group: "neuroticism"
    },

    {
      items: array.filter(item => item.type === "lie-yes" && item.answer === "yes"),
      divName: liePosDiv,
      group: "lie"
    },

    {
      items: array.filter(item => item.type === "lie-no" && item.answer === "no"),
      divName: lieNegDiv,
      group: "lie"
    }
  ];
};

const renderPreview = (answers, container) => {
  const groups = epqrDefault.groups.map(({ type }) => type);
  container.innerHTML = `
      <h3>Podgląd:</h3>
      <div class="container">
        ${groups
          .map(group => {
            let plGroup = "";
            switch (group.toLowerCase()) {
              case "psyhotyzm":
                plGroup = "Psyhotyzm";
                break;
              case "extroversion":
                plGroup = "Ekstrawersja";
                break;
              case "neuroticism":
                plGroup = "Neurotyczność";
                break;
              case "lie":
                plGroup = "Skala kłamstwa";
                break;
              default:
                plGroup = "";
                break;
            }
            if (!group) return;

            const positiveAnswers = answers.filter(({ id, type, answer }) => type === `${group}-yes` && answer === "yes");
            const negativeAnswers = answers.filter(({ id, type, answer }) => type === `${group}-no` && answer === "no");

            return `
              <div>
              <h4>${plGroup}</h4>
                <div>
                  <span>Tak</span>
                  <ul class="${group}-positive">
                    ${positiveAnswers.map(({ id, answer }) => `<li class="${answer}">${id}</li>`).join("")}
                  </ul>
                </div>
                ${
                  group !== "neuroticism"
                    ? `<div>
                        <span>Nie</span>
                        <ul class="${group}-negative">
                          ${negativeAnswers.map(({ id, answer }) => `<li class="${answer}">${id}</li>`).join("")}
                        </ul>
                      </div>`
                    : ""
                }
                </div>`;
          })
          .join("")}
      </div>
  `;
};
renderPreview(answers, previewContainer);

renderAnswers(epqrDefault.testName, answers, answersDiv);

const renderResultBox = (container, groupName, raw, stens) => {
  let polishGroupName = "";

  switch (groupName) {
    case "psyhotyzm":
      polishGroupName = "Psychotyzm";
      break;
    case "extroversion":
      polishGroupName = "Ekstrawersja";
      break;
    case "neuroticism":
      polishGroupName = "Neurotyczność";
      break;
    case "lie":
      polishGroupName = "Skala kłamstwa";
      break;

    default:
      polishGroupName = "";
      break;
  }
  container.innerHTML += `
    <div class="box">
      <div class="wrapper">
        <h3>${polishGroupName}</h3>
      </div>
      <div class="wrapper">
        <span>Wynik surowy</span>
        <span>steny</span>
      </div>
      <div class="wrapper">
        <span>${raw}</span>
        <span>${stens}</span>
      </div>
    </div>`;
};
const displayResult = async answers => {
  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
  const STENS_URL = "./scripts/stens.json";
  const gender = document.querySelector(".gender-group input:checked").value;
  const ageGroup = document.querySelector(".age-group input:checked").value;
  const displayGenderSpan = resultBox.querySelector(".display-gender");
  const displayAgeGroupSpan = resultBox.querySelector(".display-group");
  const boxesContainer = resultBox.querySelector(".boxes");
  const groupNamesList = ["psyhotyzm", "extroversion", "neuroticism", "lie"];
  boxesContainer.innerHTML = "";

  displayGenderSpan.textContent = gender === "male" ? "męszczyzn" : "kobiet";
  if (ageGroup === "pupils") displayAgeGroupSpan.textContent = '"uczniowie"';
  else if (ageGroup === "adults") displayAgeGroupSpan.textContent = '"dorośli"';
  else displayAgeGroupSpan.textContent = '"studenci"';

  try {
    const response = await fetch(STENS_URL);
    const data = await response.json();

    groupNamesList.map(groupName => {
      const positiveTotal = answers.filter(({ type, answer }) => type === `${groupName}-yes` && answer === "yes").length;
      const negativeTotal = answers.filter(({ type, answer }) => type === `${groupName}-no` && answer === "no").length;
      const groupTotal = positiveTotal + negativeTotal;

      const pointRange = data[ageGroup][gender][groupName];

      const [sten] = pointRange.filter(({ min, max }) => groupTotal >= min && groupTotal <= max).map(item => item.sten);
      renderResultBox(boxesContainer, groupName, groupTotal, sten);
    });
  } catch (err) {
    displayError(err, resultBox);
  }
};

answersDiv.addEventListener("click", e => {
  changeAnswer(e, answers, localStorageNames.epqr);
  renderPreview(answers, previewContainer);
});
resultBtn.addEventListener("click", () => displayResult(answers));
resetBtn.addEventListener("click", () => resetAnswers(answers, localStorageNames.epqr, epqrDefault.testName, renderAnswers, answersDiv));

resultBox.addEventListener("click", e => closeResultBox(e, resultBox, document.body));
document.addEventListener("DOMContentLoaded", () => {
  if (currentTheme === "dark") document.body.classList.add("dark-theme");
  else document.body.classList.remove("dark-theme");
});

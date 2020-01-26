const defaultAnswers = groupAssignment(epqrDefault);

const answers = JSON.parse(localStorage.getItem("answersEPQR")) || defaultAnswers;

//preveiw boxes
const answersDiv = document.querySelector(".answers"),
  psyhoPosDiv = document.querySelector(".psyhotyzm-positive"),
  psyhoNegDiv = document.querySelector(".psyhotyzm-negative"),
  neuroPosDiv = document.querySelector(".neuroticism-positive"),
  neuroNegDiv = document.querySelector(".neuroticism-negative"),
  extroPosDiv = document.querySelector(".extroversion-positive"),
  extroNegDiv = document.querySelector(".extroversion-negative"),
  liePosDiv = document.querySelector(".lie-positive"),
  lieNegDiv = document.querySelector(".lie-negative");

//btns
const resetBtn = document.getElementById("reset"),
  resultBtn = document.getElementById("result");

//results boxes
const resultBox = document.querySelector(".result-box"),
  titleGender = resultBox.querySelector("span.gender"),
  titleGroup = resultBox.querySelector("span.group");

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

const renderPreview = array => {
  array.map(el => (el.divName.innerHTML = el.items.map(item => `<li class="${item.className}">${item.id}</li>`).join("")));
};

const render = array => {
  answersDiv.innerHTML = array.map(item => `<button class="${item.className}" data-id="${item.id}" data-type="${item.type}" data-answer="${item.answer}" >${item.id}</button>`).join("");
  const newArray = calculateAnswers(array);
  renderPreview(newArray);
};
renderAnswers(epqrDefault.testName, answers, answersDiv);

const getSten = (group, scale, gender, rawR, stens) => stens[group][scale][gender][rawR];

const displayResult = arr => {
  const group = document.querySelector("#people-group").value;
  const gender = document.querySelector('[name="gender"]:checked').value;
  const resultSpans = document.querySelectorAll(".result-box span[data-type]");

  const rawPsyhoResult = [...arr.filter(item => item.group === "psyhotyzm")[0].items, ...arr.filter(item => item.group === "psyhotyzm")[1].items].length;
  const rawExtroResult = [...arr.filter(item => item.group === "extroversion")[0].items, ...arr.filter(item => item.group === "extroversion")[1].items].length;
  const rawNeuroResult = [...arr.filter(item => item.group === "neuroticism")[0].items].length;
  const rawLieResult = [...arr.filter(item => item.group === "lie")[0].items, ...arr.filter(item => item.group === "lie")[1].items].length;

  const results = {
    rawPsyhoResult,
    stenPsyhoResult: getSten(group, "psyhotyzm", gender, rawPsyhoResult, stens),
    rawExtroResult,
    stenExtroResult: getSten(group, "extroversion", gender, rawExtroResult, stens),
    rawNeuroResult,
    stenNeuroResult: getSten(group, "neuroticism", gender, rawNeuroResult, stens),
    rawLieResult,
    stenLieResult: getSten(group, "lie", gender, rawLieResult, stens)
  };

  resultSpans.forEach(span => (span.textContent = results[span.dataset.type]));

  titleGender.textContent = gender === "male" ? "męszczyzn" : "kobiet";
  titleGroup.textContent = `${group === "students" ? "Studenci" : group === "pupils" ? "Uczniowie" : group === "adults" ? "Dorośli" : ""}`;

  resultBox.classList.add("visible");
  document.body.classList.add("no-scroll");
};

// const resetAnswers = array => {
//   array.forEach(el => {
//     el.className = "default";
//     el.answer = "none";
//   });

//   localStorage.setItem("answersEPQR", JSON.stringify(array));
//   render(array);
// };

// const closeResultBox = e => {
//   if (e.target === resultBox || e.target.classList.contains("close-results")) {
//     resultBox.classList.remove("visible");
//     document.body.classList.remove("no-scroll");
//   }
// };

answersDiv.addEventListener("click", e => changeAnswer(e, answers, localStorageNames.epqr));
resultBtn.addEventListener("click", () => displayResult(calculateAnswers(answers)));
resetBtn.addEventListener("click", () => resetAnswers(answers));

resultBox.addEventListener("click", closeResultBox);

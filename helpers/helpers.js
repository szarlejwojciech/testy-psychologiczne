//default tests
const kwiDefault = {
  testName: "kwi",
  numberOfQuestions: 28,
  groups: [
    {
      type: "linguistic",
      questions: [5, 9, 19, 20]
    },
    {
      type: "math",
      questions: [6, 11, 22, 28]
    },
    {
      type: "visual",
      questions: [2, 12, 18, 24]
    },
    {
      type: "music",
      questions: [4, 10, 17, 27]
    },
    {
      type: "interpersonal",
      questions: [3, 8, 13, 23]
    },
    {
      type: "intrapersonal",
      questions: [7, 15, 16, 26]
    },
    {
      type: "kinesthetic",
      questions: [1, 14, 21, 25]
    }
  ]
};
const pkieDefault = {
  testName: "pkie",
  numberOfQuestions: 94,
  groups: [
    {
      type: "group-akc",
      reverseScoring: [10, 24, 28, 70],
      questions: [10, 24, 28, 70, 5, 20, 34, 37, 38, 46, 52, 55, 63, 80, 90]
    },
    {
      type: "group-emp",
      questions: [2, 6, 7, 11, 12, 16, 21, 25, 50, 51, 56, 57, 62, 66, 67, 71, 77, 92]
    },
    {
      type: "group-kon",
      reverseScoring: [4, 18, 26, 48, 49, 53, 59, 68, 72, 74, 82],
      questions: [4, 18, 26, 48, 49, 53, 59, 68, 72, 74, 82]
    },
    {
      type: "group-roz",
      reverseScoring: [1, 13, 19, 27, 39, 54, 60, 75, 79, 84],
      questions: [1, 13, 19, 27, 39, 54, 60, 75, 79, 84]
    },
    {
      type: "",
      reverseScoring: [29, 35, 40, 43, 47, 61, 76, 81, 85, 86, 91],
      questions: [3, 8, 9, 14, 15, 17, 22, 23, 29, 30, 31, 32, 33, 35, 36, 40, 41, 42, 43, 44, 45, 47, 58, 61, 64, 65, 69, 73, 76, 78, 81, 83, 85, 86, 87, 88, 89, 91, 93, 94]
    }
  ]
};
const prokosDefault = {
  testName: "prokos",
  numberOfQuestions: 94,
  groups: [
    {
      type: "group-a",
      questions: [6, 11, 14, 15, 18, 24, 29, 34, 35, 52, 63, 68, 81, 82]
    },
    {
      type: "group-k",
      questions: [4, 7, 17, 21, 26, 45, 47, 19, 59, 60, 69, 72, 77, 80, 85, 87]
    },
    {
      type: "group-t",
      questions: [1, 2, 5, 12, 32, 40, 58, 62, 65, 86, 89]
    },
    {
      type: "group-z",
      questions: [27, 37, 42, 44, 53, 55, 56, 64, 70, 74, 78, 84, 88]
    },
    {
      type: "group-s",
      questions: [13, 39, 48, 51, 73, 90]
    }
  ]
};
const epqrDefault = {
  testName: "epqr",
  numberOfQuestions: 106,
  groups: [
    {
      type: "psyhotyzm",
      yes: [25, 29, 30, 34, 37, 42, 48, 50, 56, 73, 75, 91, 95],
      no: [2, 5, 7, 9, 12, 14, 18, 21, 41, 54, 59, 64, 68, 79, 81, 85, 88, 96, 99],
      questions: [25, 29, 30, 34, 37, 42, 48, 50, 56, 73, 75, 91, 95, 2, 5, 7, 9, 12, 14, 18, 21, 41, 54, 59, 64, 68, 79, 81, 85, 88, 96, 99]
    },
    {
      type: "extroversion",
      yes: [1, 6, 11, 16, 20, 28, 36, 40, 45, 51, 55, 58, 61, 63, 67, 69, 72, 78, 90, 94],
      no: [24, 33, 47],
      questions: [1, 6, 11, 16, 20, 28, 36, 40, 45, 51, 55, 58, 61, 63, 67, 69, 72, 78, 90, 94, 24, 33, 47]
    },
    {
      type: "neuroticism",
      yes: [3, 8, 13, 17, 22, 26, 31, 35, 38, 43, 46, 52, 60, 65, 70, 74, 76, 80, 83, 84, 87, 92, 97, 100],
      questions: [3, 8, 13, 17, 22, 26, 31, 35, 38, 43, 46, 52, 60, 65, 70, 74, 76, 80, 83, 84, 87, 92, 97, 100]
    },
    {
      type: "lie",
      yes: [15, 23, 39, 62, 86, 98],
      no: [4, 10, 19, 27, 32, 44, 49, 53, 57, 66, 71, 77, 82, 89, 93],
      questions: [15, 23, 39, 62, 86, 98, 4, 10, 19, 27, 32, 44, 49, 53, 57, 66, 71, 77, 82, 89, 93]
    },
    {
      type: "",
      questions: [101, 102, 103, 104, 105, 106]
    }
  ]
};
//local storage names for all tests
const localStorageNames = {
  pkie: "answersPKIE0123",
  kwi: "answersKWI0123",
  prokos: "answersPROKOS0123",
  epqr: "answersEPQR0123"
};

//main functions for all tests
const groupAssignment = testDefault => {
  const array = [];
  let item = {
    id: null,
    type: "",
    answer: null
  };

  testDefault.groups.map(({ type, questions, reverseScoring, yes, no }) => {
    questions.map(question => {
      item = {
        id: question,
        type,
        answer: null
      };

      if (reverseScoring && reverseScoring.find(id => id === question)) item.reverseScoring = true;

      // if (testDefault.testName === epqrDefault.testName) item.className = "default";

      if (yes && yes.find(id => id === question)) item.type = `${type}-yes`;

      if (no && no.find(id => id === question)) item.type = `${type}-no`;

      array.push(item);
    });
  });
  return array.sort((a, b) => a.id - b.id);
};

const renderAnswers = (testName, answersArray, container) => {
  if (testName === epqrDefault.testName) {
    container.innerHTML = answersArray
      .map(
        ({ id, type, answer }) => `
        <button
          class="${!answer ? "default" : answer}"
          data-id="${id}"
          data-type="${type}"
          data-answer="${answer}">
            ${id}
        </button>`
      )
      .join("");
    return;
  }

  let numberOfAnswers = [];
  switch (testName) {
    case pkieDefault.testName:
      numberOfAnswers = [1, 2, 3, 4, 5];
      break;
    case kwiDefault.testName:
      numberOfAnswers = [0, 1, 2, 3, 4, 5];
      break;
    case prokosDefault.testName:
      numberOfAnswers = [1, 2, 3, 4];
      break;
    default:
      numberOfAnswers = [];
      break;
  }

  container.innerHTML = answersArray
    .map(({ id, type, answer }) => {
      const radioInputsInnerHTML = numberOfAnswers
        .map(
          num => `<li>
            <input 
              id="answer-${id}-${num}"
              data-key="${id}"
              type="radio"
              name="answer-${id}"
              ${answer === num ? "checked" : ""}
              value="${num}"
            >
            <label for="answer-${id}-${num}">${num}</label>
          </li>`
        )
        .join("");

      return `<div class="answer-box" id="box${id}" data-type="${type}">
                <ul>
                  <li>${id}</li>
                  ${radioInputsInnerHTML}
                </ul>
              </div>`;
    })
    .join("");
};

const changeAnswer = (e, answers, localStorageName) => {
  console.log(e.target);
  if (localStorageName === localStorageNames.epqr) {
    if (e.target.tagName !== "BUTTON") return;
    const index = e.target.dataset.id - 1;
    if (!answers[index].answer) {
      answers[index].answer = "yes";
      // answers[index].className = "yes";
      e.target.className = "yes";
    } else if (answers[index].answer === "yes") {
      answers[index].answer = "no";
      // answers[index].className = "no";
      e.target.className = "no";
    } else if (answers[index].answer === "no") {
      answers[index].answer = null;
      // answers[index].className = "default";
      e.target.className = "default";
    }
    localStorage.setItem(localStorageName, JSON.stringify(answers));
    document.querySelectorAll(".answers button")[index].focus();
  } else {
    if (e.target.type !== "radio") return;
    const index = e.target.dataset.key - 1;
    const input = document.querySelector(`#box${index + 1} input:checked`);

    answers[index].answer = Number.parseInt(input.value);
    localStorage.setItem(localStorageName, JSON.stringify(answers));
    document.querySelector(`#box${index + 1} input:checked`).focus();
  }
};

const resetAnswers = (answers, localStorageName, testName, renderFn, answersDiv) => {
  answers.forEach(el => (el.answer = null));

  localStorage.setItem(localStorageName, JSON.stringify(answers));
  renderFn(testName, answers, answersDiv);
};

const closeResultBox = (e, resultBox, body) => {
  if (e.target === resultBox || e.target.classList.contains("close-results")) {
    resultBox.classList.remove("visible");
    body.classList.remove("no-scroll");
  }
};

const displayError = (error, container) => {
  const errorBox = document.createElement("div");
  errorBox.classList.add("error-message");
  container.innerHTML = "";
  errorBox.innerHTML = '<button class="close-results"></button><span>Coś poszło nie tak, odśwież stronę lub spróbuj ponownie później!</span>';
  // errorBox.textContent = "";
  container.appendChild(errorBox);
};

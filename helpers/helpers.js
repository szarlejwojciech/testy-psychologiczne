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
  testName: "pkie",
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

const groupAssignment = testDefault => {
  const array = [];
  let item = {
    id: null,
    type: "",
    answer: null
  };

  testDefault.groups.map(({ type, questions, reverseScoring }) => {
    questions.map(question => {
      item = {
        id: question,
        type,
        answer: null
      };

      if (reverseScoring && reverseScoring.find(id => id === question)) item.reverseScoring = true;

      array.push(item);
    });
  });
  return array.sort((a, b) => a.id - b.id);
};

const renderAnswers = (testName, answersArray, container) => {
  container.innerHTML = answersArray
    .map(
      ({ id, type, answer }) =>
        `<div class="answer-box" id="box${id}" data-type="${type}">
          <ul>
            <li>${id}</li>
            <li>
              <input id="answer-${id}-0" data-key="${id}" type="radio" name="answer-${id}" ${answer === 0 ? "checked" : ""} value="0">
              <label for="answer-${id}-0">0</label>
            </li>
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

const changeAnswer = (e, answers, localStorageName) => {
  if (e.target.type !== "radio") return;
  const index = e.target.dataset.key - 1;
  const input = document.querySelector(`#box${index + 1} input:checked`);

  answers[index].answer = Number.parseInt(input.value);
  localStorage.setItem(localStorageName, JSON.stringify(answers));
  document.querySelector(`#box${index + 1} input:checked`).focus();
};

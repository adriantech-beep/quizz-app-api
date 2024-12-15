const optionGeography = document.querySelector(".option-geography");
const optionSports = document.querySelector(".option-sports");
const optionScience = document.querySelector(".option-science");
const optionVehicles = document.querySelector(".option-vehicles");

const displayTitle = document.querySelector(".display-title");
const displayChoices = document.querySelector(".display-choices");
const container = document.querySelector(".container");
const buttonContainer = document.querySelector(".button-container");
const nextBtn = document.querySelector(".next-btn");
const correctAnswerModal = document.querySelector(".correct-answer__modal");
const wrongAnswerModal = document.querySelector(".wrong-answer__modal");
const selectedCorrect = document.querySelector(".selected-correct");
const selectedWrong = document.querySelector(".selected-wrong");
const fetchErrorOverlay = document.querySelector(".fetch-error__overlay");
const playAgainBtn = document.querySelector(".play-again__btn");
const scoreContainer = document.querySelector(".score-container");
const displayScore = document.querySelector(".display-score");
const choiceCategoryContainer = document.querySelector(
  ".choice-category__container"
);

addHiddenClass(buttonContainer);
addHiddenClass(correctAnswerModal);
addHiddenClass(wrongAnswerModal);

let questions;
let index = 0;
let score = 0;

const dataFetched = async function (url) {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${url}&difficulty=easy&type=multiple`
    );
    if (!response.ok) throw new Error("Problem getting the data");

    const data = await response.json();
    console.log(data);

    questions = data.results.map((result) => ({
      category: result.category,
      question: result.question,
      correctAnswer: result.correct_answer,
      wrongAnswers: result.incorrect_answers,
    }));
    displayQuestions(0);
  } catch (error) {
    removeHiddenClass(fetchErrorOverlay);
    displayFetchError(error);
  }
};

const displayQuestions = function (index) {
  if (index < questions.length) {
    const questionData = questions[index];

    const markUp = `
    <h3 class="roboto-condensed">${questionData.question}</h3>
  `;

    displayTitle.innerHTML = "";
    displayTitle.insertAdjacentHTML("afterbegin", markUp);

    const categoryMarkUp = `
          <h1 class="roboto-condensed">Category: <span class="roboto">${
            questionData.category
          }</span></h1>
          <p class="roboto-condensed">question#<span class="roboto">${
            index + 1
          }</span>
                        `;

    choiceCategoryContainer.innerHTML = categoryMarkUp;
    const choices = [...questionData.wrongAnswers, questionData.correctAnswer];

    displayChoices.innerHTML = "";
    removeHiddenClass(buttonContainer);

    choices.sort(() => Math.random() - 0.5);

    choices.forEach((choice, idx) => {
      const questionMarkUp = `
          <div class="options" id="select-${idx + 1}">
            <p class="choices roboto-condensed">${choice}</p>
        </div>`;
      displayChoices.insertAdjacentHTML("beforeend", questionMarkUp);
    });

    choices.forEach((choice, idx) => {
      const answerElement = document.getElementById(`select-${idx + 1}`);
      answerElement.onclick = () => selectAnswer(choice, index);
    });
  } else {
    addHiddenClass(nextBtn);
    removeHiddenClass(scoreContainer);
    displayScore.textContent = score;
  }
};

function selectAnswer(selectedChoice, index) {
  const questionData = questions[index];
  const isCorrect = selectedChoice === questionData.correctAnswer;
  if (isCorrect) {
    score++;
    removeHiddenClass(correctAnswerModal);
    addBorderColor(container, "border-bottom__green");
    selectedCorrect.innerHTML = selectedChoice;
  } else {
    removeHiddenClass(wrongAnswerModal);
    addBorderColor(container, "border-bottom__red");
    selectedWrong.innerHTML = selectedChoice;
  }
  nextBtn.addEventListener("click", function () {
    displayQuestions(index + 1);
    addHiddenClass(correctAnswerModal);
    addHiddenClass(wrongAnswerModal);
    removeBorderColor(container, "border-bottom__red");
    removeBorderColor(container, "border-bottom__green");
  });
}

function displayFetchError(error) {
  fetchErrorOverlay.innerHTML = "";
  const markUp = `<div class="fetch-error__modal center">
      <h1 class="roboto-condensed">Oops!</h1>
      <i class="fa-solid fa-xmark"></i>
      <h2 class="roboto-condensed">${error}</h2>
      <p class="roboto">
        We encountered a problem while trying to connect with our server
      </p>
      <p class="roboto">Please try again</p>
      <button class="return-home__btn roboto">Return to home</button>
    </div>`;

  fetchErrorOverlay.insertAdjacentHTML("beforeend", markUp);
  const returnHomeBtn = document.querySelector(".return-home__btn");
  returnHomeBtn.addEventListener("click", function () {
    addHiddenClass(fetchErrorOverlay);
  });
}
function addBorderColor(className, classList) {
  className.classList.add(classList);
}
function removeBorderColor(className, classList) {
  className.classList.remove(classList);
}
function addHiddenClass(className) {
  className.classList.add("hidden");
}
function removeHiddenClass(className) {
  className.classList.remove("hidden");
}

optionGeography.addEventListener("click", function () {
  dataFetched(22);
});
optionSports.addEventListener("click", function () {
  dataFetched(21);
});
optionScience.addEventListener("click", function () {
  dataFetched(18);
});
optionVehicles.addEventListener("click", function () {
  dataFetched(28);
});

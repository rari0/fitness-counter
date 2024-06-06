let currentStep = 0;
let userData = {
  gender: null,
  weight: 0,
  age: 0,
  activityLevel: null
};

const questions = [
  {
    id: "gender",
    text: "Select your gender",
    options: ["Male", "Female"]
  },
  {
    id: "weight",
    text: "Select your weight - kg",
    counter: true
  },
  {
    id: "age",
    text: "Select your age",
    counter: true
  },
  {
    id: "activityLevel",
    text: "Select your activity level",
    options: ["Light", "Moderate", "Heavy"]
  }
];

function showQuestion(step) {
  const questionContainer = document.getElementById('question-container');
  questionContainer.innerHTML = '';

  const question = questions[step];
  const questionText = document.createElement('h2');
  questionText.textContent = question.text;
  questionContainer.appendChild(questionText);

  if (question.options) {
    question.options.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option;
      if (question.id === "gender") {
        button.classList.add('gender-button');
      }
      button.onclick = () => selectOption(question.id, option, button);
      questionContainer.appendChild(button);
    });
  } else if (question.counter) {
      const counterContainer = document.createElement('div');
      counterContainer.className = 'counter-controls';

      const minusButton = document.createElement('button');
      minusButton.textContent = '-';
      attachCounterHandlers(minusButton, question.id, -1);
      counterContainer.appendChild(minusButton);

      const counterDisplay = document.createElement('span');
      counterDisplay.id = `${question.id}-counter`;
      counterDisplay.textContent = userData[question.id];
      counterContainer.appendChild(counterDisplay);

      const plusButton = document.createElement('button');
      plusButton.textContent = '+';
      attachCounterHandlers(plusButton, question.id, 1);
      counterContainer.appendChild(plusButton);

      questionContainer.appendChild(counterContainer);
  }
}

function attachCounterHandlers(button, id, value) {
  let interval;

  const startCounting = () => {
    updateCounter(id, value);
    interval = setInterval(() => updateCounter(id, value), 200);
  };

  const stopCounting = () => clearInterval(interval);

  button.onclick = () => updateCounter(id, value);
  button.onmousedown = startCounting;
  button.onmouseup = stopCounting;
  button.onmouseleave = stopCounting;
}

function selectOption(id, value, element) {
  userData[id] = value;
  const buttons = document.querySelectorAll(`#question-container button`);
  buttons.forEach(button => button.classList.remove('selected'));
  element.classList.add('selected');
}

function updateCounter(id, value) {
  userData[id] = Math.max(0, userData[id] + value);
  document.getElementById(`${id}-counter`).textContent = userData[id];
}

function nextQuestion() {
  if (validateStep()) {
    if (currentStep < questions.length - 1) {
      currentStep++;
      showQuestion(currentStep);
    } else {
      calculateResult();
    }
  } else {
    alert("Please, select first.");
  }
}

function prevQuestion() {
  if (currentStep > 0) {
    currentStep--;
    showQuestion(currentStep);
  }
}

function validateStep() {
  const currentQuestion = questions[currentStep];
  if (currentQuestion.id === 'gender' || currentQuestion.id === 'activityLevel') {
    return userData[currentQuestion.id] !== null;
  } else {
    return userData[currentQuestion.id] > 0;
  }
}

function calculateResult() {
  let BMR, LAF;
  const weight = userData.weight;
  const age = userData.age;
  const gender = userData.gender;
  const activityLevel = userData.activityLevel;

  if (gender === "Female") {
    if (age >= 18 && age <= 29) {
      BMR = 14.7 * weight + 496;
    } else if (age >= 30 && age <= 59) {
      BMR = 8.7 * weight + 829;
    } else if (age >= 60 && age <= 74) {
      BMR = 9.2 * weight + 688;
    } else {
      BMR = 9.8 * weight + 624;
    }
  if (age <= 59) {
    if (activityLevel === "Light") LAF = 1.56;
    if (activityLevel === "Moderate") LAF = 1.64;
    if (activityLevel === "Heavy") LAF = 1.82;
  } else {
    LAF = 1.56;
  }
  } else {
    if (age >= 18 && age <= 29) {
      BMR = 15.3 * weight + 679;
    } else if (age >= 30 && age <= 59) {
      BMR = 11.6 * weight + 879;
    } else if (age >= 60 && age <= 74) {
      BMR = 11.9 * weight + 700;
    } else {
      BMR = 8.4 * weight + 819;
    }
    if (age <= 59) {
      if (activityLevel === "Light") LAF = 1.55;
      if (activityLevel === "Moderate") LAF = 1.78;
      if (activityLevel === "Heavy") LAF = 2.10;
    } else {
      LAF = 1.51;
    }
  }

  const dailyCalories = BMR * LAF;

  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = `<h3>Calorie needs:</h3> <h2>${dailyCalories.toFixed(2)} kcal/die</h2>`;
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('reset-btn').style.display = 'block';
}

function resetTest() {
  currentStep = 0;
  userData = {
    gender: null,
    weight: 0,
    age: 0,
    activityLevel: null
  };
  document.getElementById('question-container').style.display = 'block';
  document.getElementById('controls').style.display = 'block';
  document.getElementById('reset-btn').style.display = 'none';
  document.getElementById('result-container').innerHTML = '';
  showQuestion(currentStep);
}

document.addEventListener("DOMContentLoaded", () => {
  showQuestion(currentStep);
  document.getElementById('reset-btn').style.display = 'none';
});

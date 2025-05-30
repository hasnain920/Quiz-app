const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const restartBtn = document.getElementById('restart-btn');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = new Set();

async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    questions = await res.json();
    totalEl.textContent = questions.length;
    showQuestion();
  } catch (err) {
    questionEl.textContent = 'Failed to load questions.';
    console.error(err);
  }
}

function showQuestion() {
  nextBtn.disabled = true;
  selectedAnswers.clear();

  const q = questions[currentQuestionIndex];
  questionEl.textContent = q.question;

  optionsEl.innerHTML = '';
  q.options.forEach((option, i) => {
    const label = document.createElement('label');
    label.className = 'option-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = i;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selectedAnswers.add(i);
      } else {
        selectedAnswers.delete(i);
      }
      nextBtn.disabled = selectedAnswers.size === 0;
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(option));
    optionsEl.appendChild(label);
  });
}

function checkAnswer() {
  const correctSet = new Set(questions[currentQuestionIndex].correctAnswers);
  if (
    selectedAnswers.size === correctSet.size &&
    [...selectedAnswers].every((ans) => correctSet.has(ans))
  ) {
    score++;
  }
}

nextBtn.addEventListener('click', () => {
  checkAnswer();
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById('quiz-container').classList.add('hidden');
  resultEl.classList.remove('hidden');
  scoreEl.textContent = score;
}

restartBtn.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  resultEl.classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  showQuestion();
});

loadQuestions();

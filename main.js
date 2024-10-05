const apiUrl = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let userName = '';

document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
document.getElementById('nextBtn').addEventListener('click', nextQuestion);

async function fetchQuizData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results;
}

async function startQuiz() {
  userName = document.getElementById('nameInput').value;
  if (userName === '') {
    alert('Please enter your name');
    return;
  }

  quizData = await fetchQuizData();
  if (!quizData || quizData.length === 0) {
    alert('Failed to load quiz data');
    return;
  }

  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';

  showQuestion();
}

function showQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  document.getElementById('question').textContent = currentQuestion.question;

  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = '';

  const answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort(() => Math.random() - 0.5);
  answers.forEach(answer => {
    const button = document.createElement('button');
    button.textContent = answer;
    button.addEventListener('click', () => selectAnswer(answer));
    choicesContainer.appendChild(button);
  });

  document.getElementById('nextBtn').style.display = 'none';
}

function selectAnswer(selectedAnswer) {
  const correctAnswer = quizData[currentQuestionIndex].correct_answer;
  
  // Check if the selected answer is correct and update the score
  if (selectedAnswer === correctAnswer) {
    score++; // Increment score if correct
    document.getElementById('scoreDisplay').textContent = 'Correct!';
  } else {
    document.getElementById('scoreDisplay').textContent = `Wrong! Correct answer: ${correctAnswer}`;
  }

  document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showQuestion();
  } else {
    // Show the final score when the quiz is over
    document.getElementById('quiz-screen').innerHTML = `<h2>Thanks, ${userName}!</h2><p>Your final score is ${score} out of ${quizData.length}.</p>`;
  }
}

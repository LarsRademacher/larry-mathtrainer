'use strict';
const game = window.LarryMath;
const totalQuestions = 5;
let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let bonus = 0;
let score = 0;
let questionStarted = 0;
let running = false;
const $ = selector => document.querySelector(selector);
function updateScore() {
  $('#correct').textContent = correct;
  $('#wrong').textContent = wrong;
  $('#bonus').textContent = bonus;
  $('#score').textContent = score;
}
function setAnswerEnabled(enabled) {
  $('#answer').disabled = !enabled;
  $('#submit-answer').disabled = !enabled;
}
function renderQuestion() {
  const question = questions[current];
  $('#round').textContent = String(current + 1);
  $('#problem').textContent = `${question.a} + ${question.b} = ?`;
  $('#feedback').textContent = 'Die Lehrerin wartet auf deine Antwort.';
  $('#feedback').className = 'feedback';
  $('#answer').value = '';
  setAnswerEnabled(true);
  $('#answer').focus();
  questionStarted = performance.now();
  $('#status').textContent = `Aufgabe ${current + 1} von ${totalQuestions}`;
}
function startGame() {
  questions = game.makeQuestions(totalQuestions);
  current = 0; correct = 0; wrong = 0; bonus = 0; score = 0; running = true;
  updateScore();
  $('#start').hidden = true;
  renderQuestion();
}
function finishGame() {
  running = false;
  setAnswerEnabled(false);
  $('#start').hidden = false;
  $('#start').textContent = 'Noch einmal spielen';
  $('#problem').textContent = 'Geschafft!';
  $('#feedback').textContent = `${correct} richtig, ${wrong} falsch, ${bonus} Bonuspunkte.`;
  $('#feedback').className = correct >= 4 ? 'feedback good' : 'feedback almost';
  $('#status').textContent = `Fertig · ${score} Punkte`;
  $('#result-summary').innerHTML = `<p><strong>${score} Punkte</strong></p><p>${correct} richtige und ${wrong} falsche Antworten.</p><p>Zeitbonus: ${bonus} Punkte.</p>`;
  $('#result-dialog').showModal();
}
function submitAnswer(event) {
  event.preventDefault();
  if (!running) return;
  const question = questions[current];
  const value = Number($('#answer').value);
  if (!Number.isInteger(value)) return;
  const elapsed = performance.now() - questionStarted;
  const isCorrect = value === question.answer;
  const result = game.scoreAnswer(isCorrect, elapsed);
  if (isCorrect) {
    correct += 1;
    bonus += result.bonus;
    score += result.total;
    $('#feedback').textContent = `Richtig! +10 Punkte, +${result.bonus} Zeitbonus.`;
    $('#feedback').className = 'feedback good';
  } else {
    wrong += 1;
    $('#feedback').textContent = `Nicht ganz. Richtig wäre ${question.answer}.`;
    $('#feedback').className = 'feedback wrong';
  }
  updateScore();
  setAnswerEnabled(false);
  current += 1;
  setTimeout(() => current >= totalQuestions ? finishGame() : renderQuestion(), 1050);
}
$('#start').onclick = startGame;
$('#new-game').onclick = startGame;
$('#answer-form').onsubmit = submitAnswer;
$('#rules').onclick = () => $('#rules-dialog').showModal();
updateScore();

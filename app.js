'use strict';
const game = window.LarryMath;
let language = localStorage.getItem('larry-math-language') || 'de';
const copy = {
  de: {
    title: 'Larry Math', training: 'Training', newGame: 'Neues Spiel', rules: 'Spielregeln', settings: 'Informationen und Einstellungen', answerEyebrow: 'DEINE ANTWORT', result: 'Ergebnis', check: 'Antwort prüfen', start: 'Spiel starten', again: 'Noch einmal spielen', level: 'Level', count: 'Anzahl Fragen', countShort: 'Kurz · 5 Fragen', countMedium: 'Mittel · 10 Fragen', countLong: 'Lang · 20 Fragen', points: 'PUNKTE', correct: 'Richtig', wrong: 'Falsch', bonus: 'Zeitbonus', total: 'Gesamt', legend: 'Schnelle Antworten geben Bonuspunkte: bis zu 5 Punkte pro Aufgabe. Jede richtige Antwort zählt 10 Punkte.', ready: 'Bereit?', readyFeedback: 'Drücke Start, dann geht es los.', waiting: 'Die Lehrerin wartet auf deine Antwort.', task: 'AUFGABE', statusReady: 'Bereit · Larry Math', taskStatus: (current, total, level) => `Aufgabe ${current} von ${total} · Level ${level}`, right: bonus => `Richtig! +10 Punkte, +${bonus} Zeitbonus.`, notQuite: answer => `Nicht ganz. Richtig wäre ${answer}.`, done: 'Geschafft!', summary: (correct, wrong, bonus) => `${correct} richtig, ${wrong} falsch, ${bonus} Bonuspunkte.`, finishedStatus: score => `Fertig · ${score} Punkte`, resultTitle: 'Auswertung', resultSummary: (score, correct, wrong, bonus, level, levelName, total) => `<p><strong>${score} Punkte</strong></p><p>${correct} richtige und ${wrong} falsche Antworten.</p><p>Zeitbonus: ${bonus} Punkte.</p><p>Level ${level}: ${levelName} · ${total} Fragen.</p>`, close: 'Schließen', rulesText: 'Wähle zuerst Level und Länge. Level 1 trainiert Addition, Level 2 Addition und Subtraktion, Level 3 das kleine Einmaleins, Level 4 Division mit ganzzahligen Ergebnissen aus dem kleinen Einmaleins und Level 5 das große Einmaleins. Richtige Antworten geben 10 Punkte. Je schneller du antwortest, desto mehr Bonuspunkte bekommst du.', understood: 'Verstanden', settingsTitle: 'Einstellungen', language: 'Sprache', license: 'MIT Lizenz', save: 'Speichern', levels: game.levelNames },
  en: {
    title: 'Larry Math', training: 'Training', newGame: 'New game', rules: 'Rules', settings: 'Information and settings', answerEyebrow: 'YOUR ANSWER', result: 'Result', check: 'Check answer', start: 'Start game', again: 'Play again', level: 'Level', count: 'Number of questions', countShort: 'Short · 5 questions', countMedium: 'Medium · 10 questions', countLong: 'Long · 20 questions', points: 'POINTS', correct: 'Correct', wrong: 'Wrong', bonus: 'Time bonus', total: 'Total', legend: 'Fast answers earn bonus points: up to 5 points per question. Every correct answer is worth 10 points.', ready: 'Ready?', readyFeedback: 'Press Start and off we go.', waiting: 'The teacher is waiting for your answer.', task: 'QUESTION', statusReady: 'Ready · Larry Math', taskStatus: (current, total, level) => `Question ${current} of ${total} · Level ${level}`, right: bonus => `Correct! +10 points, +${bonus} time bonus.`, notQuite: answer => `Not quite. The right answer was ${answer}.`, done: 'Done!', summary: (correct, wrong, bonus) => `${correct} correct, ${wrong} wrong, ${bonus} bonus points.`, finishedStatus: score => `Done · ${score} points`, resultTitle: 'Results', resultSummary: (score, correct, wrong, bonus, level, levelName, total) => `<p><strong>${score} points</strong></p><p>${correct} correct and ${wrong} wrong answers.</p><p>Time bonus: ${bonus} points.</p><p>Level ${level}: ${levelName} · ${total} questions.</p>`, close: 'Close', rulesText: 'Choose level and length first. Level 1 trains addition, Level 2 addition and subtraction, Level 3 small multiplication tables, Level 4 division with exact results from the small multiplication tables, and Level 5 large multiplication tables. Correct answers give 10 points. The faster you answer, the more bonus points you earn.', understood: 'Got it', settingsTitle: 'Settings', language: 'Language', license: 'MIT License', save: 'Save', levels: { 1: 'Addition', 2: 'Addition and subtraction', 3: 'Small multiplication tables', 4: 'Division', 5: 'Large multiplication tables' } }
};
let totalQuestions = 5;
let level = 1;
let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let bonus = 0;
let score = 0;
let questionStarted = 0;
let running = false;
const $ = selector => document.querySelector(selector);
const t = key => copy[language][key];
function updateScore() { $('#correct').textContent = correct; $('#wrong').textContent = wrong; $('#bonus').textContent = bonus; $('#score').textContent = score; }
function setAnswerEnabled(enabled) { $('#answer').disabled = !enabled; $('#submit-answer').disabled = !enabled; }
function selectedQuestionCount() { return game.questionCounts[$('#question-count').value] || 5; }
function selectedLevel() { return Number($('#level').value) || 1; }
function renderSetupText() { level = selectedLevel(); totalQuestions = selectedQuestionCount(); $('#round-total').textContent = String(totalQuestions); $('#level-label').textContent = `Level ${level} · ${copy[language].levels[level]}`; }
function applyLanguage() {
  document.documentElement.lang = language; document.title = t('title');
  document.querySelector('.brand h1 span').textContent = t('training');
  $('#new-game').title = t('newGame'); $('#new-game').setAttribute('aria-label', t('newGame'));
  $('#rules').title = t('rules'); $('#rules').setAttribute('aria-label', t('rules'));
  $('#settings').title = t('settings'); $('#settings').setAttribute('aria-label', t('settings'));
  document.querySelector('.turn-card .eyebrow').textContent = t('answerEyebrow');
  document.querySelector('label[for="answer"]').textContent = t('result');
  $('#submit-answer').textContent = t('check');
  $('#start').textContent = running ? $('#start').textContent : ($('#start').textContent === copy[language === 'de' ? 'en' : 'de'].again ? t('again') : t('start'));
  document.querySelector('label[for="level"]').textContent = t('level');
  document.querySelector('label[for="question-count"]').textContent = t('count');
  [...$('#level').options].forEach(option => { option.textContent = `Level ${option.value} · ${copy[language].levels[option.value]}`; });
  $('#question-count').options[0].textContent = t('countShort'); $('#question-count').options[1].textContent = t('countMedium'); $('#question-count').options[2].textContent = t('countLong');
  document.querySelector('.score-card h3').textContent = t('points');
  document.querySelectorAll('.score-card p span')[0].textContent = t('correct'); document.querySelectorAll('.score-card p span')[1].textContent = t('wrong'); document.querySelectorAll('.score-card p span')[2].textContent = t('bonus'); document.querySelectorAll('.score-card p span')[3].textContent = t('total');
  document.querySelector('.legend').textContent = t('legend');
  document.querySelector('.board-label').childNodes[2].textContent = `\n${t('task')} `;
  if (!running && current === 0 && score === 0) { $('#problem').textContent = t('ready'); $('#feedback').textContent = t('readyFeedback'); $('#status').textContent = t('statusReady'); }
  $('#rules-dialog h2').textContent = t('title'); $('#rules-dialog p').textContent = t('rulesText'); $('#rules-dialog button').textContent = t('understood');
  $('#result-dialog h2').textContent = t('resultTitle'); $('#result-dialog button').textContent = t('close');
  $('#settings-title').textContent = t('settingsTitle'); $('#language-label').textContent = t('language'); $('#license-heading').textContent = t('license'); $('#settings-save').textContent = t('save'); $('#language-select').value = language;
  renderSetupText();
}
function renderQuestion() { const question = questions[current]; $('#round').textContent = String(current + 1); $('#round-total').textContent = String(totalQuestions); $('#problem').textContent = game.questionText(question); $('#feedback').textContent = t('waiting'); $('#feedback').className = 'feedback'; $('#answer').value = ''; $('#answer').removeAttribute('max'); setAnswerEnabled(true); $('#answer').focus(); questionStarted = performance.now(); $('#status').textContent = t('taskStatus')(current + 1, totalQuestions, level); }
function startGame() { renderSetupText(); questions = game.makeQuestions(totalQuestions, level); current = 0; correct = 0; wrong = 0; bonus = 0; score = 0; running = true; updateScore(); $('#start').hidden = true; $('#setup-options').hidden = true; renderQuestion(); }
function finishGame() { running = false; setAnswerEnabled(false); $('#start').hidden = false; $('#setup-options').hidden = false; $('#start').textContent = t('again'); $('#problem').textContent = t('done'); $('#feedback').textContent = t('summary')(correct, wrong, bonus); $('#feedback').className = correct >= Math.ceil(totalQuestions * 0.8) ? 'feedback good' : 'feedback almost'; $('#status').textContent = t('finishedStatus')(score); $('#result-summary').innerHTML = t('resultSummary')(score, correct, wrong, bonus, level, copy[language].levels[level], totalQuestions); $('#result-dialog').showModal(); }
function submitAnswer(event) { event.preventDefault(); if (!running) return; const question = questions[current]; const value = Number($('#answer').value); if (!Number.isInteger(value)) return; const elapsed = performance.now() - questionStarted; const isCorrect = value === question.answer; const result = game.scoreAnswer(isCorrect, elapsed); if (isCorrect) { correct += 1; bonus += result.bonus; score += result.total; $('#feedback').textContent = t('right')(result.bonus); $('#feedback').className = 'feedback good'; } else { wrong += 1; $('#feedback').textContent = t('notQuite')(question.answer); $('#feedback').className = 'feedback wrong'; } updateScore(); setAnswerEnabled(false); current += 1; setTimeout(() => current >= totalQuestions ? finishGame() : renderQuestion(), 1050); }
$('#start').onclick = startGame; $('#new-game').onclick = startGame; $('#answer-form').onsubmit = submitAnswer; $('#rules').onclick = () => $('#rules-dialog').showModal(); $('#settings').onclick = () => $('#settings-dialog').showModal(); $('#settings-form').onsubmit = event => { event.preventDefault(); language = $('#language-select').value; localStorage.setItem('larry-math-language', language); applyLanguage(); $('#settings-dialog').close(); }; $('#level').onchange = renderSetupText; $('#question-count').onchange = renderSetupText; updateScore(); applyLanguage();

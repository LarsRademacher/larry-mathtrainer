'use strict';
(function(global) {
  const levelNames = {
    1: 'Addition',
    2: 'Addition und Subtraktion',
    3: 'Kleines Einmaleins',
    4: 'Division',
    5: 'Großes Einmaleins'
  };
  const questionCounts = { short: 5, medium: 10, long: 20 };
  function integer(random, min, max) {
    return min + Math.floor(random() * (max - min + 1));
  }
  function additionTo10(random) {
    const a = integer(random, 0, 10);
    const b = integer(random, 0, 10 - a);
    return { a, b, operator: '+', answer: a + b };
  }
  function subtractionTo10(random) {
    const a = integer(random, 0, 10);
    const b = integer(random, 0, a);
    return { a, b, operator: '−', answer: a - b };
  }
  function smallMultiplication(random) {
    const a = integer(random, 1, 10);
    const b = integer(random, 1, 10);
    return { a, b, operator: '×', answer: a * b };
  }
  function smallDivision(random) {
    const b = integer(random, 1, 10);
    const answer = integer(random, 1, 10);
    return { a: b * answer, b, operator: '÷', answer };
  }
  function largeMultiplication(random) {
    const a = integer(random, 11, 20);
    const b = integer(random, 2, 20);
    return { a, b, operator: '×', answer: a * b };
  }
  function makeQuestion(level = 1, random = Math.random) {
    const selectedLevel = Number(level) || 1;
    if (selectedLevel === 2) return random() < 0.5 ? additionTo10(random) : subtractionTo10(random);
    if (selectedLevel === 3) return smallMultiplication(random);
    if (selectedLevel === 4) return smallDivision(random);
    if (selectedLevel === 5) return largeMultiplication(random);
    return additionTo10(random);
  }
  function makeQuestions(count = 5, level = 1, random = Math.random) {
    return Array.from({ length: count }, () => makeQuestion(level, random));
  }
  function questionText(question) {
    return `${question.a} ${question.operator} ${question.b} = ?`;
  }
  function timeBonus(elapsedMs) {
    if (elapsedMs <= 2000) return 5;
    if (elapsedMs <= 4000) return 4;
    if (elapsedMs <= 6500) return 3;
    if (elapsedMs <= 9000) return 2;
    if (elapsedMs <= 12000) return 1;
    return 0;
  }
  function scoreAnswer(isCorrect, elapsedMs) {
    if (!isCorrect) return { base: 0, bonus: 0, total: 0 };
    const bonus = timeBonus(elapsedMs);
    return { base: 10, bonus, total: 10 + bonus };
  }
  global.LarryMath = { levelNames, questionCounts, makeQuestion, makeQuestions, questionText, timeBonus, scoreAnswer };
  if (typeof module !== 'undefined') module.exports = global.LarryMath;
})(typeof window !== 'undefined' ? window : globalThis);

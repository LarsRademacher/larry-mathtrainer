'use strict';
(function(global) {
  function makeQuestion(random = Math.random) {
    const a = Math.floor(random() * 11);
    const b = Math.floor(random() * (11 - a));
    return { a, b, answer: a + b };
  }
  function makeQuestions(count = 5, random = Math.random) {
    return Array.from({ length: count }, () => makeQuestion(random));
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
  global.LarryMath = { makeQuestion, makeQuestions, timeBonus, scoreAnswer };
  if (typeof module !== 'undefined') module.exports = global.LarryMath;
})(typeof window !== 'undefined' ? window : globalThis);

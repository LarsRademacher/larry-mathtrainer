'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const math = require('../math-game.js');

test('questions stay in addition range up to 10', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(Math.random);
    assert.ok(question.a >= 0 && question.a <= 10);
    assert.ok(question.b >= 0 && question.b <= 10);
    assert.equal(question.answer, question.a + question.b);
    assert.ok(question.answer <= 10);
  }
});

test('creates five questions by default request', () => {
  assert.equal(math.makeQuestions(5, () => 0.4).length, 5);
});

test('fast correct answers receive bonus, wrong answers score zero', () => {
  assert.deepEqual(math.scoreAnswer(true, 1500), { base: 10, bonus: 5, total: 15 });
  assert.deepEqual(math.scoreAnswer(true, 13000), { base: 10, bonus: 0, total: 10 });
  assert.deepEqual(math.scoreAnswer(false, 500), { base: 0, bonus: 0, total: 0 });
});

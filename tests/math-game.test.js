'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const math = require('../math-game.js');

test('level 1 creates addition questions in range up to 10', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(1, Math.random);
    assert.equal(question.operator, '+');
    assert.equal(question.answer, question.a + question.b);
    assert.ok(question.answer <= 10);
  }
});

test('level 2 creates addition or subtraction in range up to 10 without negative results', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(2, Math.random);
    assert.ok(['+', '−'].includes(question.operator));
    const expected = question.operator === '+' ? question.a + question.b : question.a - question.b;
    assert.equal(question.answer, expected);
    assert.ok(question.answer >= 0 && question.answer <= 10);
  }
});

test('level 3 creates small multiplication questions', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(3, Math.random);
    assert.equal(question.operator, '×');
    assert.ok(question.a >= 1 && question.a <= 10);
    assert.ok(question.b >= 1 && question.b <= 10);
    assert.equal(question.answer, question.a * question.b);
  }
});

test('level 4 creates exact division questions from small multiplication', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(4, Math.random);
    assert.equal(question.operator, '÷');
    assert.equal(question.a / question.b, question.answer);
    assert.equal(question.a % question.b, 0);
    assert.ok(question.b >= 1 && question.b <= 10);
    assert.ok(question.answer >= 1 && question.answer <= 10);
  }
});

test('level 5 creates large multiplication questions', () => {
  for (let i = 0; i < 200; i++) {
    const question = math.makeQuestion(5, Math.random);
    assert.equal(question.operator, '×');
    assert.ok(question.a >= 11 && question.a <= 20);
    assert.ok(question.b >= 2 && question.b <= 20);
    assert.equal(question.answer, question.a * question.b);
  }
});

test('creates requested question counts and exposes length labels', () => {
  assert.equal(math.questionCounts.short, 5);
  assert.equal(math.questionCounts.medium, 10);
  assert.equal(math.questionCounts.long, 20);
  assert.equal(math.makeQuestions(10, 3, () => 0.4).length, 10);
});

test('fast correct answers receive bonus, wrong answers score zero', () => {
  assert.deepEqual(math.scoreAnswer(true, 1500), { base: 10, bonus: 5, total: 15 });
  assert.deepEqual(math.scoreAnswer(true, 13000), { base: 10, bonus: 0, total: 10 });
  assert.deepEqual(math.scoreAnswer(false, 500), { base: 0, bonus: 0, total: 0 });
});

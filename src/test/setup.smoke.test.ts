// Smoke test — verifies vitest + jest-dom setup works
import { expect, test } from 'vitest';

test('jest-dom matchers are available', () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  expect(el).toBeInTheDocument();
  document.body.removeChild(el);
});

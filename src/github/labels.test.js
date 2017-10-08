import {
  getAllLabels,
  getLabels,
  hasLabel,
  filterIssuesWithLabels,
} from './labels.js';

function makeLabel(labelName) {
  return {
    name: labelName,
  };
}

function makeIssue(labelNames, id = 1) {
  const labels = labelNames.map(makeLabel);
  return {
    id,
    labels,
  };
}

describe('getLabels', () => {
  it('returns the labels of an issue', () => {
    const issue = makeIssue(['bug', 'feature']);
    expect(getLabels(issue)).toEqual(['bug', 'feature']);
  });
  it('returns an empty arry for an issue with no label', () => {
    const issue = makeIssue([]);
    expect(getLabels(issue)).toEqual([]);
  });
});

describe('getAllLabels', () => {
  it('returns the labels of all issues', () => {
    const issues = [
      makeIssue(['feature']),
      makeIssue(['feature', 'bug']),
      makeIssue([]),
    ];
    expect(getAllLabels(issues)).toEqual(['bug', 'feature']);
  });
});

describe('hasLabel', () => {
  it('returns true if the issue has at least one label in the list', () => {
    const issue = makeIssue(['feature']);
    expect(hasLabel(['feature'])(issue)).toBe(true);
    expect(hasLabel(['bug'])(issue)).toBe(false);
    expect(hasLabel([])(issue)).toBe(false);
  });
});

describe('filterIssuesWithLabels', () => {
  it('returns only issues with the specified labels', () => {
    const issues = [
      makeIssue(['feature'], 1),
      makeIssue(['feature', 'bug'], 2),
      makeIssue([], 3),
    ];
    expect(filterIssuesWithLabels(issues, ['bug'])).toEqual([
      makeIssue(['feature', 'bug'], 2),
    ]);
  });
  it('works with no labels', () => {
    const issues = [
      makeIssue(['feature'], 1),
      makeIssue(['feature', 'bug'], 2),
      makeIssue([], 3),
    ];
    expect(filterIssuesWithLabels(issues, [])).toEqual([]);
  });
  it('works with no issues', () => {
    expect(filterIssuesWithLabels([], ['bug'])).toEqual([]);
  });
  it('works with undefined issues', () => {
    expect(filterIssuesWithLabels(undefined, ['bug'])).toEqual([]);
  });
});

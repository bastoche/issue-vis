import {
  getAllLabels,
  getLabels,
  hasLabel,
  filterIssuesWithLabels,
} from './labels.js';

describe('getLabels', () => {
  it('returns the labels of an issue', () => {
    const issue = {
      id: 1,
      labels: [
        {
          name: 'bug',
        },
        {
          name: 'feature',
        },
      ],
    };
    expect(getLabels(issue)).toEqual(['bug', 'feature']);
  });
});

describe('getAllLabels', () => {
  it('returns the labels of all issues', () => {
    const issues = [
      {
        id: 1,
        labels: [
          {
            name: 'feature',
          },
        ],
      },
      {
        id: 2,
        labels: [
          {
            name: 'feature',
          },
          {
            name: 'bug',
          },
        ],
      },
      {
        id: 3,
      },
    ];
    expect(getAllLabels(issues)).toEqual(['bug', 'feature']);
  });
});

describe('hasLabel', () => {
  it('returns true if the issue has at least one label in the list', () => {
    const issue = {
      id: 1,
      labels: [
        {
          name: 'feature',
        },
      ],
    };
    expect(hasLabel(['feature'])(issue)).toBe(true);
    expect(hasLabel(['bug'])(issue)).toBe(false);
    expect(hasLabel([])(issue)).toBe(false);
  });
});

describe('filterIssuesWithLabels', () => {
  it('returns only issues with the specified labels', () => {
    const issues = [
      {
        id: 1,
        labels: [
          {
            name: 'feature',
          },
        ],
      },
      {
        id: 2,
        labels: [
          {
            name: 'feature',
          },
          {
            name: 'bug',
          },
        ],
      },
      {
        id: 3,
      },
    ];
    expect(filterIssuesWithLabels(issues, ['bug'])).toEqual([
      {
        id: 2,
        labels: [
          {
            name: 'feature',
          },
          {
            name: 'bug',
          },
        ],
      },
    ]);
  });
});

import { getAllLabels, getLabels } from './labels.js';

describe('getLabels', () => {
  it.skip('returns the labels of an issue', () => {
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

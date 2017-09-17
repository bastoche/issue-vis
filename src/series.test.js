import {
  countByCreationDay,
  getCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';

describe('countByCreationDay', () => {
  it('works with no issues', () => {
    const issues = [];
    expect(countByCreationDay(issues)).toEqual({});
  });
  it('works with several issues', () => {
    const issues = [
      {
        id: 1,
        created_at: '2011-04-22T13:33:48Z',
      },
      {
        id: 2,
        created_at: '2011-04-22T14:33:48Z',
      },
      {
        id: 3,
        created_at: '2011-04-23T14:33:48Z',
      },
    ];
    expect(countByCreationDay(issues)).toEqual({
      '2011-04-22': 2,
      '2011-04-23': 1,
    });
  });
});

describe('getCreationDay', () => {
  it('returns the creation day of an issue', () => {
    const issue = {
      id: 1,
      created_at: '2011-04-22T13:33:48Z',
    };
    expect(getCreationDay(issue)).toEqual('2011-04-22');
  });
});

describe('buildSeriesDataFromDatesWithValues', () => {
  it('returns data that can be fed to a series component', () => {
    const datesWithValues = {
      '2011-04-22': 2,
      '2011-04-23': 1,
    };
    expect(buildSeriesDataFromDatesWithValues(datesWithValues)).toEqual([
      { x: 1303423200000, y: 2 },
      { x: 1303509600000, y: 1 },
    ]);
  });
});

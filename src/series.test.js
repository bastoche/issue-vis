import {
  countByCreationDay,
  getCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';

import { startOfDay, getTime } from 'date-fns';

function makeIssue(createdAt) {
  return {
    created_at: createdAt,
  };
}

describe('getCreationDay', () => {
  it('returns the creation day of an issue', () => {
    const date = '2011-04-22T13:33:48Z';
    const issue = makeIssue(date);
    expect(getCreationDay(issue)).toEqual(getTime(startOfDay(date)));
  });
});

describe('countByCreationDay', () => {
  it('works with no issues', () => {
    expect(countByCreationDay([])).toEqual({});
  });

  it('works with several issues', () => {
    const issues = [
      makeIssue('2011-04-22T13:33:48Z'),
      makeIssue('2011-04-22T14:33:48Z'),
      makeIssue('2011-04-23T14:33:48Z'),
    ];
    const firstDay = getTime(startOfDay('2011-04-22T13:33:48Z'));
    const secondDay = getTime(startOfDay('2011-04-23T14:33:48Z'));
    expect(countByCreationDay(issues)).toEqual({
      [firstDay]: 2,
      [secondDay]: 1,
    });
  });

  it('fills empty days with 0', () => {
    const issues = [
      makeIssue('2011-04-22T13:33:48Z'),
      makeIssue('2011-04-22T14:33:48Z'),
      makeIssue('2011-04-24T14:33:48Z'),
    ];
    const firstDay = getTime(startOfDay('2011-04-22T13:33:48Z'));
    const secondDay = getTime(startOfDay('2011-04-23T14:33:48Z'));
    const thirdDay = getTime(startOfDay('2011-04-24T14:33:48Z'));
    expect(countByCreationDay(issues)).toEqual({
      [firstDay]: 2,
      [secondDay]: 0,
      [thirdDay]: 1,
    });
  });
});

describe('buildSeriesDataFromDatesWithValues', () => {
  it('returns data that can be fed to a series component', () => {
    const firstDay = getTime(startOfDay('2011-04-22T13:33:48Z'));
    const secondDay = getTime(startOfDay('2011-04-23T14:33:48Z'));
    const datesWithValues = {
      [firstDay]: 2,
      [secondDay]: 1,
    };
    expect(buildSeriesDataFromDatesWithValues(datesWithValues)).toEqual([
      { x: Number(firstDay), y: 2 },
      { x: Number(secondDay), y: 1 },
    ]);
  });
  it('works with empty data', () => {
    expect(buildSeriesDataFromDatesWithValues({})).toEqual([]);
  });
});

import {
  countByCreationDay,
  getCreationDay,
  buildSeriesDataFromDatesWithValues,
} from './series.js';

import { startOfDay, getTime, parse } from 'date-fns';

describe('getCreationDay', () => {
  it('returns the creation day of an issue', () => {
    const date = '2011-04-22T13:33:48Z';
    const issue = {
      id: 1,
      created_at: date,
    };
    expect(getCreationDay(issue)).toEqual(getTime(startOfDay(date)));
  });
});

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
    const firstDay = getTime(startOfDay('2011-04-22T13:33:48Z'));
    const secondDay = getTime(startOfDay('2011-04-23T14:33:48Z'));
    expect(countByCreationDay(issues)).toEqual({
      [firstDay]: 2,
      [secondDay]: 1,
    });
  });
});

describe('buildSeriesDataFromDatesWithValues', () => {
  it('returns data that can be fed to a series component', () => {
    const firstDay = getTime(startOfDay(parse('2011-04-22T13:33:48Z')));
    const secondDay = getTime(startOfDay(parse('2011-04-23T14:33:48Z')));
    const datesWithValues = {
      [firstDay]: 2,
      [secondDay]: 1,
    };
    expect(buildSeriesDataFromDatesWithValues(datesWithValues)).toEqual([
      { x: Number(firstDay), y: 2 },
      { x: Number(secondDay), y: 1 },
    ]);
  });
});

import {
  buildSeriesDataFromDatesWithValues,
  countByCreationDay,
  cumulatedCount,
  getAllDaysBetweenIssues,
  getClosedDay,
  getCreationDay,
} from './series.js';

import { startOfDay, getTime } from 'date-fns';

function issue(createdAt, closedAt = null) {
  return {
    created_at: createdAt,
    closed_at: closedAt,
  };
}

function day(day) {
  return `2011-04-${day}T13:33:48Z`;
}

describe('getCreationDay', () => {
  it('returns the day an issue was created', () => {
    expect(getCreationDay(issue(day(22)))).toEqual(
      getTime(startOfDay(day(22)))
    );
  });
});

describe('getClosedDay', () => {
  it('returns the day an issue was closed', () => {
    expect(getClosedDay(issue(day(22), day(24)))).toEqual(
      getTime(startOfDay(day(24)))
    );
  });
});

describe('getAllDaysBetweenIssues', () => {
  it('returns each day between the earlier and the last creation dates', () => {
    const issues = [issue(day(22)), issue(day(24))];
    expect(getAllDaysBetweenIssues(issues)).toEqual([
      startOfDay(day(22)),
      startOfDay(day(23)),
      startOfDay(day(24)),
    ]);
  });
  it('works with no date', () => {
    expect(getAllDaysBetweenIssues([])).toEqual([]);
  });
});

describe('countByCreationDay', () => {
  it('works with no issues and no days', () => {
    expect(countByCreationDay([], [])).toEqual({});
  });

  it('works with several issues', () => {
    const issues = [issue(day(22)), issue(day(22)), issue(day(23))];
    const firstDay = getTime(startOfDay(day(22)));
    const secondDay = getTime(startOfDay(day(23)));
    const thirdDay = getTime(startOfDay(day(24)));
    expect(
      countByCreationDay(issues, [firstDay, secondDay, thirdDay])
    ).toEqual({
      [firstDay]: 2,
      [secondDay]: 1,
      [thirdDay]: 0,
    });
  });
});

describe('buildSeriesDataFromDatesWithValues', () => {
  it('returns data that can be fed to a series component', () => {
    const firstDay = getTime(startOfDay(day(22)));
    const secondDay = getTime(startOfDay(day(23)));
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

describe('cumulatedCount', () => {
  it('works with no issues and no days', () => {
    expect(cumulatedCount([], [])).toEqual({});
  });
  it('works with one issue', () => {
    const issues = [issue(day(22), day(25)), issue(day(23), day(24))];
    const firstDay = getTime(startOfDay(day(22)));
    const secondDay = getTime(startOfDay(day(23)));
    const thirdDay = getTime(startOfDay(day(24)));
    const fourthDay = getTime(startOfDay(day(25)));
    expect(
      cumulatedCount(issues, [firstDay, secondDay, thirdDay, fourthDay])
    ).toEqual({
      [firstDay]: 1,
      [secondDay]: 2,
      [thirdDay]: 1,
      [fourthDay]: 0,
    });
  });
});

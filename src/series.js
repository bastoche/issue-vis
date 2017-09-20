import { startOfDay, addDays, getTime, parse, eachDay } from 'date-fns';
import R from 'ramda';

export function countByCreationDay(issues, days) {
  if (issues.length === 0) {
    return {};
  }
  const datesWithZeroAsValues = getDatesWithZeroAsValues(days);
  const addDay = (datesWithValues, day) =>
    R.assoc(getTime(day), datesWithValues[getTime(day)] + 1, datesWithValues);
  const datesWithValues = R.reduce(
    addDay,
    datesWithZeroAsValues,
    R.map(getCreationDay, issues)
  );
  return datesWithValues;
}

export function cumulatedCount(issues, days) {
  if (issues.length === 0) {
    return {};
  }
  const datesWithZeroAsValues = getDatesWithZeroAsValues(days);
  const addDay = (datesWithValues, day) =>
    R.assoc(getTime(day), datesWithValues[getTime(day)] + 1, datesWithValues);
  const creationDays = R.reduce(
    addDay,
    datesWithZeroAsValues,
    R.map(getCreationDay, issues)
  );
  const removeDay = (datesWithValues, day) =>
    R.assoc(getTime(day), creationDays[getTime(day)] - 1, datesWithValues);
  const deltaDays = R.reduce(
    removeDay,
    creationDays,
    R.map(getClosedDay, issues)
  );

  const result = datesWithZeroAsValues;
  const addDeltaDay = day => {
    const previousDay = getTime(addDays(day, -1));
    const cumulatedDelta = (result[previousDay] || 0) + deltaDays[day];
    result[day] = cumulatedDelta;
  };
  R.forEach(addDeltaDay, days);

  return result;
}

export function getAllDaysBetweenIssues(issues) {
  if (issues.length === 0) {
    return [];
  }
  const issuesCreationDates = R.map(parseIssueCreationDate, issues);
  const firstIssueDate = parseIssueCreationDate(issues[0]);
  const minDay = R.reduce(R.min, firstIssueDate, issuesCreationDates);
  const maxDay = R.reduce(R.max, firstIssueDate, issuesCreationDates);
  return eachDay(minDay, maxDay);
}

function getDatesWithZeroAsValues(days) {
  const addZero = (datesWithValues, day) =>
    R.assoc(getTime(day), 0, datesWithValues);
  return R.reduce(addZero, {}, days);
}

export function getCreationDay(issue) {
  return getTime(startOfDay(issue.created_at));
}

export function getClosedDay(issue) {
  return getTime(startOfDay(issue.closed_at));
}

function parseIssueCreationDate(issue) {
  return parse(issue.created_at);
}

export function buildSeriesDataFromDatesWithValues(datesWithValues) {
  const functor = pair => makeSeriesObject(pair[0], pair[1]);
  return R.map(functor, R.toPairs(datesWithValues));
}

function makeSeriesObject(key, value) {
  return { x: Number(key), y: value };
}

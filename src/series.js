import { startOfDay, getTime, parse, eachDay } from 'date-fns';
import R from 'ramda';

export function countByCreationDay(issues) {
  if (issues.length === 0) {
    return {};
  }
  const datesWithZeroAsValues = getDatesWithZeroAsValues(
    getAllDaysBetweenIssues(issues)
  );
  const addDay = (datesWithValues, day) =>
    R.assoc(getTime(day), datesWithValues[getTime(day)] + 1, datesWithValues);
  const datesWithValues = R.reduce(
    addDay,
    datesWithZeroAsValues,
    R.map(getCreationDay, issues)
  );
  return datesWithValues;
}

function getAllDaysBetweenIssues(issues) {
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

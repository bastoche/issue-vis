import { startOfDay, getTime, parse, eachDay } from 'date-fns';
import R from 'ramda';

export function countByCreationDay(issues) {
  if (issues.length === 0) {
    return {};
  }
  const firstIssueDate = parseIssueCreatedDate(issues[0]);
  const minDay = R.reduce(
    R.min,
    firstIssueDate,
    R.map(parseIssueCreatedDate, issues)
  );
  const maxDay = R.reduce(
    R.max,
    firstIssueDate,
    R.map(parseIssueCreatedDate, issues)
  );
  const datesWithValues = {};
  const days = eachDay(minDay, maxDay);
  R.forEach(day => (datesWithValues[getTime(day)] = 0), days);
  R.forEach(issue => {
    const creationDay = getCreationDay(issue);
    datesWithValues[creationDay] += 1;
  }, issues);
  return datesWithValues;
}

export function getCreationDay(issue) {
  const date = parseIssueCreatedDate(issue);
  return getTime(startOfDay(date));
}

function parseIssueCreatedDate(issue) {
  return parse(issue.created_at);
}

export function buildSeriesDataFromDatesWithValues(datesWithValues) {
  const functor = pair => makeSeriesObject(pair[0], pair[1]);
  return R.map(functor, R.toPairs(datesWithValues));
}

function makeSeriesObject(key, value) {
  return { x: Number(key), y: value };
}

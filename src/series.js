import { startOfDay, getTime, parse } from 'date-fns';
import R from 'ramda';

export function countByCreationDay(issues) {
  return R.countBy(getCreationDay)(issues);
}

export function getCreationDay(issue) {
  const date = parse(issue.created_at);
  return getTime(startOfDay(date));
}

export function buildSeriesDataFromDatesWithValues(datesWithValues) {
  const functor = pair => makeSeriesObject(pair[0], pair[1]);
  return R.map(functor, R.toPairs(datesWithValues));
}

function makeSeriesObject(key, value) {
  return { x: Number(key), y: value };
}

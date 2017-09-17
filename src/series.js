import { getTime, format, parse } from 'date-fns';
import R from 'ramda';

export function countByCreationDay(issues) {
  return R.countBy(getCreationDay)(issues);
}

export function getCreationDay(issue) {
  const date = parse(issue.created_at);
  return format(date, 'YYYY-MM-DD');
}

export function buildSeriesDataFromDatesWithValues(datesWithValues) {
  return R.map(key => {
    return makeSeriesObject(getTime(parse(key)), datesWithValues[key]);
  }, R.keys(datesWithValues));
}

function makeSeriesObject(key, value) {
  return { x: key, y: value };
}

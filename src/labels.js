import R from 'ramda';

export function getLabels(issue) {
  if (issue.labels) {
    return R.map(label => label.name, issue.labels);
  }
  return [];
}

export function getAllLabels(issues) {
  return R.sortBy(R.toLower, R.uniq(R.chain(getLabels, issues)));
}

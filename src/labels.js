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

export function filterIssuesWithLabels(issues, labels) {
  return R.filter(hasLabel(labels), issues);
}

export function hasLabel(labels) {
  return issue => !R.isEmpty(R.intersection(labels, getLabels(issue)));
}

import parse from 'parse-link-header';

export function fetchIssues(url) {
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  headers.append(
    'Authorization',
    `token ${process.env.REACT_APP_GITHUB_TOKEN}`
  );
  return fetch(url, {
    headers,
  }).then(response => {
    return response.json().then(issues => {
      return {
        issues,
        next: getNextPage(response.headers.get('Link')),
      };
    });
  });
}

export function getNextPage(linkHeader) {
  const parsed = parse(linkHeader);
  if (parsed && parsed.next) {
    return parsed.next.url;
  }
  return null;
}

import parse from 'parse-link-header';

export function fetchIssues(token) {
  return url => {
    const headers = new Headers();
    headers.append('Accept', 'application/vnd.github.v3+json');
    headers.append('Authorization', `token ${token}`);
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
  };
}

export function fetchAllIssues(url, fetchIssues, onIssuesFetched) {
  return fetchIssues(url).then(result => {
    const { issues, next } = result;
    onIssuesFetched(issues);
    if (next) {
      return fetchAllIssues(next, fetchIssues, onIssuesFetched);
    }
    return issues;
  });
}

export function getNextPage(linkHeader) {
  const parsed = parse(linkHeader);
  if (parsed && parsed.next) {
    return parsed.next.url;
  }
  return null;
}

export function issuesUrl(repository) {
  return `https://api.github.com/repos/${repository}/issues?state=all`;
}

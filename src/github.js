export function fetchIssues() {
  const headers = new Headers();
  headers.append('Accept', 'application/vnd.github.v3+json');
  headers.append(
    'Authorization',
    `token ${process.env.REACT_APP_GITHUB_TOKEN}`
  );
  return fetch(
    `https://api.github.com/repos/${process.env
      .REACT_APP_REPOSITORY}/issues?per_page=100`,
    {
      headers,
    }
  ).then(response => {
    return response.json();
  });
}

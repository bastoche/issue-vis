import { getNextPage, fetchAllIssues, issuesUrl } from './issues.js';

describe('getNextPage', () => {
  it('returns the next page from a link header if it exists', () => {
    const linkHeader =
      '<https://api.github.com/repositories/52462870/issues?page=2>; rel="next", <https://api.github.com/repositories/52462870/issues?page=3>; rel="last"';
    expect(getNextPage(linkHeader)).toEqual(
      'https://api.github.com/repositories/52462870/issues?page=2'
    );
  });

  it('returns null if there is no next page', () => {
    const linkHeader =
      '<https://api.github.com/repositories/52462870/issues?page=3>; rel="last"';
    expect(getNextPage(linkHeader)).toBeNull();
  });

  it('returns null if the link header is empty or null', () => {
    expect(getNextPage('')).toBeNull();
    expect(getNextPage(null)).toBeNull();
  });
});

describe('fetchAllIssues', () => {
  it('fetches issues', () => {
    const fetchIssues = url =>
      Promise.resolve({ issues: ['issue1', 'issue2'] });
    return fetchAllIssues('url', fetchIssues, () => {}).then(fetchedIssues => {
      expect(fetchedIssues).toEqual(['issue1', 'issue2']);
    });
  });

  it('fetches next issues if the first fetch returns a next url', () => {
    const fetchIssues = jest.fn();
    fetchIssues
      .mockReturnValueOnce(
        Promise.resolve({ issues: ['issue1', 'issue2'], next: 'nextUrl' })
      )
      .mockReturnValueOnce(Promise.resolve({ issues: ['issue3', 'issue4'] }));

    return fetchAllIssues('url', fetchIssues, () => {}).then(fetchedIssues => {
      expect(fetchedIssues).toEqual(['issue3', 'issue4']);
    });
  });
});

describe('issuesUrl', () => {
  it('returns the url of the github api for issues of the specified repository', () => {
    expect(issuesUrl('my_repository')).toEqual(
      'https://api.github.com/repos/my_repository/issues?state=all&since=2017-08-01T00:00:00Z'
    );
  });
});

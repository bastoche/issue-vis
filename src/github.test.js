import { getNextPage } from './github.js';

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

import { removeTailingSlash } from './remove-tailing-slash';

describe('removeTailingSlash helper function', () => {

  it('should accept a call without arguments', () => {
    expect(removeTailingSlash()).toBe('');
  });

  it('should remove multiple tailing slashes', () => {
    const str = '/www./heloł/.com///';
    const expected = '/www./heloł/.com';
    expect(removeTailingSlash(str)).toBe(expected);
  });

});

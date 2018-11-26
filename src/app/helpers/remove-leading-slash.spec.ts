import { removeLeadingSlash } from './remove-leading-slash';

describe('removeLeadingSlash helper function', () => {

  it('should accept a call without arguments', () => {
    expect(removeLeadingSlash()).toEqual('');
  });

  it('should remove multiple leading slashes', () => {
    const str = '////www./heloł/.com//';
    const expected = 'www./heloł/.com//';
    expect(removeLeadingSlash(str)).toBe(expected);
  });

});

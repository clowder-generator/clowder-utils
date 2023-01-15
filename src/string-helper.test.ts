import { assertNotBlank, isBlank, StringAssertionError } from './string-helper';

describe('isBlank', () => {
    test.each([
        [undefined, true],
        [null, true],
        ['', true],
        [' ', true],
        ['  ', true],
        ['\t', true],
        ['\n', true],
        ['\t\n\t ', true],
        ['a', false]
    ])(
        'isBlank(%s)',
        (str: string | undefined | null, expected: boolean) => {
            expect(isBlank(str)).toBe(expected);
        }
    );
});

describe('assertNotBlank', () => {
    test.each([
        [undefined, true],
        [null, true],
        ['', true],
        [' ', true],
        ['  ', true],
        ['\t', true],
        ['\n', true],
        ['\t\n\t ', true],
        ['a', false]
    ])(
        'assertNotBlank(%s)',
        (str: string | undefined | null, errorExpected: boolean) => {
            let exception: Error | undefined;
            try {
                assertNotBlank(str);
            } catch (error: unknown) {
                exception = error as Error;
            }

            if (errorExpected) {
                expect(exception).not.toBeUndefined();
                expect(exception).toBeInstanceOf(StringAssertionError);
                expect(exception?.message).toBe('The given string is blank or undefined');
            } else {
                expect(exception).toBeUndefined();
            }
        }
    );
});

import { StringAssertionError } from './exceptions';

/**
 * Check if the given parameter is a blank string or undefined/null
 * @returns  - true if the string is blank (whitespace only or no char) or
 *             if it is undefined or null.
 *           - Return false otherwise
 *
 * @param str: the string you want to check
 */
export const isBlank = (str: string | undefined | null): boolean => {
    return (!str || /^\s*$/.test(str));
};

/**
 * Assert that the given parameter is not a blank or undefined/null string
 * @throws StringAssertionError if the string is blank or undefined/null
 *
 * @param str: the string you want to assert that it is not blank or undefined/null
 */
export const assertNotBlank = (str: string | undefined | null): void => {
    if (isBlank(str)) {
        throw new StringAssertionError('The given string is blank or undefined');
    }
};

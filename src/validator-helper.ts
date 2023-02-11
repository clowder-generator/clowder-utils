import {
    camelCaseRegex,
    kebabCaseRegex,
    pascalCaseRegex,
    screamingKebabCaseRegex,
    screamingSnakeCaseRegex,
    snakeCaseRegex
} from './case-helper';

/**
 * Type representing a validation function for yeoman or inquirer.js.
 * A validation function is a function that take a string as argument
 * and return either a Promise<true> if the function application on
 * the input is valid, or a Promise<string> if not. If not valid,
 * the string should contain an explanation on why it is not valid.
 */
export type stringValidationFunction = (input: string) => Promise<true | string>;

/**
 * Options to pass to `validateWith` in order to transform the input before applying the
 * a validation function, or to alter the error message to display in case of invalid input
 */
export interface ValidationOption {
    /**
     * Defines if the input should be trimmed of white spaces
     * before applying a validation function. If not defined,
     * the input will not be trimmed.
     */
    trimmed?: boolean;

    /**
     * Define what will be the error message to display in case of
     * invalid input. If not defined, there will not be a global error.
     */
    globalErrorMessage?: string;

    /**
     * Define if the displayed error message should be displayed
     * when a global error message is defined. If not set,
     * or if global error message is not set, then the
     * original error message will be displayed.
     */
    hideRootCause?: boolean;
}

const globalErrorMessageOnly = (validationOption: ValidationOption | undefined): boolean => {
    return validationOption?.globalErrorMessage !== undefined &&
        validationOption.hideRootCause === true;
};
const globalAndDefaultErrorMessage = (validationOption: ValidationOption | undefined): boolean => {
    return validationOption !== undefined && (
        validationOption.globalErrorMessage !== undefined &&
        validationOption.hideRootCause !== true
    );
};

/**
 * validateWith
 *
 * Higher order function that will apply all the given validation function on the input
 * and will format the error message, if any, according to the validationOption.
 *
 * @param funcs: a list of validation function to apply on the input
 * @param opt: an optional parameter to format the input before applying the functions or
 *             to format the error if any
 *
 * @return a new stringValidationFunction that will the the composition of all the validation functions
 *         given into parameter
 */
export const validateWith = (funcs: stringValidationFunction[], opt?: ValidationOption): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        const transformedInput = opt?.trimmed ? input.trim() : input;

        for (const fun of funcs) {
            const result: true | string = await fun(transformedInput);
            if (typeof result === 'string') {
                if (globalErrorMessageOnly(opt)) {
                    return format((opt as ValidationOption).globalErrorMessage as string, transformedInput);
                } else if (globalAndDefaultErrorMessage(opt)) {
                    return `${format((opt as ValidationOption).globalErrorMessage as string, transformedInput)} Cause: ${result}`.trimStart();
                } else { // then default error message only
                    return result;
                }
            }
        }
        return true;
    };
};

/**
 * shouldMatchRegexValidation
 *
 *  Higher order function that return a stringValidationFunction validating if the input match the given regex
 *
 * @param regex: the regex to match fo the stringValidationFunction to return true
 * @param errorMessageFormat: optional. The error to display if it does not match. Use %s in the error string
 *                            to display the input in the error message.
 *
 * @return a stringValidationFunction that test if the input match the regex.
 */
export const shouldMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!regex.test(input)) {
            return formatWithDefault(errorMessageFormat, input,
                `The input "${input}" should match the regex ${regex.toString()}.`
            );
        }

        return true;
    };
};

/**
 * shouldNotMatchRegexValidation
 *
 * Higher order function that take a regex in parameter and return a stringValidationFunction that
 * test that its input does not match the regex.
 *
 * @param regex: the regex that should not be matched by the input
 * @param errorMessageFormat: optional. An error message to display if the input match the regex. Use %s in the error
 *                            string to display the input in the error message.
 *
 * @return a stringValidationFunction that test if the input does not match the regex
 */
export const shouldNotMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (regex.test(input)) {
            return formatWithDefault(errorMessageFormat, input,
                `The input "${input}" should not match the regex ${regex.toString()}.`
            );
        }

        return true;
    };
};

/**
 * nonBlankValidation
 *
 * Higher order function. The resulting function verify that its input is not a blank string. If it is, it
 * will return the given error message
 *
 * @param errorMessage: optional. An error message to display if the input is blank. Use %s in the error string
 *                      to display the input in the error message.
 *
 * @return a stringValidationFunction that test that its input is not blank.
 */
export const nonBlankValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\s*$/.test(input)) {
            return formatWithDefault(errorMessage, input, `"${input}" is blank. Only word which are not blank are expected.`);
        }

        return true;
    };
};

/**
 * noWhiteSpaceValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * does not contain white spaces.
 *
 * @param errorMessage: optional. An error to display if the input contains white chars. Use %s in the error string
 *                      to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input does not contain a white char.
 */
export const noWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/\s/.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" contains white chars. Only word with no white char are allowed.`
            );
        }

        return true;
    };
};

/**
 * doNotStartWithNumberValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * does not start with a number.
 *
 * @param errorMessage: optional. An error to display if the input starts with a number. Use %s in the error string
 *                      to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input does not start with a number.
 */
export const doNotStartWithNumberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\d/.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" starts with a number. Only word with no leading number are expected.`
            );
        }

        return true;
    };
};

/**
 * noTrailingWhiteSpaceValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * does not end with white spaces.
 *
 * @param errorMessage: optional. An error to display if the input end with white chars. Use %s in the error string
 *                      to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input does not end with a white char.
 */
export const noTrailingWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/\s$/.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" contains a trailing blank char. A valid input should not have trailing white space.`
            );
        }

        return true;
    };
};

/**
 * noLeadingWhiteSpaceValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * does not start with white spaces.
 *
 * @param errorMessage: optional. An error to display if the input start with white chars. Use %s in the error string
 *                      to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input does not start with a white char.
 */
export const noLeadingWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\s/.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" contains a leading blank char. A valid input should not have leading white space.`
            );
        }
        return true;
    };
};

/**
 * noInnerWhiteSpaceValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * does not contain white spaces in the middle of the string only (leading and trailing are
 * still allowed).
 *
 * @param errorMessage: optional. An error to display if the input contains white chars in the middle of the string.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input does not contain a white char in the middle of the
 *         string.
 */
export const noInnerWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/\S\s+\S/.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" contains a blank char in the middle. A valid input should not have inner white space.`
            );
        }

        return true;
    };
};

/**
 * kebabCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a kebab case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a kebab case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a kebab case.
 */
export const kebabCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!kebabCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid kebab-case. Only kebab-case inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * screamingKebabCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a screaming kebab case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a screaming kebab case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a screaming kebab case.
 */
export const screamingKebabCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!screamingKebabCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid SCREAMING-KEBAB-CASE. Only SCREAMING-KEBAB-CASE inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * snakeCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a snake case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a snake case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a snake case.
 */
export const snakeCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!snakeCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid snake_case. Only snake_case inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * screamingSnakeCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a screaming snake case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a screaming snake case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a screaming snake case.
 */
export const screamingSnakeCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!screamingSnakeCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid SCREAMING_SNAKE_CASE. Only SCREAMING_SNAKE_CASE inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * camelCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a camel case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a camel case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a camel case.
 */
export const camelCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!camelCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid camelCase. Only camelCase inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * pascalCaseValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * matches a pascal case.
 *
 * @param errorMessage: optional. An error to display if the input does not match a pascal case.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input matches a pascal case.
 */
export const pascalCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!pascalCaseRegex.test(input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a valid PascalCase. Only PascalCase inputs are expected.`
            );
        }

        return true;
    };
};

/**
 * integerValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * is an integer. An integer being define as a number, either positive or negative, with no
 * decimal part.
 *
 * @param errorMessage: optional. An error to display if the input is not an integer.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input is an integer.
 */
export const integerValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return formatWithDefault(errorMessage, input, notAValidNumberFormat(input));
        }

        // Stryker disable next-line UnaryOperator: Here, -input or +input have meaning since we test for isFinite and not on actual value
        if (!Number.isInteger(+input)) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not an integer. Only unformatted finite integers are expected.`
            );
        }

        return true;
    };
};

/**
 * naturalNumberValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * is a natural number. A natural number being define as a strictly positive number (above zero, zero excluded),
 * with no decimal part.
 *
 * @param errorMessage: optional. An error to display if the input is not a natural number.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input is a natural number.
 */
export const naturalNumberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return formatWithDefault(errorMessage, input, notAValidNumberFormat(input));
        }

        // Stryker disable next-line UnaryOperator: Here, -input or +input have meaning since we test for isFinite and not on actual value
        const parsedNumber = +input;
        if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
            return formatWithDefault(errorMessage, input,
                `"${input}" is not a natural number. Only unformatted finite natural numbers are expected.`
            );
        }

        return true;
    };
};

/**
 * numberValidation
 *
 * Higher order function that return a stringValidationFunction checking that its input
 * is a number. To be valid, a number should be finite.
 *
 * @param errorMessage: optional. An error to display if the input is a number.
 *                      Use %s in the error string to display the input in the error message.
 *
 * @return a stringValidationFunction that verify if the input is a number.
 */
export const numberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return formatWithDefault(errorMessage, input, notAValidNumberFormat(input));
        }

        return true;
    };
};

const isFiniteNumber = (input: string): boolean => {
    // Stryker disable next-line UnaryOperator: Here, -input or +input have meaning since we test for isFinite and not on actual value
    return (isFinite(+input));
};

const notAValidNumberFormat = (input: string): string => {
    return `"${input}" is not a valid number. Only unformatted finite numbers are expected.`;
};

const format = (message: string, input: string): string => {
    return message.replace('%s', input);
};

const formatWithDefault = (message: string | undefined, input: string, defaultMessage: string): string => {
    return message !== undefined
        ? format(message, input)
        : defaultMessage;
};

import {
    camelCaseRegex,
    kebabCaseRegex,
    pascalCaseRegex,
    screamingKebabCaseRegex,
    screamingSnakeCaseRegex,
    snakeCaseRegex
} from './case-helper';

export type stringValidationFunction = (input: string) => Promise<true | string>;

export interface ValidationOption {
    trimmed?: boolean;
    globalErrorMessage?: string;
    hideRootCause?: boolean;
}

export const validateWith = (funcs: stringValidationFunction[], opt?: ValidationOption): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        const transformedInput = opt?.trimmed ? input.trim() : input;

        for (const fun of funcs) {
            const result: true | string = await fun(transformedInput);
            if (typeof result === 'string') {
                if (opt?.globalErrorMessage !== undefined && opt?.hideRootCause) {
                    return format(opt.globalErrorMessage, transformedInput);
                }
                if (opt?.globalErrorMessage !== undefined && !opt?.hideRootCause) {
                    return `${format(opt.globalErrorMessage, transformedInput)} Cause: ${result}`.trimStart();
                }
                if (!opt?.globalErrorMessage) {
                    return result;
                }
            }
        }
        return true;
    };
};

export const shouldMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!regex.test(input)) {
            return errorMessageFormat !== undefined
                ? format(errorMessageFormat, input)
                : `The input "${input}" should match the regex ${regex.toString()}.`;
        }

        return true;
    };
};

export const shouldNotMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (regex.test(input)) {
            return errorMessageFormat !== undefined
                ? format(errorMessageFormat, input)
                : `The input "${input}" should not match the regex ${regex.toString()}.`;
        }

        return true;
    };
};

export const nonBlankValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\s*$/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is blank. Only word which are not blank are expected.`;
        }

        return true;
    };
};

export const noWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^.*\s+.*$/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" contains white chars. Only word with no white char are allowed.`;
        }

        return true;
    };
};

export const doNotStartWithNumberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\d.*$/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" starts with a number. Only word with no leading number are expected.`;
        }

        return true;
    };
};

export const noTrailingWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^.*\s$/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" contains a trailing blank char. A valid input should not have trailing white space.`;
        }

        return true;
    };
};

export const noLeadingWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/^\s.*$/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" contains a leading blank char. A valid input should not have leading white space.`;
        }
        return true;
    };
};

export const noInnerWhiteSpaceValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (/.*\S\s+\S.*/.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" contains a blank char in the middle. A valid input should not have inner white space.`;
        }

        return true;
    };
};

export const kebabCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!kebabCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid kebab-case. Only kebab-case inputs are expected.`;
        }

        return true;
    };
};

export const screamingKebabCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!screamingKebabCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid SCREAMING-KEBAB-CASE. Only SCREAMING-KEBAB-CASE inputs are expected.`;
        }

        return true;
    };
};

export const snakeCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!snakeCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid snake_case. Only snake_case inputs are expected.`;
        }

        return true;
    };
};

export const screamingSnakeCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!screamingSnakeCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid SCREAMING_SNAKE_CASE. Only SCREAMING_SNAKE_CASE inputs are expected.`;
        }

        return true;
    };
};

export const camelCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!camelCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid camelCase. Only camelCase inputs are expected.`;
        }

        return true;
    };
};

export const pascalCaseValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!pascalCaseRegex.test(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a valid PascalCase. Only PascalCase inputs are expected.`;
        }

        return true;
    };
};

export const integerValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : notAValidNumberFormat(input);
        }

        // Stryker disable next-line UnaryOperator: Here, -input or +input have meaning since we test for isFinite and not on actual value
        if (!Number.isInteger(+input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not an integer. Only unformatted finite integers are expected.`;
        }

        return true;
    };
};

export const naturalNumberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : notAValidNumberFormat(input);
        }

        // Stryker disable next-line UnaryOperator: Here, -input or +input have meaning since we test for isFinite and not on actual value
        const parsedNumber = +input;
        if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : `"${input}" is not a natural number. Only unformatted finite natural numbers are expected.`;
        }

        return true;
    };
};

export const numberValidation = (errorMessage?: string): stringValidationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!isFiniteNumber(input)) {
            return errorMessage !== undefined
                ? format(errorMessage, input)
                : notAValidNumberFormat(input);
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

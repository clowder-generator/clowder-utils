import {
    camelCaseRegex,
    kebabCaseRegex,
    pascalCaseRegex,
    screamingKebabCaseRegex,
    screamingSnakeCaseRegex,
    snakeCaseRegex
} from './case-helper';

export type validationFunction = (input: string) => Promise<true | string>;
interface ValidationOption {
    trimmed: boolean;
}

export const validateWith = (funcs: validationFunction[], opt?: ValidationOption): validationFunction => {
    return async (input: string): Promise<true | string> => {
        const transformedInput = opt?.trimmed ? input.trim() : input;

        for (const fun of funcs) {
            const result: true | string = await fun(transformedInput);
            if (typeof result === 'string') {
                return result;
            }
        }
        return true;
    };
};

export const shouldMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): validationFunction => {
    return async (input: string): Promise<true | string> => {
        if (!regex.test(input)) {
            return errorMessageFormat
                ? errorMessageFormat.replace('%s', input)
                : `The input "${input}" should match the regex ${regex.toString()}.`;
        }

        return true;
    };
};

export const shouldNotMatchRegexValidation = (regex: RegExp, errorMessageFormat?: string): validationFunction => {
    return async (input: string): Promise<true | string> => {
        if (regex.test(input)) {
            return errorMessageFormat
                ? errorMessageFormat.replace('%s', input)
                : `The input "${input}" should not match the regex ${regex.toString()}.`;
        }

        return true;
    };
};

export const noUndefinedValidation = async (input: string | undefined): Promise<true | string> => {
    if (input === undefined) {
        return 'undefine is not a valid input.';
    }
    return true;
};

export const nonBlankValidation = async (input: string): Promise<true | string> => {
    if (/^\s*$/.test(input)) {
        return `"${input}" is blank. Only word which are not blank are expected.`;
    }

    return true;
};

export const doNotStartWithNumberValidation = async (input: string): Promise<true | string> => {
    if (/^\d+.*$/.test(input)) {
        return `"${input}" starts with a number. Only word with no leading number are expected.`;
    }

    return true;
};

export const noTrailingWhiteSpaceValidation = async (input: string): Promise<true | string> => {
    if (/^.*\s+$/.test(input)) {
        return `"${input}" contains a trailing blank char. A valid input should not have trailing white space.`;
    }

    return true;
};

export const noLeadingWhiteSpaceValidation = async (input: string): Promise<true | string> => {
    if (/^\s+.*$/.test(input)) {
        return `"${input}" contains a leading blank char. A valid input should not have leading white space.`;
    }
    return true;
};

export const noInnerWhiteSpaceValidation = async (input: string): Promise<true | string> => {
    if (/.*\S+\s+\S+.*/.test(input)) {
        return `"${input}" contains a blank char in the middle. A valid input should not have inner white space.`;
    }

    return true;
};

export const kebabCaseValidation = async (input: string): Promise<true | string> => {
    if (!kebabCaseRegex.test(input)) {
        return `"${input}" is not a valid kebab-case. Only kebab-case inputs are expected.`;
    }

    return true;
};

export const screamingKebabCaseValidation = async (input: string): Promise<true | string> => {
    if (!screamingKebabCaseRegex.test(input)) {
        return `"${input}" is not a valid SCREAMING-KEBAB-CASE. Only SCREAMING-KEBAB-CASE inputs are expected.`;
    }

    return true;
};

export const snakeCaseValidation = async (input: string): Promise<true | string> => {
    if (!snakeCaseRegex.test(input)) {
        return `"${input}" is not a valid snake_case. Only snake_case inputs are expected.`;
    }

    return true;
};

export const screamingSnakeCaseValidation = async (input: string): Promise<true | string> => {
    if (!screamingSnakeCaseRegex.test(input)) {
        return `"${input}" is not a valid SCREAMING_SNAKE_CASE. Only SCREAMING_SNAKE_CASE inputs are expected.`;
    }

    return true;
};

export const camelCaseValidation = async (input: string): Promise<true | string> => {
    if (!camelCaseRegex.test(input)) {
        return `"${input}" is not a valid camelCase. Only camelCase inputs are expected.`;
    }

    return true;
};

export const pascalCaseValidation = async (input: string): Promise<true | string> => {
    if (!pascalCaseRegex.test(input)) {
        return `"${input}" is not a valid PascalCase. Only PascalCase inputs are expected.`;
    }

    return true;
};

export const integerValidation = async (input: string): Promise<true | string> => {
    if (!isFiniteNumber(input)) {
        return notAValidNumberFormat(input);
    }

    if (!Number.isInteger(+input)) {
        return `"${input}" is not an integer. Only unformatted finite integers are expected.`;
    }

    return true;
};

export const naturalNumberValidation = async (input: string): Promise<true | string> => {
    if (!isFiniteNumber(input)) {
        return notAValidNumberFormat(input);
    }

    const parsedNumber = +input;
    if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
        return `"${input}" is not a natural number. Only unformatted finite natural numbers are expected.`;
    }

    return true;
};

/**
 * Validate if the given input is a valid number. Validation is done with 'isFinite' and
 * string to number conversion using the unary operator '+'. Hence, every number that
 * is not interpreted as Infinity or NaN is a valid number
 *
 * @param input: the input you want to test
 * @returns: true: if the input is a valid number
 *           string: if the input is not a valid number
 */
export const numberValidation = async (input: string): Promise<true | string> => {
    if (!isFiniteNumber(input)) {
        return notAValidNumberFormat(input);
    }
    return true;
};

const isFiniteNumber = (input: string): boolean => {
    return (isFinite(+input));
};

const notAValidNumberFormat = (input: string): string => {
    return `"${input}" is not a valid number. Only unformatted finite numbers are expected.`;
};

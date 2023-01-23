import {
    camelCaseRegex, kebabCaseRegex,
    pascalCaseRegex, screamingKebabCaseRegex, screamingSnakeCaseRegex, snakeCaseRegex
} from './case-helper';

type validationFunction = (input: string | undefined) => Promise<boolean | string>;
interface ValidationOption {
    trimmed: boolean;
}

export const validateWith = (opt: ValidationOption = { trimmed: true }, ...func: validationFunction[]): validationFunction => {
    return async (_: string | undefined): Promise<boolean> => false;
};

export const noLeadingWhiteSpaceValidation = async (input: string | undefined): Promise<true | string> => {
    if (input === undefined) {
        return 'undefined is not a valid input. Only word with no inner white space are expected.';
    }

    if (/^\s+.*$/.test(input)) {
        return `"${input}" contains a leading blank char. A valid input should not have leading white space.`;
    }
    return true;
};

export const noInnerWhiteSpaceValidation = async (input: string | undefined): Promise<true | string> => {
    if (input === undefined) {
        return 'undefined is not a valid input. Only word with no inner white space are expected.';
    }

    if (/.*\S+\s+\S+.*/.test(input)) {
        return `"${input}" contains a blank char in the middle. A valid input should not have inner white space.`;
    }

    return true;
};

export const kebabCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notKebabCaseMessage = 'is not a valid kebab-case.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only kebab-case inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!kebabCaseRegex.test(input)) {
        return `"${input}" ${notKebabCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const screamingKebabCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notScreamingKebabCaseMessage = 'is not a valid SCREAMING-KEBAB-CASE.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only SCREAMING-KEBAB-CASE inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!screamingKebabCaseRegex.test(input)) {
        return `"${input}" ${notScreamingKebabCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const snakeCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notSnakeCaseMessage = 'is not a valid snake_case.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only snake_case inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!snakeCaseRegex.test(input)) {
        return `"${input}" ${notSnakeCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const screamingSnakeCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notScreamingSnakeCaseMessage = 'is not a valid SCREAMING_SNAKE_CASE.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only SCREAMING_SNAKE_CASE inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!screamingSnakeCaseRegex.test(input)) {
        return `"${input}" ${notScreamingSnakeCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const camelCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notCamelCaseMessage = 'is not a valid camelCase.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only camelCase inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!camelCaseRegex.test(input)) {
        return `"${input}" ${notCamelCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const pascalCaseValidation = async (input: string | undefined): Promise<true | string> => {
    const notPascalCaseMessage = 'is not a valid PascalCase.';
    const notAValidInputMessage = 'is not a valid input.';
    const commonErrorMessage = 'Only PascalCase inputs are expected.';

    if (input === undefined) {
        return `undefined ${notAValidInputMessage} ${commonErrorMessage}`;
    }

    if (!pascalCaseRegex.test(input)) {
        return `"${input}" ${notPascalCaseMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const integerValidation = async (input: string | undefined): Promise<true | string> => {
    const notAnIntegerMessage = 'is not an integer.';
    const notANumberMessage = 'is not a valid number.';
    const commonErrorMessage = 'Only unformatted finite integers are expected.';

    if (input === undefined) {
        return `undefined ${notANumberMessage} ${commonErrorMessage}`;
    }

    if (numberValidationSync(input) !== true) {
        return `"${input}" ${notANumberMessage} ${commonErrorMessage}`;
    }

    if (!Number.isInteger(+input)) {
        return `"${input}" ${notAnIntegerMessage} ${commonErrorMessage}`;
    }

    return true;
};

export const naturalNumberValidation = async (input: string | undefined): Promise<true | string> => {
    const notANaturalNumberMessage = 'is not a natural number.';
    const notANumberMessage = 'is not a valid number.';
    const commonErrorMessage = 'Only unformatted finite natural numbers are expected.';

    if (input === undefined) {
        return `undefined ${notANumberMessage} ${commonErrorMessage}`;
    }

    if (numberValidationSync(input) !== true) {
        return `"${input}" ${notANumberMessage} ${commonErrorMessage}`;
    }

    const parsedNumber = +input;
    if (!Number.isInteger(parsedNumber) || parsedNumber <= 0) {
        return `"${input}" ${notANaturalNumberMessage} ${commonErrorMessage}`;
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
export const numberValidation = async (input: string | undefined): Promise<true | string> => {
    return numberValidationSync(input);
};
const numberValidationSync = (input: string | undefined): true | string => {
    const baseErrorMessage = 'is not a valid number. Only unformatted finite numbers are expected.';

    if (input === undefined) {
        return `undefined ${baseErrorMessage}`;
    }

    if (!isFinite(+input)) {
        return `"${input}" ${baseErrorMessage}`;
    }

    return true;
};

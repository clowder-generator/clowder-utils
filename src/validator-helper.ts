type validationFunction = (input: string | undefined) => Promise<boolean | string>;
interface ValidationOption {
    trimmed: boolean;
}

export const validateWith = (opt: ValidationOption = { trimmed: true }, ...func: validationFunction[]): validationFunction => {
    return async (_: string | undefined): Promise<boolean> => false;
};

export const naturalNumberValidation = async (input: string | undefined): Promise<boolean | string> => {
    // TODO fill in with correct implementation
    return false;
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
export const numberValidation = async (input: string | undefined): Promise<boolean | string> => {
    const baseErrorMessage = 'is not a valid number. Only unformatted finite numbers are expected.';

    if (input === undefined) {
        return `undefined ${baseErrorMessage}`;
    }

    if (!isFinite(+input)) {
        return `"${input}" ${baseErrorMessage}`;
    }

    return true;
};

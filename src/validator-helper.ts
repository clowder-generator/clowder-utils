type validationFunction = (input: string | undefined) => Promise<boolean | string>;

export const validateWith = (...func: validationFunction[]): validationFunction => {
    return async (_: string | undefined): Promise<boolean> => false;
};

export const numberValidation = async (input: string | undefined): Promise<boolean | string> => {
    return true; // TODO: replace with actual implementation
};

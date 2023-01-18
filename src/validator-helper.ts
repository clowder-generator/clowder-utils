type validationFunction = (input: string | undefined) => Promise<boolean | string>;

export const validateWith = (...func: validationFunction[]): validationFunction => {
    return async (_: string | undefined): Promise<boolean> => false;
};

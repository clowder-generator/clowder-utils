import * as fs from 'fs';

export class PathAssertionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, PathAssertionError.prototype);
    }
}

/**
 * Assert that the given path does not exist
 *
 * @param path: the path you on to assert that it does not exist
 * @throws PathAssertionError if the path already exist
 */
export const assertPathDoesNotExist = (path: string): void => {
    if (fs.existsSync(path)) {
        throw new PathAssertionError(`The path '${path}' already exist`);
    }
};

/**
 * Assert that the path does exist and is empty.
 *
 * @param path: the path you want to assert that it is empty. Default to current path.
 * @throws PathAssertionError if the path does not exist (with dedicated message)
 * @throws PathAssertionError if the path is not empty (with dedicated message)
 */
export const assertPathIsEmpty = (path: string = '.'): void => {
    if (!fs.existsSync(path)) {
        throw new PathAssertionError(`The path '${path}' does not exist`);
    }
    if (fs.readdirSync(path).length > 0) {
        throw new PathAssertionError(`The path '${path}' is not empty`);
    }
};

/**
 * Assert if the given path is empty or does not exist.
 *
 * @param path: the path you want to assert that it is empty or if it does not exist
 * @throws PathAssertionError if the path exist and is not empty
 */
export const assertPathDoesNotExistOrIsEmpty = (path: string = '.'): void => {
    if (fs.existsSync(path) && fs.readdirSync(path).length > 0) {
        throw new PathAssertionError(`The path '${path}' exist and is not empty`);
    }
};

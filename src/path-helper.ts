import * as fs from "fs";

export class PathAssertionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, PathAssertionError.prototype);
    }
}

/**
 * Assert that the given path does not exist
 *
 * @param path: the path you on to test if it does not exist
 */
export const assertPathDoesNotExist = (path: string) => {
    if (fs.existsSync(path)) {
        throw new PathAssertionError(`The path '${path}' already exist`);
    }
}

export const assertPathIsEmpty = (path: string = ".") => {
    if (!fs.existsSync(path)){
        throw new PathAssertionError(`The path '${path}' does not exist`);
    }
    if (fs.readdirSync(path).length > 0) {
        throw new PathAssertionError(`The path '${path}' is not empty`);
    }
}

export const assertPathDoesNotExistOrIsEmpty = (path: string = ".") => {
    if (fs.existsSync(path) && fs.readdirSync(path).length > 0) {
        throw new PathAssertionError(`The path '${path}' exist and is not empty`);
    }
}
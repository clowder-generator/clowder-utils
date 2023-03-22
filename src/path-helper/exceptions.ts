export class PathAssertionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, PathAssertionError.prototype);
    }
}

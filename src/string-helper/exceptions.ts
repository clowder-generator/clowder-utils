export class StringAssertionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, StringAssertionError.prototype);
    }
}

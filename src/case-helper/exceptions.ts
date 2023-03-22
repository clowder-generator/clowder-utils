export class CaseConversionError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CaseConversionError.prototype);
    }
}

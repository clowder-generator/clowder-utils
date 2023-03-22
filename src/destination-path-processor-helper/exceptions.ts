export class DestinationPathProcessingError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, DestinationPathProcessingError.prototype);
    }
}

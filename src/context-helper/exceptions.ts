export class TemplateContextMergeConflictError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, TemplateContextMergeConflictError.prototype);
    }
}

export class NoContextToMergeError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NoContextToMergeError.prototype);
    }
}

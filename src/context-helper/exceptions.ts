export class TemplateContextMergeConflictError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, TemplateContextMergeConflictError.prototype);
    }
}

import { ITemplateData } from './yeoman-helper';
import { DestinationPathProcessor } from './destination-path-processor';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor?: () => [string, string | undefined | null] | Array<[string, string | undefined | null]>;
}

export class TemplateContextMergeConflictError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, TemplateContextMergeConflictError.prototype);
    }
}

export const mergeTemplateContext = (mergeStrategy?: MergeTemplateContextStrategy | Context, ...context: Context[]): ITemplateData => {
    return {};
};

export const silentIfSameValue: MergeTemplateContextStrategy = (...entries: any[]): any => {
    return undefined;
};

export const mergeTemplatePath = (...context: Context[]): string | string[] => {
    return '';
};

export const mergeDestinationPathProcessor = (...context: Context[]): DestinationPathProcessor => {
    return undefined;
};

export type MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any) => any;

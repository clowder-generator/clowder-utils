import { ITemplateData } from './yeoman-helper';
import { DestinationPathProcessor } from './destination-path-processor';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor?: () => [string, string | undefined | null] | Array<[string, string | undefined | null]>;
}

const isTemplateContextProvider = (obj: any): obj is Context => {
    return 'templateContext' in obj;
};

export class TemplateContextMergeConflictError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, TemplateContextMergeConflictError.prototype);
    }
}

export const mergeTemplateContext = (mergeStrategy?: MergeTemplateContextStrategy | Context, ...context: Context[]): ITemplateData => {
    const totalTemplateData: ITemplateData[] = isTemplateContextProvider(mergeStrategy)
        ? [mergeStrategy.templateContext(), ...context.map(ctx => ctx.templateContext())]
        : context.map(ctx => ctx.templateContext());
    const merger: MergeTemplateContextStrategy | undefined = isTemplateContextProvider(mergeStrategy) ? undefined : mergeStrategy;
    const finalTemplateContext: ITemplateData = {};
    for (const templateContext of totalTemplateData) {
        for (const key of Object.keys(templateContext)) {
            if (key in finalTemplateContext) {
                if (merger) {
                    try {
                        finalTemplateContext[key] = merger(finalTemplateContext[key], templateContext[key]);
                    } catch (error: unknown) {
                        throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}". cause: ${(error as Error).message}`);
                    }
                } else {
                    throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}".`);
                }
            } else {
                finalTemplateContext[key] = templateContext[key];
            }
        }
    }

    return finalTemplateContext;
};

export const silentIfSameValue: MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any): any => {
    if (firstEntry === secondEntry) {
        return firstEntry;
    } else {
        throw new TemplateContextMergeConflictError(`value are different "${firstEntry}" vs. "${secondEntry}"`);
    }
};

export const mergeTemplatePath = (...context: Context[]): string | string[] => {
    return '';
};

export const mergeDestinationPathProcessor = (...context: Context[]): DestinationPathProcessor => {
    return undefined;
};

export type MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any) => any;

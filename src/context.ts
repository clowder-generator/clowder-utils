import { ITemplateData } from './yeoman-helper';
import { DestinationPathProcessor } from './destination-path-processor';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor?: () => [string, string | undefined | null] | Array<[string, string | undefined | null]>;
}

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

/**
 * merge templateContext from multiple Context applying the given mergeStrategy in case of conflict keys
 * (keys are similar in multiple templateContext).
 * @param mergeStrategy: either a MergeTemplateContextStrategy or a Context.
 *                       If a context, the merge strategy is considered undefined
 *                       and the context is merged with the varargs context.
 * @param context: the contexts, whose templateContext should be merged
 */
export const mergeTemplateContext = (mergeStrategy?: MergeTemplateContextStrategy | Context, ...context: Context[]): ITemplateData => {
    const totalTemplateData: ITemplateData[] = fullTemplateData(mergeStrategy, ...context);
    const merger: MergeTemplateContextStrategy | undefined = mergerResolver(mergeStrategy);
    const finalTemplateContext: ITemplateData = {};
    for (const templateContext of totalTemplateData) {
        for (const key of Object.keys(templateContext)) {
            if (key in finalTemplateContext) {
                finalTemplateContext[key] = applyMergerForKey(merger, key, finalTemplateContext[key], templateContext[key]);
            } else {
                finalTemplateContext[key] = templateContext[key];
            }
        }
    }

    return finalTemplateContext;
};

export class TemplateContextMergeConflictError extends Error {
    constructor(msg?: string) {
        super(msg);
        Object.setPrototypeOf(this, TemplateContextMergeConflictError.prototype);
    }
}

const isTemplateContextProvider = (obj: any): obj is Context => {
    return 'templateContext' in obj;
};

const fullTemplateData = (mergeStrategy?: MergeTemplateContextStrategy | Context, ...context: Context[]): ITemplateData[] => {
    if (isTemplateContextProvider(mergeStrategy)) {
        return [mergeStrategy.templateContext(), ...context.map(ctx => ctx.templateContext())];
    } else {
        return context.map(ctx => ctx.templateContext());
    }
};

const mergerResolver = (mergeStrategy?: MergeTemplateContextStrategy | Context): MergeTemplateContextStrategy | undefined => {
    return isTemplateContextProvider(mergeStrategy) ? undefined : mergeStrategy;
};

const applyMergerForKey = (mergerStrategy: MergeTemplateContextStrategy | undefined, key: string, first: any, second: any): any => {
    if (mergerStrategy) {
        try {
            return mergerStrategy(first, second);
        } catch (error: unknown) {
            throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}". cause: ${(error as Error).message}`);
        }
    } else {
        throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}".`);
    }
};
export type MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any) => any;

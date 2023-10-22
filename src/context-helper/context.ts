import { ITemplateData } from '../yeoman-helper';
import { DestinationPathProcessor } from '../destination-path-processor-helper';
import { isBlank } from '../string-helper';
import { TemplateContextMergeConflictError } from './exceptions';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor: DestinationPathProcessor;
}

export const silentIfSameValue: MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any): any => {
    if (firstEntry === secondEntry) {
        return firstEntry;
    } else {
        throw new TemplateContextMergeConflictError(`value are different "${firstEntry}" vs. "${secondEntry}"`);
    }
};

export class EmptyTemplatePathError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, EmptyTemplatePathError.prototype);
    }
}

export class ContextMerger {
    private mergeTemplateContextStrategy: MergeTemplateContextStrategy | undefined = undefined;
    private readonly contexts: Context[];

    private constructor(...contexts: Context[]) {
        this.contexts = contexts;
    }

    public static of = (...contexts: Context[]): ContextMerger => {
        return new ContextMerger(...contexts);
    };

    public readonly withTemplateMergeStrategy = (mergeTemplateContextStrategy: MergeTemplateContextStrategy): this => {
        this.mergeTemplateContextStrategy = mergeTemplateContextStrategy;
        return this;
    };

    public readonly mergeTemplate = (): ITemplateData => {
        const totalTemplateData: ITemplateData[] = this.contexts.map(ctx => ctx.templateContext());
        const finalTemplateContext: ITemplateData = {};
        for (const templateContext of totalTemplateData) {
            for (const key of Object.keys(templateContext)) {
                if (key in finalTemplateContext) {
                    finalTemplateContext[key] = this._applyMergeTemplateContextStrategyForKey(key, finalTemplateContext[key], templateContext[key]);
                } else {
                    finalTemplateContext[key] = templateContext[key];
                }
            }
        }
        return finalTemplateContext;
    };

    public readonly mergeTemplatePath = (): string[] => {
        this.contexts.forEach(context => {
            const path = context.templatePath();
            if (path instanceof Array<string>) {
                this._assertArrayIsValid(path);
            } else {
                this._assertPathStringIsValid(path);
            }
        });
        const templatePaths: string[] = this.contexts.map(context => context.templatePath()).flat();
        return [...new Set(templatePaths)];
    };

    public readonly mergeDestinationPathProcessor = (): DestinationPathProcessor => {
        const destinationPathProcessors: DestinationPathProcessor[] = this.contexts
            .map(context => context.destinationPathProcessor)
            .filter(processor => processor !== undefined);

        if (destinationPathProcessors.length === 0) {
            return undefined;
        } else {
            return (pathToProcess: string) => {
                let processedPath = pathToProcess;
                for (const processor of destinationPathProcessors) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    processedPath = processor!(processedPath);
                }
                return processedPath;
            };
        }
    };

    private readonly _applyMergeTemplateContextStrategyForKey = (key: string, first: any, second: any): any => {
        if (this.mergeTemplateContextStrategy) {
            try {
                return this.mergeTemplateContextStrategy(first, second);
            } catch (error: unknown) {
                throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}". cause: ${(error as Error).message}`);
            }
        } else {
            throw new TemplateContextMergeConflictError(`Merge conflict for field "${key}".`);
        }
    };

    private readonly _assertArrayIsValid = (array: string[]): void => {
        if ((array.length === 0) || (array.filter(e => isBlank(e)).length !== 0)) {
            throw new EmptyTemplatePathError('invalid empty or blank templatePath');
        }
    };

    private readonly _assertPathStringIsValid = (path: string): void => {
        if (isBlank(path)) {
            throw new EmptyTemplatePathError('invalid empty or blank templatePath');
        }
    };
}

export type MergeTemplateContextStrategy = (firstEntry: any, secondEntry: any) => any;

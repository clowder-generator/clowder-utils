import { ITemplateData } from './yeoman-helper';
import { DestinationPathProcessor } from './destination-path-processor';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor?: () => [string, string | undefined | null] | Array<[string, string | undefined | null]>;
}

export const mergeTemplateContext = (...context: Context[]): ITemplateData | undefined => {
    return undefined;
};

export const mergeTemplatePath = (...context: Context[]): string | string[] => {
    return '';
};

export const mergeDestinationPathProcessor = (...context: Context[]): DestinationPathProcessor => {
    return undefined;
};

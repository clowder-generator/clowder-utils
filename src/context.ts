import { ITemplateData } from './yeoman-helper';
import { DestinationPathProcessor } from './destination-path-processor';

export interface Context {
    templateContext: () => ITemplateData;
    templatePath: () => string | string[];
    destinationPathProcessor?: () => DestinationPathProcessor;
}

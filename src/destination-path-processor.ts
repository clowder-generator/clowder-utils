import * as path from 'path';
import { isBlank } from './string-helper';

/**
 * For yeoman copyOptions, the processDestinationPath is an optional function
 * that will modify the path (as string) of the copied template.
 *
 * Disclaimer: there are no plans to support windows specific path name
 */

type PathNameManipulationFunction = (pathToProcess: string) => string;
export type DestinationPathProcessor = PathNameManipulationFunction | undefined;
export class DestinationPathProcessingError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, DestinationPathProcessingError.prototype);
    }
}

const splitPath = (pathName: string): string[] => {
    const recursiveSplitPath = (remainingPathName: string, accumulator: string[]): string[] => {
        const shorterPathName = path.dirname(remainingPathName);
        if (shorterPathName === remainingPathName) {
            return accumulator;
        } else {
            const leaf = path.basename(remainingPathName);
            return recursiveSplitPath(shorterPathName, [leaf, ...accumulator]);
        }
    };
    return recursiveSplitPath(pathName, []);
};

export const rename = (source: string, target: string | undefined | null): PathNameManipulationFunction => {
    if (isBlank(target)) {
        throw new DestinationPathProcessingError('The replacement target should not be blank');
    }
    return (pathToProcess: string): string => {
        const updatedPathElements = splitPath(pathToProcess)
            .map(pathItem => pathItem === source ? target as string : pathItem);
        return path.join(path.parse(pathToProcess).root, ...updatedPathElements);
    };
};

export const renameAll = (...fromTo: Array<[string, string | undefined | null]>): PathNameManipulationFunction => {
    const invalidBlankTarget = fromTo.find(fromTo => isBlank(fromTo[1]));
    if (invalidBlankTarget !== undefined) {
        throw new DestinationPathProcessingError(`The replacement target should not be blank. Trying to replace "${invalidBlankTarget[0]}"`);
    }
    const replacementValue = (subject: string, ...matchingPatterns: Array<[string, string]>): string => {
        const pattern: [string, string] | undefined = matchingPatterns.find(pattern => pattern[0] === subject);
        return (pattern === undefined)
            ? subject
            : pattern[1];
    };
    return (pathToProcess: string): string => {
        const updatedPathElements = splitPath(pathToProcess)
            .map(pathElement => replacementValue(pathElement, ...fromTo as Array<[string, string]>));
        return path.join(path.parse(pathToProcess).root, ...updatedPathElements);
    };
};

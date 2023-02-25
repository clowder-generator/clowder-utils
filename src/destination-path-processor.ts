import * as path from 'path';

/**
 * For yeoman copyOptions, the processDestinationPath is an optional function
 * that will modify the path (as string) of the copied template.
 *
 * Disclaimer: there are no plans to support windows specific path name
 */

type PathNameManipulationFunction = (pathToProcess: string) => string;

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

export const rename = (source: string, target: string): PathNameManipulationFunction => {
    return (pathToProcess: string): string => {
        const updatedPathElements = splitPath(pathToProcess)
            .map(pathItem => pathItem === source ? target : pathItem);
        return path.join(path.parse(pathToProcess).root, ...updatedPathElements);
    };
};

export const renameAll = (...fromTo: Array<[string, string]>): PathNameManipulationFunction => {
    const replacementValue = (subject: string, ...matchingPatterns: Array<[string, string]>): string => {
        const pattern: [string, string] | undefined = matchingPatterns.find(pattern => pattern[0] === subject);
        return (pattern === undefined)
            ? subject
            : pattern[1];
    };
    return (pathToProcess: string): string => {
        const updatedPathElements = splitPath(pathToProcess)
            .map(pathElement => replacementValue(pathElement, ...fromTo));
        return path.join(path.parse(pathToProcess).root, ...updatedPathElements);
    };
};

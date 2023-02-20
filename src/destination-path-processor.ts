import * as path from 'path';

/**
 * For yeoman copyOptions, the processDestinationPath is an optional function
 * that will modify the path (as string) of the copied template.
 *
 * Disclaimer: there are no plans to support windows specific path name
 */

export class DestinationPathProcessingError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, DestinationPathProcessingError.prototype);
    }
}

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
        if (path.isAbsolute(pathToProcess)) {
            throw new DestinationPathProcessingError('unable to process absolute path. Path should be relative');
        }
        const updatedPathElements = splitPath(pathToProcess)
            .map(item => item === source ? target : item);
        return path.join(...updatedPathElements);
    };
};

export const renameAll = (...fromTo: Array<[string, string]>): PathNameManipulationFunction => {
    return (pathToProcess: string): string => {
        return '';
    };
};

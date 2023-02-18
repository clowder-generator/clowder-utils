import * as path from 'path';

/**
 * For yeoman copyOptions, the processDestinationPath is an optional function
 * that will modify the path (as string) of the copied template.
 *
 * Disclaimer: there are no plans to support windows specific path name
 */

// TODO: reference from generator-kata where it worked
// const _rename = (destinationPath: string): string => {
//     let baseName = path.basename(destinationPath);
//     let dirName = path.dirname(destinationPath);
//
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     baseName = baseName.replace(/kotlinPackageName/g, 'newValue');
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     dirName = dirName.replace(/kotlinPackageName/g, 'newValue');
//     return path.join(dirName, baseName);
// };

type PathNameManipulationFunction = (pathToProcess: string) => string;

// TODO: remove this eslint disabling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        return '';
    };
};

export const renameAll = (): PathNameManipulationFunction => {
    return (pathToProcess: string): string => {
        return '';
    };
};

import * as path from 'path';

/**
 * For yeoman copyOptions, the processDestinationPath is an optional function
 * that will modify the path (as string) of the copied template.
 *
 * Disclaimer: there are no plans to support windows specific path name
 */

// TODO: reference from generator-kata where it worked
export const rename = (destinationPath: string): string => {
    let baseName = path.basename(destinationPath);
    let dirName = path.dirname(destinationPath);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    baseName = baseName.replace(/kotlinPackageName/g, 'newValue');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dirName = dirName.replace(/kotlinPackageName/g, 'newValue');
    return path.join(dirName, baseName);
};

// Disclaimer: all tests will assume they are run on a *nix
// base system. There are no plans to support windows

import { rename } from './destination-path-processor';

describe('rename', () => {
    class Given {
        public readonly pathString: string;
        public readonly nameToReplace: string;
        public readonly newNameForReplacement: string;

        constructor(pathString: string, nameToReplace: string, newNameForReplacement: string) {
            this.pathString = pathString;
            this.nameToReplace = nameToReplace;
            this.newNameForReplacement = newNameForReplacement;
        }
    }

    describe.each([
        [
            'Absolute path, not duplicate on name to replace, name present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'my', 'your'),
            '/this/is/your/folder/with/one/file.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name present in the path',
            new Given('this/is/my/folder/with/one/file.ts', 'my', 'your'),
            'this/is/you/folder/with/one/file.ts'
        ],
        [
            'Absolute path, not duplicate on name to replace, name NOT present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'two', 'three'),
            '/this/is/my/folder/with/one/file.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path',
            new Given('this/is/my/folder/with/one/file.ts', 'two', 'three'),
            'this/is/my/folder/with/one/file.ts'
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('/this/and/this/are/my/folder/with/one/file.ts', 'this', 'that'),
            '/that/and/that/are/my/folder/with/one/file.ts'
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('this/and/this/are/my/folder/with/one/file.ts', 'this', 'that'),
            'that/and/that/are/my/folder/with/one/file.ts'
        ],
        [
            'Absolute path, no duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('/this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your'),
            '/this/is/your/folder/with-additional-my/and/one/myfile.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your'),
            'this/is/your/folder/with-additional-my/and/one/myfile.ts'
        ],
        [
            'Absolute path, no duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('/this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my'),
            '/this/is/my/folder/with-additional-your/and/one/yourfile.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my'),
            'this/is/my/folder/with-additional-your/and/one/yourfile.ts'
        ]
    ])('Given the context %s', (context: string, given: Given, expected: string) => {
        describe('When I call the "rename" HoC o this input and use the resulting function to modify the given path', () => {
            let result: string | undefined;
            beforeEach(() => {
                result = rename(given.nameToReplace, given.newNameForReplacement)(given.pathString);
            });
            afterEach(() => {
                result = undefined;
            });
            test('Then the new path string should not be undefined', () => {
                expect(result).not.toBeUndefined();
            });
            test('Then the resulting new path should be as expected', () => {
                expect(result).toStrictEqual(expected);
            });
        });
    });
});
describe('renameAll', () => {});

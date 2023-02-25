// Disclaimer: all tests will assume they are run on a *nix
// base system. There are no plans to support windows

import {
    rename,
    renameAll
} from './destination-path-processor';

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
            'relative path, not duplicate on name to replace, name present in the path',
            new Given('this/is/my/folder/with/one/file.ts', 'my', 'your'),
            'this/is/your/folder/with/one/file.ts'
        ],
        [
            'Absolute path, not duplicate on name to replace, name present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'my', 'your'),
            '/this/is/your/folder/with/one/file.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path',
            new Given('this/is/my/folder/with/one/file.ts', 'two', 'three'),
            'this/is/my/folder/with/one/file.ts'
        ],
        [
            'Absolute path, not duplicate on name to replace, name NOT present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'two', 'three'),
            '/this/is/my/folder/with/one/file.ts'
        ],
        [
            'relative path, duplicate on name to replace',
            new Given('this/and/this/are/my/folder/with/one/file.ts', 'this', 'that'),
            'that/and/that/are/my/folder/with/one/file.ts'
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('/this/and/this/are/my/folder/with/one/file.ts', 'this', 'that'),
            '/that/and/that/are/my/folder/with/one/file.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your'),
            'this/is/your/folder/with-additional-my/and/one/myfile.ts'
        ],
        [
            'Absolute path, no duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('/this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your'),
            '/this/is/your/folder/with-additional-my/and/one/myfile.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my'),
            'this/is/my/folder/with-additional-your/and/one/yourfile.ts'
        ],
        [
            'Absolute path, no duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('/this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my'),
            '/this/is/my/folder/with-additional-your/and/one/yourfile.ts'
        ]
    ])('Given the context %s', (context: string, given: Given, expected: string) => {
        describe('When I call the "rename" HoF o this input and use the resulting function to modify the given path', () => {
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
describe('renameAll', () => {
    interface FromTo {
        from: string;
        to: string;
    }

    class Given {
        public readonly pathString: string;
        public readonly replaceFromTo: FromTo[];

        constructor(pathString: string, replaceFromTo: FromTo[]) {
            this.pathString = pathString;
            this.replaceFromTo = replaceFromTo;
        }
    }
    describe.each([
        [
            'A relative path and given no duplicate in the path, one name in input, but not present in the path',
            new Given('this/is/my/folder/with/one/file.ts', [{ from: 'your', to: 'whatever' }]),
            'this/is/my/folder/with/one/file.ts'
        ],
        [
            'An absolute path and given no duplicate in the path, one name in input, but not present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', [{ from: 'your', to: 'whatever' }]),
            '/this/is/my/folder/with/one/file.ts'
        ],
        [
            'A relative path and given no duplicate in the path, one name in input, present in the path but as substring',
            new Given('this/is/my/folder/with/one/file.your.ts', [{ from: 'your', to: 'whatever' }]),
            'this/is/my/folder/with/one/file.your.ts'
        ],
        [
            'An absolute path and given no duplicate in the path, one name in input, present in the path but as substring',
            new Given('/this/is/my/folder/with/one/file.your.ts', [{ from: 'your', to: 'whatever' }]),
            '/this/is/my/folder/with/one/file.your.ts'
        ],
        [
            'A relative path and given no duplicate in the path, one name in input, present in the path',
            new Given('this/is/MY/folder/with/one/file.ts', [{ from: 'MY', to: 'YOUR' }]),
            'this/is/YOUR/folder/with/one/file.ts'
        ],
        [
            'An absolute path and given no duplicate in the path, one name in input, present in the path',
            new Given('/this/is/MY/folder/with/one/file.ts', [{ from: 'MY', to: 'YOUR' }]),
            '/this/is/YOUR/folder/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, but not present in the path',
            new Given('this/is/my/folder/and/so/is/this/with/one/file.ts', [{ from: 'two', to: 'whatever' }]),
            'this/is/my/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, but not present in the path',
            new Given('/this/is/my/folder/and/so/is/this/with/one/file.ts', [{ from: 'two', to: 'whatever' }]),
            '/this/is/my/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, present in the path but as substring',
            new Given('this/is/my/folder/and/so/is/this/with/oneOrTwo/file.ts', [{ from: 'Two', to: 'So' }]),
            'this/is/my/folder/and/so/is/this/with/oneOrTwo/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, present in the path but as substring',
            new Given('/this/is/my/folder/and/so/is/this/with/oneOrTwo/file.ts', [{ from: 'Two', to: 'So' }]),
            '/this/is/my/folder/and/so/is/this/with/oneOrTwo/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, present in the path but only one time',
            new Given('this/is/MY/folder/and/so/is/this/with/one/file.ts', [{ from: 'MY', to: 'YOUR' }]),
            'this/is/YOUR/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, present in the path but only one time',
            new Given('/this/is/MY/folder/and/so/is/this/with/one/file.ts', [{ from: 'MY', to: 'YOUR' }]),
            '/this/is/YOUR/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, present in the path but one time as substring, one time as path element',
            new Given('this/is/MY/folder/and/so/is/this/with/one/file.MY.ts', [{ from: 'MY', to: 'YOUR' }]),
            'this/is/YOUR/folder/and/so/is/this/with/one/file.MY.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, present in the path but one time as substring, one time as path element',
            new Given('/this/is/MY/folder/and/so/is/this/with/one/file.MY.ts', [{ from: 'MY', to: 'YOUR' }]),
            '/this/is/YOUR/folder/and/so/is/this/with/one/file.MY.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, present in the path multiple time not as substring',
            new Given('THIS/is/my/folder/and/so/is/THIS/with/one/file.ts', [{ from: 'THIS', to: 'THAT' }]),
            'THAT/is/my/folder/and/so/is/THAT/with/one/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, present in the path multiple time not as substring',
            new Given('/THIS/is/my/folder/and/so/is/THIS/with/one/file.ts', [{ from: 'THIS', to: 'THAT' }]),
            '/THAT/is/my/folder/and/so/is/THAT/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, one name in input, present in the path multiple time not as substring, and as substring',
            new Given('thIS/IS/my/folder/and/so/IS/thIS/with/one/file.ts', [{ from: 'IS', to: 'SHOULD_BE' }]),
            'thIS/SHOULD_BE/my/folder/and/so/SHOULD_BE/thIS/with/one/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, one name in input, present in the path multiple time not as substring, and as substring',
            new Given('/thIS/IS/my/folder/and/so/IS/thIS/with/one/file.ts', [{ from: 'IS', to: 'SHOULD_BE' }]),
            '/thIS/SHOULD_BE/my/folder/and/so/SHOULD_BE/thIS/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, multiple name in input, none present in the path',
            new Given('this/is/my/folder/and/so/is/this/with/one/file.ts', [
                { from: 'java', to: 'ts' },
                { from: 'py', to: 'ts' },
                { from: 'kt', to: 'ts' }
            ]),
            'this/is/my/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'An absolute path and given some duplicate in the path, multiple name in input, none present in the path',
            new Given('/this/is/my/folder/and/so/is/this/with/one/file.ts', [
                { from: 'java', to: 'ts' },
                { from: 'py', to: 'ts' },
                { from: 'kt', to: 'ts' }
            ]),
            '/this/is/my/folder/and/so/is/this/with/one/file.ts'
        ],
        [
            'A relative path and given some duplicate in the path, multiple name in input, some present in the path but as substrings',
            new Given('this/is/my/folder/and/so/is/this/with/one/file.TS', [
                { from: 'TS', to: 'whatever' },
                { from: 'java', to: 'whatever' },
                { from: 'kt', to: 'whatever' }
            ]),
            'this/is/my/folder/and/so/is/this/with/one/file.TS'
        ],
        [
            'An absolute path and given some duplicate in the path, multiple name in input, some present in the path but as substrings',
            new Given('/this/is/my/folder/and/so/is/this/with/one/file.TS', [
                { from: 'TS', to: 'whatever' },
                { from: 'java', to: 'whatever' },
                { from: 'kt', to: 'whatever' }
            ]),
            '/this/is/my/folder/and/so/is/this/with/one/file.TS'
        ],
        [
            'A relative path and given some duplicate in the path, multiple name in input, some present in the path as path element and as substring, others not present in the path',
            new Given('thIS/IS/MY/folder/and/so/IS/thIS/with/one/file.TS', [
                { from: 'IS', to: 'SHOULD_BE' },
                { from: 'TS', to: 'JAVA' },
                { from: 'MY', to: 'YOUR' },
                { from: 'kt', to: 'whatever' }
            ]),
            'thIS/SHOULD_BE/YOUR/folder/and/so/SHOULD_BE/thIS/with/one/file.TS'
        ],
        [
            'An absolute path and given some duplicate in the path, multiple name in input, some present in the path as path element and as substring, others not present in the path',
            new Given('/thIS/IS/MY/folder/and/so/IS/thIS/with/one/file.TS', [
                { from: 'IS', to: 'SHOULD_BE' },
                { from: 'TS', to: 'JAVA' },
                { from: 'MY', to: 'YOUR' },
                { from: 'kt', to: 'whatever' }
            ]),
            '/thIS/SHOULD_BE/YOUR/folder/and/so/SHOULD_BE/thIS/with/one/file.TS'
        ]
    ])('Given the context "%s"', (context: string, given: Given, expected: string) => {
        describe('When I call the "renameAll" HoF on this input and use the resulting function to modify the given path', () => {
            let result: string | undefined;
            beforeEach(() => {
                const fromToReplacements = given.replaceFromTo.map(fromTo => [fromTo.from, fromTo.to] as [string, string]);
                result = renameAll(...fromToReplacements)(given.pathString);
            });
            afterEach(() => {
                result = undefined;
            });
            test('Then the result should not be undefined', () => {
                expect(result).not.toBeUndefined();
            });
            test('Then the transformed path should be as expected', () => {
                expect(result).toStrictEqual(expected);
            });
        });
    });
});

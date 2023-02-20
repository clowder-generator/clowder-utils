// Disclaimer: all tests will assume they are run on a *nix
// base system. There are no plans to support windows

import {
    DestinationPathProcessingError,
    rename, renameAll
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
            'relative path, not duplicate on name to replace, name NOT present in the path',
            new Given('this/is/my/folder/with/one/file.ts', 'two', 'three'),
            'this/is/my/folder/with/one/file.ts'
        ],
        [
            'relative path, duplicate on name to replace',
            new Given('this/and/this/are/my/folder/with/one/file.ts', 'this', 'that'),
            'that/and/that/are/my/folder/with/one/file.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your'),
            'this/is/your/folder/with-additional-my/and/one/myfile.ts'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my'),
            'this/is/my/folder/with-additional-your/and/one/yourfile.ts'
        ]
    ])('Given the context %s', (context: string, given: Given, expected: string) => {
        describe('When I call the "rename" HoF o this input and use the resulting function to modify the given path', () => {
            let result: string | undefined;
            let exception: Error | undefined;
            beforeEach(() => {
                try {
                    result = rename(given.nameToReplace, given.newNameForReplacement)(given.pathString);
                } catch (error: unknown) {
                    exception = error as Error;
                }
            });
            afterEach(() => {
                result = undefined;
                exception = undefined;
            });
            test('Then no error should be thrown', () => {
                expect(exception).toBeUndefined();
            });
            test('Then the new path string should not be undefined', () => {
                expect(result).not.toBeUndefined();
            });
            test('Then the resulting new path should be as expected', () => {
                expect(result).toStrictEqual(expected);
            });
        });
    });
    describe.each([
        [
            'Absolute path, not duplicate on name to replace, name present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'my', 'your')
        ],
        [
            'Absolute path, not duplicate on name to replace, name NOT present in the path',
            new Given('/this/is/my/folder/with/one/file.ts', 'two', 'three')
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('/this/and/this/are/my/folder/with/one/file.ts', 'this', 'that')
        ],
        [
            'Absolute path, no duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('/this/is/my/folder/with-additional-my/and/one/myfile.ts', 'my', 'your')
        ],
        [
            'Absolute path, no duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('/this/is/my/folder/with-additional-your/and/one/yourfile.ts', 'your', 'my')
        ]
    ])('Given the context %s', (context: string, given: Given) => {
        describe('When I call the "rename" HoF on this input and use the resulting function to modify the given path', () => {
            let exception: Error | undefined;
            beforeEach(() => {
                try {
                    rename(given.nameToReplace, given.newNameForReplacement)(given.pathString);
                } catch (error: unknown) {
                    exception = error as Error;
                }
            });
            afterEach(() => {
                exception = undefined;
            });
            test('Then an exception should be thrown', () => {
                expect(exception).not.toBeUndefined();
            });
            test('Then the exception should be of type DestinationPathProcessingError', () => {
                expect(exception).toBeInstanceOf(DestinationPathProcessingError);
            });
            test('Then the error message should be "unable to process absolute path. Path should be relative"', () => {
                expect(exception?.message).toBe('unable to process absolute path. Path should be relative');
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
        public readonly newNameForReplacement: string;

        constructor(pathString: string, replaceFromTo: FromTo[], newNameForReplacement: string) {
            this.pathString = pathString;
            this.replaceFromTo = replaceFromTo;
            this.newNameForReplacement = newNameForReplacement;
        }
    }
    describe('Given a relative path', () => {
        describe.each([
            [
                'given no duplicate in the path, one name in input, but not present in the path',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given no duplicate in the path, one name in input, present in the path but as substring',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given no duplicate in the path, one name in input, present in the path',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, but not present in the path',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, present in the path but as substring',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, present in the path but only one time',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, present in the path but one time as substring, one time as path element',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, present in the path multiple time not as substring',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, one name in input, present in the path multiple time not as substring, and as substring',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, multiple name in input, none present in the path',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, multiple name in input, some present in the path but as substrings',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ],
            [
                'given some duplicate in the path, multiple name in input, some present in the path as path element and as substring, others not present in the path',
                new Given('', [{ from: '', to: '' }], ''),
                'expected'
            ]
        ])('Given the context "%s"', (context: string, given: Given, expected: string) => {
            describe('When I call the "renameAll" HoF on this input and use the resulting function to modify the given path', () => {
                let result: string | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        const fromToReplacements = given.replaceFromTo.map(fromTo => [fromTo.from, fromTo.to] as [string, string]);
                        result = renameAll(...fromToReplacements)(given.pathString);
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
                });
                test('Then the result should not be undefined', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then no exception should be thrown', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then the transformed path should be as expected', () => {
                    expect(result).toStrictEqual(expected);
                });
            });
        });
    });
});

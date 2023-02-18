// Disclaimer: all tests will assume they are run on a *nix
// base system. There are no plans to support windows

import { rename } from './destination-path-processor';

describe('rename', () => {
    describe('Given a path as a string with no duplicated folder name', () => {
        const pathString = 'this/is/my/path/here.my.ts';
        describe('And a name to replace that is present in the path', () => {
            const nameToReplace = 'my';
            describe('When I call the "rename" higher function result on the pathString with the name to replace on the path', () => {
                const newNameForReplacement = 'your';
                let result: string | undefined;
                beforeEach(() => {
                    result = rename(nameToReplace, newNameForReplacement)(pathString);
                });
                afterEach(() => {
                    result = undefined;
                });
                test('Then the result is not undefined', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the resulting string should not contains the previous name', () => {
                    expect(result).not.toContain(nameToReplace);
                });
                test('Then the resulting string should be correctly updated', () => {
                    expect(result).toStrictEqual('this/is/your/path/here.my.ts');
                });
            });
        });
        describe('And a name to replace that is not present in the path', () => {
            const nameToReplace = 'not-my';
            describe('When I call the "rename" higher function result on  the pathString with the name to replace on the path', () => {
                const newNameForReplacement = 'your';
                let result: string | undefined;
                beforeEach(() => {
                    result = rename(nameToReplace, newNameForReplacement)(pathString);
                });
                afterEach(() => {
                    result = undefined;
                });
                test('Then the result is not undefined', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the resulting string should be the same as the original', () => {
                    expect(result).toStrictEqual(pathString);
                });
            });
        });
    });
    describe('Given a path as a string with duplicated folder name', () => {
        const pathString = 'this/and/this/are/my/path/this.ts';
        describe('And a name to replace that is present on time in the path', () => {
            const nameToReplace = 'my';
            describe('When I call the "rename" higher order function result on the pathString with the name to replace on the path', () => {
                const newNameForReplacement = 'your';
                let result: string | undefined;
                beforeEach(() => {
                    result = rename(nameToReplace, newNameForReplacement)(pathString);
                });
                afterEach(() => {
                    result = undefined;
                });
                test('Then the result should not be undefined', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the resulting string should not contains the previous name', () => {

                });
            });
        });
        describe('And a name to replace that is present multiple time in the path', () => {});
        describe('And a name to replace that is not present in the path', () => {});
    });
    // TODO: insert a describe each to test most of combinaison
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
            new Given('', '', ''),
            'expected'
        ],
        [
            'Absolute path, not duplicate on name to replace, name NOT present in the path',
            new Given('', '', ''),
            'expected'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path',
            new Given('', '', ''),
            'expected'
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('', '', ''),
            'expected'
        ],
        [
            'Absolute path, duplicate on name to replace',
            new Given('', '', ''),
            'expected'
        ],
        [
            'Absolute path, no duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('', '', ''),
            'expected'
        ],
        [
            'relative path, not duplicate on name to replace, name present in the path and as substring of other parts',
            new Given('', '', ''),
            'expected'
        ],
        [
            'Absolute path, no duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('', '', ''),
            'expected'
        ],
        [
            'relative path, not duplicate on name to replace, name NOT present in the path BUT as substring of other parts',
            new Given('', '', ''),
            'expected'
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

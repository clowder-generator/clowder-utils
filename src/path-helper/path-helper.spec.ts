import * as fs from 'fs';
import { vol } from 'memfs';
import {
    assertPathDoesNotExist,
    assertPathDoesNotExistOrIsEmpty,
    assertPathIsEmpty
} from './path-helper';
import { PathAssertionError } from './exceptions';
jest.mock('fs');

describe('path-helper', () => {
    beforeEach(() => {
        fs.mkdirSync(process.cwd(), { recursive: true });
    });

    afterEach(() => {
        vol.reset();
    });

    describe('assertPathDoesNotExist', () => {
        let exception: Error | undefined;

        beforeEach(() => {
            exception = undefined;
        });

        describe('Given there is nothing in this folder', () => {
            describe("When I call 'assertPathDoesNotExist' on something inside this empty folder", () => {
                beforeEach(() => {
                    try {
                        assertPathDoesNotExist('whatever');
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should not throw an error', () => {
                    expect(exception).toBeUndefined();
                });
            });

            describe("When I call 'assertPathDoesNotExist' on the current directory", () => {
                beforeEach(() => {
                    try {
                        assertPathDoesNotExist('.');
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should throw an error', () => {
                    expect(exception).not.toBeUndefined();
                });

                test("Then the thrown error should be of type 'PathAssertionError'", () => {
                    expect(exception).toBeInstanceOf(PathAssertionError);
                });

                test('Then the thrown error should contains the appropriate message', () => {
                    expect(exception?.message).toBe("The path '.' already exist");
                });
            });
        });

        describe("Given there is one folder named 'dummy' in the current folder", () => {
            beforeEach(() => {
                // the following statement is the same as
                // fs.mkdirSync(`./dummy`)
                // or fs.mkdirSync(`${process.cwd()}/dummy`)
                fs.mkdirSync('dummy');
            });

            describe("When I call 'assertPathDoesNotExist' on 'dummy'", () => {
                beforeEach(() => {
                    try {
                        assertPathDoesNotExist('dummy');
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should throw an error', () => {
                    expect(exception).not.toBeUndefined();
                });

                test("Then the thrown error should be of type 'PathAssertionError'", () => {
                    expect(exception).toBeInstanceOf(PathAssertionError);
                });

                test('Then the thrown error should contains the appropriate message', () => {
                    expect(exception?.message).toBe("The path 'dummy' already exist");
                });
            });
        });
    });

    describe('assertPathIsEmpty', () => {
        let exception: Error | undefined;

        beforeEach(() => {
            exception = undefined;
        });

        describe('Given only the current folder with nothing inside', () => {
            describe("When I call 'assertPathIsEmpty' with no argument", () => {
                beforeEach(() => {
                    try {
                        assertPathIsEmpty();
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should not throw an error', () => {
                    expect(exception).toBeUndefined();
                });
            });

            describe("When I call 'assertPathIsEmpty' on a non existing folder", () => {
                beforeEach(() => {
                    try {
                        assertPathIsEmpty('whatever');
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should throw an error', () => {
                    expect(exception).not.toBeUndefined();
                });

                test("Then the thrown error should be of type 'PathAssertionError'", () => {
                    expect(exception).toBeInstanceOf(PathAssertionError);
                });

                test('Then the thrown error should contains an appropriate message', () => {
                    expect(exception?.message).toBe("The path 'whatever' does not exist");
                });
            });
        });

        describe("Given a folder 'myFolder'", () => {
            beforeEach(() => {
                fs.mkdirSync('myFolder');
            });

            describe('and nothing inside', () => {
                describe("When I call 'assertPathIsEmpty' on the folder 'myFolder'", () => {
                    beforeEach(() => {
                        try {
                            assertPathIsEmpty('myFolder');
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should not throw an error', () => {
                        expect(exception).toBeUndefined();
                    });
                });
            });

            describe('and a file inside', () => {
                beforeEach(() => {
                    fs.writeFileSync('myFolder/myFile.txt', 'content of the file');
                });

                describe("When I call 'assertPathIsEmpty' on the folder 'myFolder'", () => {
                    beforeEach(() => {
                        try {
                            assertPathIsEmpty('myFolder');
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should throw an error', () => {
                        expect(exception).not.toBeUndefined();
                    });

                    test("Then the thrown error should be of type 'PathAssertionError'", () => {
                        expect(exception).toBeInstanceOf(PathAssertionError);
                    });

                    test('Then the thrown error should contains the appropriate message', () => {
                        expect(exception?.message).toBe("The path 'myFolder' is not empty");
                    });
                });
            });

            describe('and another folder inside', () => {
                beforeEach(() => {
                    fs.mkdirSync('myFolder/anotherFolder');
                });

                describe("When I call 'assertPathIsEmpty' on the folder 'myFolder'", () => {
                    beforeEach(() => {
                        try {
                            assertPathIsEmpty('myFolder');
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should throw an error', () => {
                        expect(exception).not.toBeUndefined();
                    });

                    test("Then the thrown error should be of type 'PathAssertionError'", () => {
                        expect(exception).toBeInstanceOf(PathAssertionError);
                    });

                    test('Then the thrown error should contains the appropriate message', () => {
                        expect(exception?.message).toBe("The path 'myFolder' is not empty");
                    });
                });
            });
        });
    });

    describe('assertPathDoesNotExistOrIsEmpty', () => {
        let exception: Error | undefined;

        beforeEach(() => {
            exception = undefined;
        });

        describe('Given a folder', () => {
            describe("When I call 'assertPathDoesNotExistOrIsEmpty' on something that does not exist inside this folder", () => {
                beforeEach(() => {
                    try {
                        assertPathDoesNotExistOrIsEmpty('whatever');
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should not throw an error', () => {
                    expect(exception).toBeUndefined();
                });
            });

            describe("When I call 'assertPathDoesNotExistOrIsEmpty' without parameter", () => {
                beforeEach(() => {
                    try {
                        assertPathDoesNotExistOrIsEmpty();
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });

                test('Then it should not throw an error since the current folder is empty', () => {
                    expect(exception).toBeUndefined();
                });
            });

            describe('with an empty folder inside', () => {
                beforeEach(() => {
                    fs.mkdirSync('myEmptyFolder');
                });

                describe("When I can 'assertPathDoesNotExistOrIsEmpty' without parameter", () => {
                    beforeEach(() => {
                        try {
                            assertPathDoesNotExistOrIsEmpty();
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should throw an error since the current folder is not empty', () => {
                        expect(exception).not.toBeUndefined();
                    });

                    test("Then the thrown error should be of type 'PathAssertionError'", () => {
                        expect(exception).toBeInstanceOf(PathAssertionError);
                    });

                    test('Then the thrown error should contain an appropriate message', () => {
                        expect(exception?.message).toBe("The path '.' exist and is not empty");
                    });
                });

                describe("When I call 'assertPathDoesNotExistOrIsEmpty' on this empty folder", () => {
                    beforeEach(() => {
                        try {
                            assertPathDoesNotExistOrIsEmpty('myEmptyFolder');
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should not throw an error', () => {
                        expect(exception).toBeUndefined();
                    });
                });
            });

            describe('with a non empty folder inside', () => {
                beforeEach(() => {
                    fs.mkdirSync('myNonEmptyFolder/innerFolder', { recursive: true });
                });

                describe("When I call 'assertPathDoesNotExistOrIsEmpty' on this non empty folder", () => {
                    beforeEach(() => {
                        try {
                            assertPathDoesNotExistOrIsEmpty('myNonEmptyFolder');
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });

                    test('Then it should throw an error', () => {
                        expect(exception).not.toBeUndefined();
                    });

                    test('Then the thrown error should be of type PathAssertionError', () => {
                        expect(exception).toBeInstanceOf(PathAssertionError);
                    });

                    test('Then the thrown error should have an appropriate message', () => {
                        expect(exception?.message).toBe("The path 'myNonEmptyFolder' exist and is not empty");
                    });
                });
            });
        });
    });
});

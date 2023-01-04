import {
    Case,
    CaseConversionError,
    fromCamelCase,
    fromKebabCase,
    fromPascalCase, fromScreamingKebabCase,
    fromScreamingSnakeCase,
    fromSnakeCase
} from "./case-helper";
import {SEP} from "memfs/lib/node";

describe("Case", () => {
    describe("constructor", () => {
        describe("When I call new Case with an empty array", () => {
            let exception: Error = undefined;
            beforeEach(() => {
                try {
                    new Case([]);
                } catch (error: unknown){
                    exception = error as Error;
                }
            });
            test("Then I should get an error", () => {
                expect(exception).not.toBeUndefined();
            });
            test("Then the error should be of type CaseConverterError", () => {
                expect(exception).toBeInstanceOf(CaseConversionError);
            });
            test("Then the error should have a message explaining that an empty array cannot be used", () => {
                expect(exception.message).toBe("Cannot build case object with empty array");
            });
        });
        describe("When I call new Case with blank entry in the array", () => {
            let exception: Error = undefined;
            beforeEach(() => {
                try {
                    new Case(["this", "\t"]);
                } catch (error: unknown) {
                    exception = error as Error;
                }
            });
            test("Then I should get an error", () => {
                expect(exception).not.toBeUndefined();
            });
            test("Then the error should be of type CaseConverterError", () => {
                expect(exception).toBeInstanceOf(CaseConversionError);
            });
            test("Then the error should have a message explaining that an array with blank cannot be used", () => {
                expect(exception.message).toBe("Cannot build case object with blank string in the array");
            });
        });
        describe("When I call new Case with a non blank, non empty array", () => {
            let myCase: Case = undefined;
            beforeEach(() => {
                myCase = new Case(["one", "two", "three"]);
            });
            test("Then the object Case contains the same strings", () => {
                expect(myCase.words).toEqual(["one", "two", "three"]);
            });
        });
    });
    describe("Given a valid Case object", () => {
        let myCase: Case;
        let converted: string;

        beforeEach(() => {
            myCase = undefined;
            converted = undefined;
        });

        describe("with one word", () => {

            beforeEach(() => {
                myCase = new Case(["first"])
            });

            describe("When I call .toKebabCase", () => {
                beforeEach(() => {
                    converted = myCase.toKebabCase();
                });
                test("Then the returned string has a kebab case", () => {
                    expect(converted).toBe("first");
                });
            });

            describe("When I call .toCamelCase", () => {
                beforeEach(() => {
                    converted = myCase.toCamelCase();
                });

                test("Then the returned string has a camel case", () => {
                    expect(converted).toBe("first");
                });
            });
            describe("When I call .toSnakeCase", () => {
                beforeEach(() => {
                    converted = myCase.toSnakeCase();
                });
                test("Then the returned string has a snake case", () => {
                    expect(converted).toBe("first");
                });
            });
            describe("When I call .toPascalCase", () => {
                beforeEach(() => {
                    converted = myCase.toPascalCase();
                });
                test("Then the returned string has a pascal case", () => {
                    expect(converted).toBe("First");
                });
            });
            describe("When I call .toScreamingSnakeCase", () => {
                beforeEach(() => {
                    converted = myCase.toScreamingSnakeCase();
                });
                test("Then the returned string has a screaming snake case", () => {
                    expect(converted).toBe("FIRST");
                });
            });
            describe("When I call .toScreamingKebabCase", () => {
                beforeEach(() => {
                    converted = myCase.toScreamingKebabCase();
                });
                test("Then the returned string has a screaming kebab case", () => {
                    expect(converted).toBe("FIRST");
                });
            });
        });
        describe("with more that one word", () => {

            beforeEach(() => {
                myCase = new Case(["first", "second"]);
            });

            describe("When I call .toKebabCase", () => {

                beforeEach(() => {
                    converted = myCase.toKebabCase();
                });
                test("Then the returned string has a kebab case", () => {
                    expect(converted).toBe("first-second");
                });
            });
            describe("When I call .toCamelCase", () => {
                beforeEach(() => {
                    converted = myCase.toCamelCase();
                });
                test("Then the returned string has a camel case", () => {
                    expect(converted).toBe("firstSecond");
                });
            });
            describe("When I call .toSnakeCase", () => {
                beforeEach(() => {
                    converted = myCase.toSnakeCase();
                });
                test("Then the returned string has a snake case", () => {
                    expect(converted).toBe("first_second");
                });
            });
            describe("When I call .toPascalCase", () => {
                beforeEach(() => {
                    converted = myCase.toPascalCase();
                });
                test("Then the returned string has a pascal case", () => {
                    expect(converted).toBe("FirstSecond");
                });
            });
            describe("When I call .toScreamingSnakeCase", () => {
                beforeEach(() => {
                    converted = myCase.toScreamingSnakeCase();
                });
                test("Then the returned string has a screaming snake case", () => {
                    expect(converted).toBe("FIRST_SECOND");
                });
            });
            describe("When I call .toScreamingKebabCase", () => {
                beforeEach(() => {
                    converted = myCase.toScreamingKebabCase();
                });
                test("Then the returned string has a screaming kebab case", () => {
                    expect(converted).toBe("FIRST-SECOND");
                });
            });
        });
    });

});

describe("fromSnakeCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["camelCase",                               "the string \"camelCase\" does not match snakeCase pattern"],
        ["kebab-case",                              "the string \"kebab-case\" does not match snakeCase pattern"],
        ["SCREAMING_SNAKE_CASE",                    "the string \"SCREAMING_SNAKE_CASE\" does not match snakeCase pattern"],
        ["incomplete_snake_",                       "the string \"incomplete_snake_\" does not match snakeCase pattern"],
        ["double__underscore__snake",               "the string \"double__underscore__snake\" does not match snakeCase pattern"]
    ])("When I call .fromSnakeCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromSnakeCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["first", ["first"]],
        ["first_second", ["first", "second"]],
        ["first_second_3", ["first", "second", "3"]],
        ["first_second_thr3e", ["first", "second", "thr3e"]]
    ])("When I call .fromSnakeCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromSnakeCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});

describe("fromKebabCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["camelCase",                               "the string \"camelCase\" does not match kebabCase pattern"],
        ["snake_case",                              "the string \"snake_case\" does not match kebabCase pattern"],
        ["SCREAMING-KEBAB-CASE",                    "the string \"SCREAMING-KEBAB-CASE\" does not match kebabCase pattern"],
        ["incomplete-kebab-",                       "the string \"incomplete-kebab-\" does not match kebabCase pattern"],
        ["double--dash--kebab",                     "the string \"double--dash--kebab\" does not match kebabCase pattern"]
    ])("When I call .fromKebabCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromKebabCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["first", ["first"]],
        ["first-second", ["first", "second"]],
        ["first-second-3", ["first", "second", "3"]],
        ["first-second-thr3e", ["first", "second", "thr3e"]]
    ])("When I call .fromKebabCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromKebabCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});

describe("fromCamelCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["PascalCase",                              "the string \"PascalCase\" does not match camelCase pattern"],
        ["snake_case",                              "the string \"snake_case\" does not match camelCase pattern"],
        ["kebab-case",                              "the string \"kebab-case\" does not match camelCase pattern"],
        ["SCREAMING_SNAKE_CASE",                    "the string \"SCREAMING_SNAKE_CASE\" does not match camelCase pattern"],
        ["incomplete_snake_",                       "the string \"incomplete_snake_\" does not match camelCase pattern"],
        ["double__underscore__snake",               "the string \"double__underscore__snake\" does not match camelCase pattern"]
    ])("When I call .fromCamelCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromCamelCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["first", ["first"]],
        ["firstSecond", ["first", "second"]],
        ["firstSecond3", ["first", "second3"]],
        ["firstSecondThr3e", ["first", "second", "thr3e"]],
        ["notAProblem", ["not", "a", "problem"]]
    ])("When I call .fromCamelCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromCamelCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});

describe("fromPascalCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["camelCase",                               "the string \"camelCase\" does not match pascalCase pattern"],
        ["snake_case",                              "the string \"snake_case\" does not match pascalCase pattern"],
        ["kebab-case",                              "the string \"kebab-case\" does not match pascalCase pattern"],
        ["SCREAMING_SNAKE_CASE",                    "the string \"SCREAMING_SNAKE_CASE\" does not match pascalCase pattern"],
        ["incomplete_snake_",                       "the string \"incomplete_snake_\" does not match pascalCase pattern"],
        ["double__underscore__snake",               "the string \"double__underscore__snake\" does not match pascalCase pattern"]
    ])("When I call .fromPascalCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromPascalCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["First", ["first"]],
        ["FirstSecond", ["first", "second"]],
        ["FirstSecond3", ["first", "second3"]],
        ["FirstSecondThr3e", ["first", "second", "thr3e"]],
        ["NotAProblem", ["not", "a", "problem"]]
    ])("When I call .fromPascalCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromPascalCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});

describe("fromScreamingSnakeCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["camelCase",                               "the string \"camelCase\" does not match screamingSnakeCase pattern"],
        ["PascalCase",                              "the string \"PascalCase\" does not match screamingSnakeCase pattern"],
        ["kebab-case",                              "the string \"kebab-case\" does not match screamingSnakeCase pattern"],
        ["snake_case",                              "the string \"snake_case\" does not match screamingSnakeCase pattern"],
        ["INCOMPLETE_SNAKE_",                       "the string \"INCOMPLETE_SNAKE_\" does not match screamingSnakeCase pattern"],
        ["DOUBLE__UNDERSCORE__SNAKE",               "the string \"DOUBLE__UNDERSCORE__SNAKE\" does not match screamingSnakeCase pattern"]
    ])("When I call .fromScreamingSnakeCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromScreamingSnakeCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["FIRST", ["first"]],
        ["FIRST_SECOND", ["first", "second"]],
        ["FIRST_SECOND_3", ["first", "second", "3"]],
        ["FIRST_SECOND_THR3E", ["first", "second", "thr3e"]]
    ])("When I call .fromScreamingSnakeCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromScreamingSnakeCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});

describe("fromScreamingKebabCase", () => {
    describe.each([
        ["",                                        "invalid empty string"],
        [" ",                                       "invalid string with blank char"],
        ["a normal sentence with space or blank\t", "invalid string with blank char"],
        ["'",                                       "invalid string with special char"],
        ["camelCase",                               "the string \"camelCase\" does not match screamingKebabCase pattern"],
        ["snake_case",                              "the string \"snake_case\" does not match screamingKebabCase pattern"],
        ["kebab-case",                              "the string \"kebab-case\" does not match screamingKebabCase pattern"],
        ["INCOMPLETE-KEBAB-",                       "the string \"INCOMPLETE-KEBAB-\" does not match screamingKebabCase pattern"],
        ["DOUBLE--DASH--KEBAB",                     "the string \"DOUBLE--DASH--KEBAB\" does not match screamingKebabCase pattern"]
    ])("When I call .fromScreamingKebabCase on \"%s\"", (input: string, expectedErrorMessage: string) => {
        let exception: Error = undefined;
        beforeEach(() => {
            try {
                fromScreamingKebabCase(input)
            } catch (error: unknown) {
                exception = error as Error;
            }
        });
        test("Then I should get an error", () => {
            expect(exception).not.toBeUndefined();
        });
        test("Then the error should be of type CaseConverterError", () => {
            expect(exception).toBeInstanceOf(CaseConversionError);
        });
        test("Then the error should have an appropriate message explaining the source of the error", () => {
            expect(exception.message).toBe(expectedErrorMessage);
        });
    });
    describe.each([
        ["FIRST", ["first"]],
        ["FIRST-SECOND", ["first", "second"]],
        ["FIRST-SECOND-3", ["first", "second", "3"]],
        ["FIRST-SECOND-THR3E", ["first", "second", "thr3e"]]
    ])("When I call .fromScreamingKebabCase on a valid string %s", (input: string, expected: string[]) => {
        let myCase: Case;
        beforeEach(() => {
            myCase = fromScreamingKebabCase(input);
        });
        test("Then I get a Case object", () => {
            expect(myCase).not.toBeUndefined();
        });
        test("Then the Case object is correctly formed", () => {
            expect(myCase.words).toStrictEqual(expected);
        });
    });
});
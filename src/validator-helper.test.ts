import {
    camelCaseValidation, doNotStartWithNumberValidation,
    integerValidation,
    kebabCaseValidation,
    naturalNumberValidation,
    noInnerWhiteSpaceValidation,
    noLeadingWhiteSpaceValidation, nonBlankValidation,
    noTrailingWhiteSpaceValidation,
    noUndefinedValidation,
    numberValidation,
    pascalCaseValidation,
    screamingKebabCaseValidation,
    screamingSnakeCaseValidation,
    shouldMatchRegexValidation,
    shouldNotMatchRegexValidation,
    snakeCaseValidation, validateWith, validationFunction
} from './validator-helper';

describe('validateWith', () => {
    describe('Given 3 functions that validate if an input is lower  than "3", "2" or "1"', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan3: validationFunction = async (input) => (+input!) < 3 ? true : 'input is not lower than 3';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan2: validationFunction = async (input) => (+input!) < 2 ? true : 'input is not lower than 2';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan1: validationFunction = async (input) => (+input!) < 1 ? true : 'input is not lower than 1';
        describe('and no validation option', () => {
            describe.each([
                ['4', 'input is not lower than 3'],
                ['3', 'input is not lower than 3'],
                ['2', 'input is not lower than 2'],
                ['1', 'input is not lower than 1'],
                ['0', true]
            ])('When I call the composition of function on the input "%s"', (input: string, expected: boolean | string) => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = validateWith([
                        lowerThan3,
                        lowerThan2,
                        lowerThan1
                    ])(input);
                });
                test('Then a promise should be returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the correct value should be returned', async () => {
                    expect(await result).toStrictEqual(expected);
                });
            });
        });
        describe('and a function to assert some rules on white space char presence', () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const noLeadingWhiteSpaces: validationFunction = async (input) => /^\s+.*$/.test(input!) ? 'leading :(' : true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const noTrailingWhiteSpaces: validationFunction = async (input) => /^\S*\s+$/.test(input!) ? 'trailing :(' : true;
            describe('and a validationOption for trimmed = true', () => {
                const opt = { trimmed: true };
                describe.each([
                    ['2', true],
                    ['4', 'input is not lower than 3'],
                    [' 1', true],
                    ['1 ', true],
                    ['\n 1 \t', true]
                ])('When I call the composition of function on the input "%s"', (input: string, expected: boolean | string) => {
                    let result: Promise<boolean | string> | undefined;
                    beforeEach(() => {
                        result = validateWith([
                            noLeadingWhiteSpaces,
                            noTrailingWhiteSpaces,
                            lowerThan3
                        ], opt)(input);
                    });
                    test('Then a promise should be returned', () => {
                        expect(result).toBeInstanceOf(Promise);
                    });
                    test('Then the correct value should be returned', async () => {
                        expect(await result).toStrictEqual(expected);
                    });
                });
            });
            describe('and a validationOption for trimmed = false', () => {
                const opt = { trimmed: false };
                describe.each([
                    ['2', true],
                    ['4', 'input is not lower than 3'],
                    [' 1', 'leading :('],
                    ['1 ', 'trailing :('],
                    ['\n 1 \t', 'leading :(']
                ])('When I call the composition of function on the input "%s"', (input: string, expected: boolean | string) => {
                    let result: Promise<boolean | string> | undefined;
                    beforeEach(() => {
                        result = validateWith([
                            noLeadingWhiteSpaces,
                            noTrailingWhiteSpaces,
                            lowerThan3
                        ], opt)(input);
                    });
                    test('Then a promise should be returned', () => {
                        expect(result).toBeInstanceOf(Promise);
                    });
                    test('Then the correct value should be returned', async () => {
                        expect(await result).toStrictEqual(expected);
                    });
                });
            });
        });
    });
});

describe('regexMatchValidation', () => {
    describe('Given a regex to match any valid natural number', () => {
        const regex: RegExp = /^[1-9]\d*$/;
        describe('and a custom error message', () => {
            const errorMessage = 'The input "%s" is not a natural number. Please provide a natural number.';
            describe.each([
                ['1234', true],
                [undefined, 'undefined is not a valid input to check the regex /^[1-9]\\d*$/.'],
                ['-123', 'The input "-123" is not a natural number. Please provide a natural number.'],
                ['', 'The input "" is not a natural number. Please provide a natural number.'],
                ['0123', 'The input "0123" is not a natural number. Please provide a natural number.']
            ])('When I test the resulting validation with the input "%s"', (input: string | undefined, expected: boolean | string) => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = shouldMatchRegexValidation(regex, errorMessage)(input);
                });
                test('Then a promise should be returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the correct value should be returned', async () => {
                    expect(await result).toStrictEqual(expected);
                });
            });
        });
        describe('and no custom error message', () => {
            describe.each([
                ['1234', true],
                [undefined, 'undefined is not a valid input to check the regex /^[1-9]\\d*$/.'],
                ['-123', 'The input "-123" should match the regex /^[1-9]\\d*$/.'],
                ['', 'The input "" should match the regex /^[1-9]\\d*$/.'],
                ['0123', 'The input "0123" should match the regex /^[1-9]\\d*$/.']
            ])('When I test the resulting validation with the input "%s"', (input: string | undefined, expected: boolean | string) => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = shouldMatchRegexValidation(regex)(input);
                });
                test('Then a promise should be returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the correct value should be returned', async () => {
                    expect(await result).toStrictEqual(expected);
                });
            });
        });
    });
});

describe('shouldNotMatchRegexValidation', () => {
    describe('Given a regex to match any valid natural number', () => {
        const regex: RegExp = /^[1-9]\d*$/;
        describe('and the a custom error message ', () => {
            const errorMessage = 'The input "%s" is a natural number. Please do not provide a natural number.';
            describe.each([
                ['-123', true],
                ['', true],
                ['0123', true],
                [undefined, 'undefined is not a valid input to check the regex /^[1-9]\\d*$/.'],
                ['1234', 'The input "1234" is a natural number. Please do not provide a natural number.']
            ])('When I test the resulting validation function with the input "%s"', (input: string | undefined, expected: boolean | string) => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = shouldNotMatchRegexValidation(regex, errorMessage)(input);
                });
                test('Then a promise should be returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the correct value should be returned', async () => {
                    expect(await result).toStrictEqual(expected);
                });
            });
        });
        describe('and no custom error message ', () => {
            describe.each([
                ['-123', true],
                ['', true],
                ['0123', true],
                [undefined, 'undefined is not a valid input to check the regex /^[1-9]\\d*$/.'],
                ['1234', 'The input "1234" should not match the regex /^[1-9]\\d*$/.']
            ])('When I test the resulting validation function with the input "%s"', (input: string | undefined, expected: boolean | string) => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = shouldNotMatchRegexValidation(regex)(input);
                });
                test('Then a promise should be returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the correct value should be returned', async () => {
                    expect(await result).toStrictEqual(expected);
                });
            });
        });
    });
});

describe('noUndefinedValidation', () => {
    describe.each([
        [' ', true],
        ['', true],
        ['a', true],
        ['1', true],
        [undefined, 'undefine is not a valid input.']
    ])('When I call "noUndefinedValidation" on the input "%s"', (input: string | undefined, expected: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noUndefinedValidation(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
});

describe('nonBlankValidation', () => {
    describe.each([
        ['notBlank', true],
        ['not Blank but with spaces ', true],
        [undefined, 'undefined is not a valid input. Only word which are not blank are expected.'],
        ['', '"" is blank. Only word which are not blank are expected.'],
        [' ', '" " is blank. Only word which are not blank are expected.'],
        ['  ', '"  " is blank. Only word which are not blank are expected.'],
        ['\t \n', '"\t \n" is blank. Only word which are not blank are expected.'],
        ['\t', '"\t" is blank. Only word which are not blank are expected.'],
        ['\n', '"\n" is blank. Only word which are not blank are expected.']
    ])('When I call "nonBlankValidation"', (input: string | undefined, expected: boolean | string) => {
        let result: Promise<boolean | string>;
        beforeEach(() => {
            result = nonBlankValidation(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
});

describe('noWhiteSpaceValidation', () => {});

describe('doNotStartWithNumberValidation', () => {
    describe.each([
        ['noNumber', true],
        ['numberAtTheEnd123', true],
        ['number1In2The3Middle', true],
        [' 123leadingWhiteSpaceBeforeNumber', true],
        [undefined, 'undefined is not a valid input. Only word with no leading number are expected.'],
        ['123leadingNumber', '"123leadingNumber" starts with a number. Only word with no leading number are expected.']
    ])('When I call "doNotStartWithNumberValidation" on the input "%s"', (input: string | undefined, expected: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = doNotStartWithNumberValidation(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
});

describe('noTrailingWhiteSpaceValidation', () => {
    describe.each([
        ['noTrailingWhiteSpace', true],
        [' leadingButNoTrailing', true],
        ['space\nin\tbetween but not trailing', true],
        [undefined, 'undefined is not a valid input. Only word with no trailing white space are expected.'],
        ['withOneTrailing ', '"withOneTrailing " contains a trailing blank char. A valid input should not have trailing white space.'],
        ['withOneWeirdTrailing\n', '"withOneWeirdTrailing\n" contains a trailing blank char. A valid input should not have trailing white space.'],
        ['withMoreThanOneTrailing \t', '"withMoreThanOneTrailing \t" contains a trailing blank char. A valid input should not have trailing white space.']
    ])('When I call "noTrailingWhiteSpaceValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noTrailingWhiteSpaceValidation(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

describe('noLeadingWhiteSpaceValidation', () => {
    describe.each([
        ['noLeadingWhiteSpace', true],
        ['trailingButNoLeading ', true],
        ['space\nin\tbetween but not leading', true],
        [undefined, 'undefined is not a valid input. Only word with no leading white space are expected.'],
        [' withOneLeading', '" withOneLeading" contains a leading blank char. A valid input should not have leading white space.'],
        ['\twithOneWeirdLeading', '"\twithOneWeirdLeading" contains a leading blank char. A valid input should not have leading white space.'],
        [' \t withMoreThanOneLeading', '" \t withMoreThanOneLeading" contains a leading blank char. A valid input should not have leading white space.']
    ])('When I call "noLeadingWhiteSpaceValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noLeadingWhiteSpaceValidation(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

describe('noInnerWhiteSpaceValidation', () => {
    describe.each([
        ['noMiddleBlank', true],
        [' blankAtStartButNotInMiddle', true],
        ['blankAtEndButNotInMiddle\n', true],
        [undefined, 'undefined is not a valid input. Only word with no inner white space are expected.'],
        ['with oneMiddleBlank\n', '"with oneMiddleBlank\n" contains a blank char in the middle. A valid input should not have inner white space.'],
        ['with oneMiddleBlank', '"with oneMiddleBlank" contains a blank char in the middle. A valid input should not have inner white space.'],
        ['with more\tthan one\nmiddle blank', '"with more\tthan one\nmiddle blank" contains a blank char in the middle. A valid input should not have inner white space.']
    ])('When I call "noInnerWhiteSpaceValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noInnerWhiteSpaceValidation(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

describe('kebabCaseValidation', () => {
    // Notes: kebabCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'kebabCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid kebab-case input', () => {
        const input = 'kebab-case';
        describe('When I call "kebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = kebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid kebab-case input', () => {
        const input = 'notKebabCase';
        describe('When I call "kebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = kebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"notKebabCase" is not a valid kebab-case. Only kebab-case inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "kebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = kebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only kebab-case inputs are expected.');
            });
        });
    });
});

describe('screamingKebabCaseValidation', () => {
    // Notes: screamingKebabCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'screamingKebabCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid SCREAMING-KEBAB-CASE input', () => {
        const input = 'SCREAMING-KEBAB-CASE';
        describe('When I call "screamingKebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingKebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid SCREAMING-KEBAB-CASE input', () => {
        const input = 'not-screaming-kebab-case';
        describe('When I call "screamingKebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingKebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"not-screaming-kebab-case" is not a valid SCREAMING-KEBAB-CASE. Only SCREAMING-KEBAB-CASE inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "screamingKebabCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingKebabCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only SCREAMING-KEBAB-CASE inputs are expected.');
            });
        });
    });
});

describe('snakeCaseValidation', () => {
    // Notes: snakeCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'snakeCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid snake_case input', () => {
        const input = 'snake_case';
        describe('When I call "snakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = snakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid snake_case input', () => {
        const input = 'not-snake-case';
        describe('When I call "snakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = snakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"not-snake-case" is not a valid snake_case. Only snake_case inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "snakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = snakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only snake_case inputs are expected.');
            });
        });
    });
});

describe('screamingSnakeCaseValidation', () => {
    // Notes: screamingSnakeCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'screamingSnakeCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid SCREAMING_SNAKE_CASE input', () => {
        const input = 'SCREAMING_SNAKE_CASE';
        describe('When I call "screamingSnakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingSnakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid SCREAMING_SNAKE_CASE input', () => {
        const input = 'not_screaming_snake_case';
        describe('When I call "screamingSnakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingSnakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"not_screaming_snake_case" is not a valid SCREAMING_SNAKE_CASE. Only SCREAMING_SNAKE_CASE inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "screamingSnakeCaseValidation" on this input', () => {
            beforeEach(() => {
                result = screamingSnakeCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only SCREAMING_SNAKE_CASE inputs are expected.');
            });
        });
    });
});

describe('camelCaseValidation', () => {
    // Notes: camelCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'camelCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid camelCase input', () => {
        const input = 'camelCase';
        describe('When I call "camelCaseValidation" on this input', () => {
            beforeEach(() => {
                result = camelCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid camelCase input', () => {
        const input = 'not-camel-case';
        describe('When I call "camelCaseValidation" on this input', () => {
            beforeEach(() => {
                result = camelCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"not-camel-case" is not a valid camelCase. Only camelCase inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "camelCaseValidation" on this input', () => {
            beforeEach(() => {
                result = camelCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only camelCase inputs are expected.');
            });
        });
    });
});

describe('pascalCaseValidation', () => {
    // Notes: pascalCaseValidation reuse the regex from case-helper. This regex is fully tested
    //        in the case-helper.test context, so there is no need to go through all the regex
    //        test cases for 'pascalCaseValidation'.
    let result: Promise<boolean | string> | undefined;
    describe('Given a valid PascalCase input', () => {
        const input = 'PascalCase';
        describe('When I call "pascalCaseValidation" on this input', () => {
            beforeEach(() => {
                result = pascalCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the value "true" is contained inside this promise', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe('Given a non valid PascalCase input', () => {
        const input = 'not-pascal-case';
        describe('When I call "pascalCaseValidation" on this input', () => {
            beforeEach(() => {
                result = pascalCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('"not-pascal-case" is not a valid PascalCase. Only PascalCase inputs are expected.');
            });
        });
    });
    describe('Given an undefined input', () => {
        const input = undefined;
        describe('When I call "pascalCaseValidation" on this input', () => {
            beforeEach(() => {
                result = pascalCaseValidation(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the promise contains the appropriate message', async () => {
                expect(await result).toStrictEqual('undefined is not a valid input. Only PascalCase inputs are expected.');
            });
        });
    });
});

describe('integerValidation', () => {
    describe.each([
        ['1', true],
        ['1234', true],
        ['1.0', true],
        ['+123', true],
        ['10e3', true],
        ['0123', true],
        ['0xBABE', true],
        ['0o10', true],
        ['0b10', true],
        ['', true],
        ['-123', true],
        ['0', true],
        ['-1', true],
        ['10e-3', '"10e-3" is not an integer. Only unformatted finite integers are expected.'],
        ['-0.01', '"-0.01" is not an integer. Only unformatted finite integers are expected.'],
        [undefined, 'undefined is not a valid number. Only unformatted finite integers are expected.'],
        ['12 3', '"12 3" is not a valid number. Only unformatted finite integers are expected.'],
        ['12e999', '"12e999" is not a valid number. Only unformatted finite integers are expected.'],
        ['one', '"one" is not a valid number. Only unformatted finite integers are expected.'],
        ['.0.1', '".0.1" is not a valid number. Only unformatted finite integers are expected.'],
        ['0o88', '"0o88" is not a valid number. Only unformatted finite integers are expected.'],
        ['0b12', '"0b12" is not a valid number. Only unformatted finite integers are expected.'],
        ['0xGG', '"0xGG" is not a valid number. Only unformatted finite integers are expected.'],
        ['12e', '"12e" is not a valid number. Only unformatted finite integers are expected.'],
        ['1,000,000.00', '"1,000,000.00" is not a valid number. Only unformatted finite integers are expected.'],
        ['Infinity', '"Infinity" is not a valid number. Only unformatted finite integers are expected.']
    ])('When I call "integerValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = integerValidation(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

describe('naturalNumberValidation', () => {
    describe.each([
        ['1', true],
        ['1234', true],
        ['1.0', true],
        ['+123', true],
        ['10e3', true],
        ['0123', true],
        ['0xBABE', true],
        ['0o10', true],
        ['0b10', true],
        ['', '"" is not a natural number. Only unformatted finite natural numbers are expected.'],
        ['10e-3', '"10e-3" is not a natural number. Only unformatted finite natural numbers are expected.'],
        ['-0.01', '"-0.01" is not a natural number. Only unformatted finite natural numbers are expected.'],
        ['-123', '"-123" is not a natural number. Only unformatted finite natural numbers are expected.'],
        ['0', '"0" is not a natural number. Only unformatted finite natural numbers are expected.'],
        ['-1', '"-1" is not a natural number. Only unformatted finite natural numbers are expected.'],
        [undefined, 'undefined is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['12 3', '"12 3" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['12e999', '"12e999" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['one', '"one" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['.0.1', '".0.1" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['0o88', '"0o88" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['0b12', '"0b12" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['0xGG', '"0xGG" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['12e', '"12e" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['1,000,000.00', '"1,000,000.00" is not a valid number. Only unformatted finite natural numbers are expected.'],
        ['Infinity', '"Infinity" is not a valid number. Only unformatted finite natural numbers are expected.']
    ])('When I call "naturalNumberValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = naturalNumberValidation(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

describe('numberValidation', () => {
    describe.each([
        ['0', true],
        ['1', true],
        ['1234', true],
        ['1.0', true],
        ['+123', true],
        ['-123', true],
        ['-1', true],
        ['-0.01', true],
        ['10e3', true],
        ['10e-3', true],
        ['0123', true],
        ['0xBABE', true],
        ['0o10', true],
        ['0b10', true],
        [undefined, 'undefined is not a valid number. Only unformatted finite numbers are expected.'],
        ['12 3', '"12 3" is not a valid number. Only unformatted finite numbers are expected.'],
        ['12e999', '"12e999" is not a valid number. Only unformatted finite numbers are expected.'],
        ['one', '"one" is not a valid number. Only unformatted finite numbers are expected.'],
        ['.0.1', '".0.1" is not a valid number. Only unformatted finite numbers are expected.'],
        ['0o88', '"0o88" is not a valid number. Only unformatted finite numbers are expected.'],
        ['0b12', '"0b12" is not a valid number. Only unformatted finite numbers are expected.'],
        ['0xGG', '"0xGG" is not a valid number. Only unformatted finite numbers are expected.'],
        ['12e', '"12e" is not a valid number. Only unformatted finite numbers are expected.'],
        ['1,000,000.00', '"1,000,000.00" is not a valid number. Only unformatted finite numbers are expected.'],
        ['Infinity', '"Infinity" is not a valid number. Only unformatted finite numbers are expected.']
    ])('When I call "numberValidation" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = numberValidation(input);
        });
        test('Then a Promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
});

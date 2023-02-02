import {
    camelCaseValidation, doNotStartWithNumberValidation,
    integerValidation,
    kebabCaseValidation,
    naturalNumberValidation,
    noInnerWhiteSpaceValidation,
    noLeadingWhiteSpaceValidation, nonBlankValidation,
    noTrailingWhiteSpaceValidation, noWhiteSpaceValidation,
    numberValidation,
    pascalCaseValidation,
    screamingKebabCaseValidation,
    screamingSnakeCaseValidation,
    shouldMatchRegexValidation,
    shouldNotMatchRegexValidation,
    snakeCaseValidation,
    stringValidationFunction,
    validateWith
} from './validator-helper';

describe('validateWith', () => {
    describe('Given 3 functions that validate if an input is lower  than "3", "2" or "1"', () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan3: stringValidationFunction = async (input) => (+input) < 3 ? true : 'input is not lower than 3';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan2: stringValidationFunction = async (input) => (+input) < 2 ? true : 'input is not lower than 2';
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lowerThan1: stringValidationFunction = async (input) => (+input) < 1 ? true : 'input is not lower than 1';
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
        describe('and empty validation option', () => {
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
                    ], {})(input);
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
            const noLeadingWhiteSpaces: stringValidationFunction = async (input) => /^\s+.*$/.test(input) ? 'leading :(' : true;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const noTrailingWhiteSpaces: stringValidationFunction = async (input) => /^\S*\s+$/.test(input) ? 'trailing :(' : true;
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
        describe('and ValidationOption to test error message generation', () => {
            const invalidInput = '2';
            describe('with globalErrorString not empty', () => {
                describe('and preserveRootCause unset', () => {
                    describe.each([
                        ['not valid: "%s".', 'not valid: "2". Cause: input is not lower than 2'],
                        ['not valid.', 'not valid. Cause: input is not lower than 2'],
                        ['', 'Cause: input is not lower than 2']
                    ])('When I call the composition function on the input "%s" with the error message', (errorMessage: string, expectedErrorMessage: string) => {
                        let result: Promise<boolean | string> | undefined;
                        beforeEach(() => {
                            result = validateWith([
                                lowerThan3,
                                lowerThan2,
                                lowerThan1
                            ], {
                                globalErrorMessage: errorMessage
                            })(invalidInput);
                        });
                        test('Then a promise should be returned', () => {
                            expect(result).toBeInstanceOf(Promise);
                        });
                        test('Then the correct error message should be returned', async () => {
                            expect(await result).toStrictEqual(expectedErrorMessage);
                        });
                    });
                });
                describe('and hideRootCause set to true', () => {
                    const hideRoot = true;
                    describe.each([
                        ['not valid: "%s"', 'not valid: "2"'],
                        ['not valid', 'not valid'],
                        ['', '']
                    ])('When I call the composition function on the input "%s" with the error message', (errorMessage: string, expectedErrorMessage: string) => {
                        let result: Promise<boolean | string> | undefined;
                        beforeEach(() => {
                            result = validateWith([
                                lowerThan3,
                                lowerThan2,
                                lowerThan1
                            ], {
                                globalErrorMessage: errorMessage,
                                hideRootCause: hideRoot
                            })(invalidInput);
                        });
                        test('Then a promise should be returned', () => {
                            expect(result).toBeInstanceOf(Promise);
                        });
                        test('Then the correct error message should be returned', async () => {
                            expect(await result).toStrictEqual(expectedErrorMessage);
                        });
                    });
                });
                describe('and hideRootCause set to false', () => {
                    const hideRoot = false;
                    describe.each([
                        ['not valid: "%s".', 'not valid: "2". Cause: input is not lower than 2'],
                        ['not valid.', 'not valid. Cause: input is not lower than 2'],
                        ['', 'Cause: input is not lower than 2']
                    ])('When I call the composition function on the input "%s" with the error message', (errorMessage: string, expectedErrorMessage: string) => {
                        let result: Promise<boolean | string> | undefined;
                        beforeEach(() => {
                            result = validateWith([
                                lowerThan3,
                                lowerThan2,
                                lowerThan1
                            ], {
                                globalErrorMessage: errorMessage,
                                hideRootCause: hideRoot
                            })(invalidInput);
                        });
                        test('Then a promise should be returned', () => {
                            expect(result).toBeInstanceOf(Promise);
                        });
                        test('Then the correct error message should be returned', async () => {
                            expect(await result).toStrictEqual(expectedErrorMessage);
                        });
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
                ['-123', 'The input "-123" is not a natural number. Please provide a natural number.'],
                ['', 'The input "" is not a natural number. Please provide a natural number.'],
                ['0123', 'The input "0123" is not a natural number. Please provide a natural number.']
            ])('When I test the resulting validation with the input "%s"', (input: string, expected: boolean | string) => {
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
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe.each([
                ['1234', true],
                ['-123', ''],
                ['', ''],
                ['0123', '']
            ])('When I test the resulting validation function with the input "%s"', (input: string, expected: boolean | string) => {
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
                ['-123', 'The input "-123" should match the regex /^[1-9]\\d*$/.'],
                ['', 'The input "" should match the regex /^[1-9]\\d*$/.'],
                ['0123', 'The input "0123" should match the regex /^[1-9]\\d*$/.']
            ])('When I test the resulting validation with the input "%s"', (input: string, expected: boolean | string) => {
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
                ['1234', 'The input "1234" is a natural number. Please do not provide a natural number.']
            ])('When I test the resulting validation function with the input "%s"', (input: string, expected: boolean | string) => {
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
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe.each([
                ['-123', true],
                ['', true],
                ['0123', true],
                ['1234', '']
            ])('When I test the resulting validation function with the input "%s"', (input: string, expected: boolean | string) => {
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
                ['1234', 'The input "1234" should not match the regex /^[1-9]\\d*$/.']
            ])('When I test the resulting validation function with the input "%s"', (input: string, expected: boolean | string) => {
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

describe('nonBlankValidation', () => {
    describe.each([
        ['notBlank', true],
        ['not Blank but with spaces ', true],
        ['', '"" is blank. Only word which are not blank are expected.'],
        [' ', '" " is blank. Only word which are not blank are expected.'],
        ['  ', '"  " is blank. Only word which are not blank are expected.'],
        ['\t \n', '"\t \n" is blank. Only word which are not blank are expected.'],
        ['\t', '"\t" is blank. Only word which are not blank are expected.'],
        ['\n', '"\n" is blank. Only word which are not blank are expected.']
    ])('When I call "nonBlankValidation"', (input: string, expected: boolean | string) => {
        let result: Promise<boolean | string>;
        beforeEach(() => {
            result = nonBlankValidation()(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
    describe('Given the non valid input ""', () => {
        const invalidInput = '';
        describe.each([
            [undefined, '"" is blank. Only word which are not blank are expected.'],
            ['nope, blank: "%s"', 'nope, blank: ""'],
            ['', '']
        ])('when I call "nonBlankValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = nonBlankValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
        });
    });
});

describe('noWhiteSpaceValidation', () => {
    describe.each([
        ['noWhiteSpace', true],
        [' whiteAtTheBeginning', '" whiteAtTheBeginning" contains white chars. Only word with no white char are allowed.'],
        [' \ttwoWhitesAtTheBeginning', '" \ttwoWhitesAtTheBeginning" contains white chars. Only word with no white char are allowed.'],
        ['whiteAtTheEnd ', '"whiteAtTheEnd " contains white chars. Only word with no white char are allowed.'],
        ['twoWhitesAtTheEnd \n', '"twoWhitesAtTheEnd \n" contains white chars. Only word with no white char are allowed.'],
        ['white inTheMiddle', '"white inTheMiddle" contains white chars. Only word with no white char are allowed.'],
        ['multiple white  in the middle', '"multiple white  in the middle" contains white chars. Only word with no white char are allowed.'],
        [' white at the beginning, middle and end ', '" white at the beginning, middle and end " contains white chars. Only word with no white char are allowed.']
    ])('WHen I call "noWhiteSpaceValidation" on the input "%s"', (input: string, expected: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noWhiteSpaceValidation()(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
    describe('Given the non valid input " <here <here"', () => {
        const invalidInput = ' <here <here';
        describe.each([
            [undefined, '" <here <here" contains white chars. Only word with no white char are allowed.'],
            ['nope, white space: "%s"', 'nope, white space: " <here <here"'],
            ['', '']
        ])('when I call "noWhiteSpaceValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = noWhiteSpaceValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
        });
    });
});

describe('doNotStartWithNumberValidation', () => {
    describe.each([
        ['noNumber', true],
        ['numberAtTheEnd123', true],
        ['number1In2The3Middle', true],
        [' 123leadingWhiteSpaceBeforeNumber', true],
        ['123leadingNumber', '"123leadingNumber" starts with a number. Only word with no leading number are expected.']
    ])('When I call "doNotStartWithNumberValidation" on the input "%s"', (input: string, expected: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = doNotStartWithNumberValidation()(input);
        });
        test('Then a promise is returned', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expected);
        });
    });
    describe('Given the non valid input "9<here"', () => {
        const invalidInput = '9<here';
        describe.each([
            [undefined, '"9<here" starts with a number. Only word with no leading number are expected.'],
            ['nope, start with a number: "%s"', 'nope, start with a number: "9<here"'],
            ['', '']
        ])('when I call "doNotStartWithNumberValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = doNotStartWithNumberValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
        });
    });
});

describe('noTrailingWhiteSpaceValidation', () => {
    describe.each([
        ['noTrailingWhiteSpace', true],
        [' leadingButNoTrailing', true],
        ['space\nin\tbetween but not trailing', true],
        ['withOneTrailing ', '"withOneTrailing " contains a trailing blank char. A valid input should not have trailing white space.'],
        ['withOneWeirdTrailing\n', '"withOneWeirdTrailing\n" contains a trailing blank char. A valid input should not have trailing white space.'],
        ['withMoreThanOneTrailing \t', '"withMoreThanOneTrailing \t" contains a trailing blank char. A valid input should not have trailing white space.']
    ])('When I call "noTrailingWhiteSpaceValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noTrailingWhiteSpaceValidation()(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
    describe('Given the non valid input "here> "', () => {
        const invalidInput = 'here> ';
        describe.each([
            [undefined, '"here> " contains a trailing blank char. A valid input should not have trailing white space.'],
            ['nope, contains trailing white space "%s"', 'nope, contains trailing white space "here> "'],
            ['', '']
        ])('when I call "noTrailingWhiteSpaceValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = noTrailingWhiteSpaceValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
        });
    });
});

describe('noLeadingWhiteSpaceValidation', () => {
    describe.each([
        ['noLeadingWhiteSpace', true],
        ['trailingButNoLeading ', true],
        ['space\nin\tbetween but not leading', true],
        [' withOneLeading', '" withOneLeading" contains a leading blank char. A valid input should not have leading white space.'],
        ['\twithOneWeirdLeading', '"\twithOneWeirdLeading" contains a leading blank char. A valid input should not have leading white space.'],
        [' \t withMoreThanOneLeading', '" \t withMoreThanOneLeading" contains a leading blank char. A valid input should not have leading white space.']
    ])('When I call "noLeadingWhiteSpaceValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noLeadingWhiteSpaceValidation()(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
    describe('Given the non valid input " <here"', () => {
        const invalidInput = ' <here';
        describe.each([
            [undefined, '" <here" contains a leading blank char. A valid input should not have leading white space.'],
            ['nope, contains leading white space "%s"', 'nope, contains leading white space " <here"'],
            ['', '']
        ])('when I call "noLeadingWhiteSpaceValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = noLeadingWhiteSpaceValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
        });
    });
});

describe('noInnerWhiteSpaceValidation', () => {
    describe.each([
        ['noMiddleBlank', true],
        [' blankAtStartButNotInMiddle', true],
        ['blankAtEndButNotInMiddle\n', true],
        ['with oneMiddleBlank\n', '"with oneMiddleBlank\n" contains a blank char in the middle. A valid input should not have inner white space.'],
        ['with oneMiddleBlank', '"with oneMiddleBlank" contains a blank char in the middle. A valid input should not have inner white space.'],
        ['with more\tthan one\nmiddle blank', '"with more\tthan one\nmiddle blank" contains a blank char in the middle. A valid input should not have inner white space.']
    ])('When I call "noInnerWhiteSpaceValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
        let result: Promise<boolean | string> | undefined;
        beforeEach(() => {
            result = noInnerWhiteSpaceValidation()(input);
        });
        test('Then a promise is return', () => {
            expect(result).toBeInstanceOf(Promise);
        });
        test('Then the correct value should be returned', async () => {
            expect(await result).toStrictEqual(expectedResult);
        });
    });
    describe('Given the non valid input "here> <here"', () => {
        const invalidInput = 'here> <here';
        describe.each([
            [undefined, '"here> <here" contains a blank char in the middle. A valid input should not have inner white space.'],
            ['nope, contains inner white space "%s"', 'nope, contains inner white space "here> <here"'],
            ['', '']
        ])('when I call "noInnerWhiteSpaceValidation" on the invalid input with the errorMessage "%s"', (errorMessageTemplate: string | undefined, expectedErrorMessage: string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = noInnerWhiteSpaceValidation(errorMessageTemplate)(invalidInput);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct returned string is expected', async () => {
                expect(await result).toStrictEqual(expectedErrorMessage);
            });
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
                result = kebabCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "kebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = kebabCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"notKebabCase" is not a valid kebab-case. Only kebab-case inputs are expected.');
                });
            });
        });
        describe('and the custom error message "nope, not a kebab-case: %s"', () => {
            const errorMessage = 'nope, not a kebab-case: "%s"';
            describe('When I call "kebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = kebabCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not a kebab-case: "notKebabCase"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "kebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = kebabCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
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
                result = screamingKebabCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "screamingKebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingKebabCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"not-screaming-kebab-case" is not a valid SCREAMING-KEBAB-CASE. Only SCREAMING-KEBAB-CASE inputs are expected.');
                });
            });
        });
        describe('and the custom error message "nope, not a SCREAMING-KEBAB-CASE: %s"', () => {
            const errorMessage = 'nope, not a SCREAMING-KEBAB-CASE: "%s"';
            describe('When I call "screamingKebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingKebabCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not a SCREAMING-KEBAB-CASE: "not-screaming-kebab-case"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "screamingKebabCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingKebabCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
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
                result = snakeCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "snakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = snakeCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"not-snake-case" is not a valid snake_case. Only snake_case inputs are expected.');
                });
            });
        });
        describe('and the custom error message "nope, not a snake_case: %s"', () => {
            const errorMessage = 'nope, not a snake_case: "%s"';
            describe('When I call "snakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = snakeCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not a snake_case: "not-snake-case"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "snakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = snakeCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
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
                result = screamingSnakeCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "screamingSnakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingSnakeCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"not_screaming_snake_case" is not a valid SCREAMING_SNAKE_CASE. Only SCREAMING_SNAKE_CASE inputs are expected.');
                });
            });
        });
        describe('and the custom error message "nope, not SCREAMING_SNAKE_CASE: %s"', () => {
            const errorMessage = 'nope, not SCREAMING_SNAKE_CASE: "%s"';
            describe('When I call "screamingSnakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingSnakeCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not SCREAMING_SNAKE_CASE: "not_screaming_snake_case"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "screamingSnakeCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = screamingSnakeCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
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
                result = camelCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "camelCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = camelCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"not-camel-case" is not a valid camelCase. Only camelCase inputs are expected.');
                });
            });
        });
        describe('and the custom error message "nope, not a camelCase: %s"', () => {
            const errorMessage = 'nope, not a camelCase: "%s"';
            describe('When I call "camelCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = camelCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not a camelCase: "not-camel-case"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "camelCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = camelCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
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
                result = pascalCaseValidation()(input);
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
        describe('and no custom error message', () => {
            describe('When I call "pascalCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = pascalCaseValidation()(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('"not-pascal-case" is not a valid PascalCase. Only PascalCase inputs are expected.');
                });
            });
        });
        describe('and a custom error message "nope, not a PascalCase: %s"', () => {
            const errorMessage = 'nope, not a PascalCase: "%s"';
            describe('When I call "pascalCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = pascalCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('nope, not a PascalCase: "not-pascal-case"');
                });
            });
        });
        describe('and a "falsy" string error message', () => {
            const errorMessage = '';
            describe('When I call "pascalCaseValidation" on this input', () => {
                beforeEach(() => {
                    result = pascalCaseValidation(errorMessage)(input);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then the promise contains the appropriate message', async () => {
                    expect(await result).toStrictEqual('');
                });
            });
        });
    });
});

describe('integerValidation', () => {
    describe('Given no custom error message', () => {
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
        ])('When I call "integerValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = integerValidation()(input);
            });
            test('Then a promise is return', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value should be returned', async () => {
                expect(await result).toStrictEqual(expectedResult);
            });
        });
    });
    describe('Given a custom error message "nope, not an integer: %s"', () => {
        const errorMessage = 'nope, not an integer: "%s"';
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
            ['10e-3', 'nope, not an integer: "10e-3"'],
            ['-0.01', 'nope, not an integer: "-0.01"'],
            ['12 3', 'nope, not an integer: "12 3"'],
            ['12e999', 'nope, not an integer: "12e999"'],
            ['one', 'nope, not an integer: "one"'],
            ['.0.1', 'nope, not an integer: ".0.1"'],
            ['0o88', 'nope, not an integer: "0o88"'],
            ['0b12', 'nope, not an integer: "0b12"'],
            ['0xGG', 'nope, not an integer: "0xGG"'],
            ['12e', 'nope, not an integer: "12e"'],
            ['1,000,000.00', 'nope, not an integer: "1,000,000.00"'],
            ['Infinity', 'nope, not an integer: "Infinity"']
        ])('When I call "integerValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = integerValidation(errorMessage)(input);
            });
            test('Then a promise is return', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value should be returned', async () => {
                expect(await result).toStrictEqual(expectedResult);
            });
        });
    });
    describe('Given a "falsy" string custom error message', () => {
        const errorMessage = '';
        describe('And a non valid input', () => {
            const invalidInput = '1.1';
            describe('When I call "integerValidation" with those parameters', () => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = integerValidation(errorMessage)(invalidInput);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then an empty string is returned as error message', async () => {
                    expect(await result).toStrictEqual('');
                });
            });
        });
    });
});

describe('naturalNumberValidation', () => {
    describe('Given no custom error message', () => {
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
        ])('When I call "naturalNumberValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = naturalNumberValidation()(input);
            });
            test('Then a promise is return', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value should be returned', async () => {
                expect(await result).toStrictEqual(expectedResult);
            });
        });
    });
    describe('Given a custom error message "nope, not a natural number: %s"', () => {
        const errorMessage = 'nope, not a natural number: "%s"';
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
            ['', 'nope, not a natural number: ""'],
            ['10e-3', 'nope, not a natural number: "10e-3"'],
            ['-0.01', 'nope, not a natural number: "-0.01"'],
            ['-123', 'nope, not a natural number: "-123"'],
            ['0', 'nope, not a natural number: "0"'],
            ['-1', 'nope, not a natural number: "-1"'],
            ['12 3', 'nope, not a natural number: "12 3"'],
            ['12e999', 'nope, not a natural number: "12e999"'],
            ['one', 'nope, not a natural number: "one"'],
            ['.0.1', 'nope, not a natural number: ".0.1"'],
            ['0o88', 'nope, not a natural number: "0o88"'],
            ['0b12', 'nope, not a natural number: "0b12"'],
            ['0xGG', 'nope, not a natural number: "0xGG"'],
            ['12e', 'nope, not a natural number: "12e"'],
            ['1,000,000.00', 'nope, not a natural number: "1,000,000.00"'],
            ['Infinity', 'nope, not a natural number: "Infinity"']
        ])('When I call "naturalNumberValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = naturalNumberValidation(errorMessage)(input);
            });
            test('Then a promise is return', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value should be returned', async () => {
                expect(await result).toStrictEqual(expectedResult);
            });
        });
    });
    describe('Given a "falsy" string custom error message', () => {
        const errorMessage = '';
        describe('And a non valid input', () => {
            const invalidInput = '-1';
            describe('When I call "numberValidation" with those parameters', () => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = naturalNumberValidation(errorMessage)(invalidInput);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then an empty string is returned as error message', async () => {
                    expect(await result).toStrictEqual('');
                });
            });
        });
    });
});

describe('numberValidation', () => {
    describe('Given no custom error message', () => {
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
        ])('When I call "numberValidation" on the input "%s"', (input: string, expectedResult: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = numberValidation()(input);
            });
            test('Then a Promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value should be returned', async () => {
                expect(await result).toStrictEqual(expectedResult);
            });
        });
    });
    describe('Given a custom error message "not a proper number: %s"', () => {
        const errorMessage = 'not a proper number: "%s"';
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
            ['12 3', 'not a proper number: "12 3"'],
            ['12e999', 'not a proper number: "12e999"'],
            ['one', 'not a proper number: "one"'],
            ['.0.1', 'not a proper number: ".0.1"'],
            ['0o88', 'not a proper number: "0o88"'],
            ['0b12', 'not a proper number: "0b12"'],
            ['0xGG', 'not a proper number: "0xGG"'],
            ['12e', 'not a proper number: "12e"'],
            ['1,000,000.00', 'not a proper number: "1,000,000.00"'],
            ['Infinity', 'not a proper number: "Infinity"']
        ])('', (input: string, expected: boolean | string) => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = numberValidation(errorMessage)(input);
            });
            test('Then a promise is returned', () => {
                expect(result).toBeInstanceOf(Promise);
            });
            test('Then the correct value is returned', async () => {
                expect(await result).toStrictEqual(expected);
            });
        });
    });
    describe('Given a "falsy" string custom error message', () => {
        const errorMessage = '';
        describe('And a non valid input', () => {
            const invalidInput = 'one';
            describe('When I call "numberValidation" with those parameters', () => {
                let result: Promise<boolean | string> | undefined;
                beforeEach(() => {
                    result = numberValidation(errorMessage)(invalidInput);
                });
                test('Then a promise is returned', () => {
                    expect(result).toBeInstanceOf(Promise);
                });
                test('Then an empty string is returned as error message', async () => {
                    expect(await result).toStrictEqual('');
                });
            });
        });
    });
});

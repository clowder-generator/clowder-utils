import {
    camelCaseValidation,
    integerValidation,
    naturalNumberValidation,
    numberValidation,
    pascalCaseValidation,
    screamingKebabCaseValidation,
    screamingSnakeCaseValidation,
    snakeCaseValidation
} from './validator-helper';

describe('validateWith', () => { xtest('Then ', () => {}); });
describe('nonBlankValidation', () => { xtest('Then ', () => {}); });
describe('noUndefined', () => { xtest('Then ', () => {}); });
describe('doNotStartWithNumberValidation', () => { xtest('Then', () => {}); });
describe('noTrailingWhiteSpaceValidation', () => { xtest('Then', () => {}); });
describe('noLeadingWhiteSpaceValidation', () => { xtest('Then', () => {}); });
describe('noInnerWhiteSpaceValidation', () => { xtest('Then', () => {}); });

// assertRegexMatch  and regexShouldNotMatchValidation will be another higher order function that will return a validationFunction based on the provided regex
// both of them should have a regex in input and an optional error message as well (if not, default to say that 'input' does or not match the regex
describe('regexMatchValidation', () => { xtest('Then ', () => {}); });
describe('regexShouldNotMatchValidation', () => { xtest('Then ', () => {}); });
describe('noMiddleBlankValidation', () => { xtest('Then ', () => {}); });
describe('kebabCaseValidation', () => { xtest('Then ', () => {}); });
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

import {
    naturalNumberValidation,
    numberValidation
} from './validator-helper';

describe('validateWith', () => { xtest('Then ', () => {}); });
describe('nonBlankValidation', () => { xtest('Then ', () => {}); });

// assertRegexMatch will be another higher order function that will return a validationFunction based on the provided regex
describe('regexMatchValidation', () => { xtest('Then ', () => {}); });
describe('noMiddleBlankValidation', () => { xtest('Then ', () => {}); });
describe('kebabCaseValidation', () => { xtest('Then ', () => {}); });
describe('screamingKebabCaseValidation', () => { xtest('Then ', () => {}); });
describe('snakeCaseValidation', () => { xtest('Then ', () => {}); });
describe('screamingSnakeCaseValidation', () => { xtest('Then ', () => {}); });
describe('camelCaseValidation', () => { xtest('Then ', () => {}); });
describe('pascalCaseValidation', () => { xtest('Then ', () => {}); });
describe('integerValidation', () => { xtest('Then ', () => {}); });
describe('naturalNumberValidation', () => {
    describe.each([
        ['0', true],
        ['1', true],
        ['1234', true],
        ['1.0', true],
        ['+123', true],
        ['10e3', true],
        ['0123', true],
        ['0xBABE', true],
        ['0o10', true],
        ['0b10', true],
        ['', '"" is not a natural number. Only finite natural number are expected.'],
        ['10e-3', '"10e-3" is not a natural number. Only finite natural number are expected.'],
        ['-0.01', '"-0.01" is not a natural number. Only finite natural number are expected.'],
        ['-1', '"-1" is not a natural number. Only finite natural number are expected.'],
        ['-123', '"-123" is not a natural number. Only finite natural number are expected.'],
        ['0', '"0" is not a natural number. Only finite natural number are expected.'],
        ['-1', '"-1" is not a natural number. Only finite natural number are expected.'],
        [undefined, 'undefined is not a valid number. Only unformatted finite natural number are expected.'],
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
    xtest('Then ', () => {});
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

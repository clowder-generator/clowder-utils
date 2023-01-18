import { numberValidation } from './validator-helper';

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
describe('naturalNumberValidation', () => { xtest('Then ', () => {}); });
describe('numberValidation', () => {
    let input: string = '';
    describe('Given an inputted number', () => {
        beforeEach(() => {
            // TODO: adapt to put several valid value (decimal like decimal and minus)
            input = '1234';
        });
        describe('When I call "assertNumber" on this input', () => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = numberValidation(input);
            });
            test('Then a boolean Promise is returned', () => {
                expect(result).toBeInstanceOf(Promise<boolean>);
            });
            test('Then a "true" should be returned', async () => {
                expect(await result).toStrictEqual(true);
            });
        });
    });
    describe.each([
        ['12 3', '"12 3" is not a number. Only unformatted numbers are expected.'],
        ['1e2', '"1e2" is not a number. Only unformatted numbers are expected.'],
        ['one', '"one" is not a number. Only unformatted numbers are expected.'],
        ['1,000,000.00', '"1,000,000.00" is not a number. Only unformatted numbers are expected.']
    ])('Given an input "%s" which is not a number', (input: string, expectedMessage: string) => {
        describe('When I call "assertNumber" on this input', () => {
            let result: Promise<boolean | string> | undefined;
            beforeEach(() => {
                result = numberValidation(input);
            });
            test('Then a string Promise is returned', () => {
                expect(result).toBeInstanceOf(Promise<string>);
            });
            test('Then a string that explain that a number is expected is returned', async () => {
                expect(await result).toBe(expectedMessage);
            });
        });
    });
});

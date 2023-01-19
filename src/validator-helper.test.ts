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
    describe.each([
        ['0', true],
        ['1', true],
        ['1234', true],
        ['1.0', true],
        ['-123', true],
        ['-1', true],
        ['-0.01', true],
        [undefined, 'undefined is not a valid number. Only unformatted numbers are expected.'],
        ['12 3', '"12 3" is not a valid number. Only unformatted numbers are expected.'],
        ['one', '"one" is not a valid number. Only unformatted numbers are expected.'],
        ['.0.1', '".0.1" is not a valid number. Only unformatted numbers are expected.'],
        ['1,000,000.00', '"1,000,000.00" is not a valid number. Only unformatted numbers are expected.']
    ])('When I call "assertNumber" on the input "%s"', (input: string | undefined, expectedResult: boolean | string) => {
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

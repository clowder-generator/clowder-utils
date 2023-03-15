import { instance, mock, when } from 'ts-mockito';
import {
    Context,
    mergeTemplateContext,
    silentIfSameValue,
    TemplateContextMergeConflictError
} from './context';
import { ITemplateData } from './yeoman-helper';

describe('mergeTemplateContext', () => {
    let result: ITemplateData | undefined;
    let exception: Error | undefined;
    afterEach(() => {
        result = undefined;
        exception = undefined;
    });

    describe('Given two contexts', () => {
        const context1: Context = mock<Context>();
        const context2: Context = mock<Context>();

        const templateContext1: ITemplateData = {
            first: 'one',
            second: 'two'
        };

        beforeEach(() => {
            when(context1.templateContext).thenReturn(() => templateContext1);
        });

        describe('with no conflicted template context', () => {
            const templateContext2: ITemplateData = {
                third: 'three'
            };
            beforeEach(() => {
                when(context2.templateContext).thenReturn(() => templateContext2);
            });

            describe('When I call "mergeTemplateContext" on them', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I got no error', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then I got a defined object ITemplateData', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then I got a new ITemplateData with all field from both templateContext', () => {
                    expect(result).toEqual({
                        first: 'one',
                        second: 'two',
                        third: 'three'
                    });
                });
            });
        });

        describe('with conflicted template context but with same value', () => {
            const templateContext2: ITemplateData = {
                second: 'two',
                third: 'three'
            };

            beforeEach(() => {
                when(context2.templateContext).thenReturn(() => templateContext2);
            });

            describe('and no overlapping merge strategy', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I do not get a result', () => {
                    expect(result).toBeUndefined();
                });
                test('Then I got an error', () => {
                    expect(exception).not.toBeUndefined();
                });
                test('Then the exception is of type "TemplateContextMergeConflictError"', () => {
                    expect(exception).toBeInstanceOf(TemplateContextMergeConflictError);
                });
                test('Then the message should tell the first field which is in conflict', () => {
                    expect(exception?.message).toEqual('Merge conflict for field "second".');
                });
            });
            describe('and an overlapping merge strategy "silentIfSameValue"', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(silentIfSameValue, instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I should not get an exception', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then I got a result', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the result should contains the fields "first, second, third"', () => {
                    expect(result).toEqual({
                        first: 'one',
                        second: 'two',
                        third: 'three'
                    });
                });
            });
        });
        describe('with conflicted template context but with different value (real conflict)', () => {
            const templateContext2: ITemplateData = {
                second: 'bis',
                third: 'three'
            };

            beforeEach(() => {
                when(context2.templateContext).thenReturn(() => templateContext2);
            });

            describe('and no overlapping merge strategy', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I do not get a result', () => {
                    expect(result).toBeUndefined();
                });
                test('Then I got an error', () => {
                    expect(exception).not.toBeUndefined();
                });
                test('Then the exception is of type "TemplateContextMergeConflictError"', () => {
                    expect(exception).toBeInstanceOf(TemplateContextMergeConflictError);
                });
                test('Then the message should tell the first field which is in conflict', () => {
                    expect(exception?.message).toEqual('Merge conflict for field "second".');
                });
            });
            describe('and an overlapping merge strategy "silentIfSameValue"', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(silentIfSameValue, instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I do not get a result', () => {
                    expect(result).toBeUndefined();
                });
                test('Then I got an error', () => {
                    expect(exception).not.toBeUndefined();
                });
                test('Then the exception is of type "TemplateContextMergeConflictError"', () => {
                    expect(exception).toBeInstanceOf(TemplateContextMergeConflictError);
                });
                test('Then the message should tell the first field which is in conflict', () => {
                    expect(exception?.message).toEqual('Merge conflict for field "second". cause: value are different "two" vs. "bis"');
                });
            });
        });
    });
});
describe('mergeTemplatePath', () => {
    describe('Given a set of valid context', () => {
        describe.each([
            ['one context, with template path as a single string', ['path'], 'path'],
            ['one context, with template path as an array with one element', [['path']], ['path']],
            ['one context, with template path as an array with multiple unique element', [['p1', 'p2', 'p3']], ['p1', 'p2', 'p3']],
            ['one context, with template path as an array with multiple overlapping element', [['p1', 'p2', 'p2', 'p3', 'p3', 'p3']], ['p1', 'p2', 'p3']],
            ['two contexts, both with only one string as templatePath, no overlap', ['p1', 'p2'], ['p1', 'p2']],
            ['two contexts, both with only one string as templatePath, with overlap', ['p1', 'p1'], ['p1']],
            ['two contexts, both with an array of only one string as templatePath, no overlap', [['p1'], ['p2']], ['p1', 'p2']],
            ['two contexts, both with an array of only one string as templatePath, with overlap', [['p1'], ['p1']], ['p1']],
            ['two contexts, both with an array of multiple string as templatePath, no overlap', [['p1', 'p2', 'p3'], ['p4', 'p5']], ['p1', 'p2', 'p3', 'p4', 'p5']],
            ['two contexts, both with an array of multiple string as templatePath, with overlap', [['p1', 'p2', 'p3'], ['p2', 'p4']], ['p1', 'p2', 'p3', 'p4']],
            ['three contexts, with a mix of string and arrays of one or multiple string as templatePath, no overlap', ['todo'], []],
            ['three contexts, with a mix of string and arrays of one or multiple string as templatePath, with overlap', ['todo'], []],
            ['three contexts, with a mix of string and arrays of one or multiple string as templatePath, no overlap', ['todo'], []],
            ['', [], ['expected']]
        ])('%s', (description: string, templatePath: Array<string | string[]>, expectedAfterMerge: string | string[]) => {

        });
    });
    describe('Given a context wih an empty array of string as templatePath', () => {
        describe('When I call "mergeTemplatePath"', () => {
            test('Then I got an error', () => {});
            test('Then I do not have a result', () => {});
            test('Then the error is of type "TODO"', () => {});
            test('Then the error contains the error message "TODO"', () => {});
        });
    });
});
xdescribe('mergeDestinationPathProcessor', () => {});

import { instance, mock, when } from 'ts-mockito';
import { Context, mergeTemplateContext, silentIfSameValue, TemplateContextMergeConflictError } from './context';
import { ITemplateData } from './yeoman-helper';

describe('mergeTemplateContext', () => {
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
                let result: ITemplateData | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
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
                let result: ITemplateData | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
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
                let result: ITemplateData | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(silentIfSameValue, instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
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
                let result: ITemplateData | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
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
                let result: ITemplateData | undefined;
                let exception: Error | undefined;
                beforeEach(() => {
                    try {
                        result = mergeTemplateContext(silentIfSameValue, instance(context1), instance(context2));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                afterEach(() => {
                    result = undefined;
                    exception = undefined;
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
xdescribe('mergeTemplatePath', () => {});
xdescribe('mergeDestinationPathProcessor', () => {});

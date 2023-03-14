import { instance, mock, when } from 'ts-mockito';
import {
    Context,
    mergeTemplateContext,
    mergeTemplatePath,
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
xdescribe('mergeTemplatePath', () => {
    let result: string | string[] | undefined;
    let exception: Error | undefined;
    afterEach(() => {
        result = undefined;
        exception = undefined;
    });
    describe('Given one context', () => {
        let context: Context;
        beforeEach(() => {
            context = mock<Context>();
        });
        describe('and the context has a single templatePath', () => {
            beforeEach(() => {
                when(context.templatePath).thenReturn(() => 'element1');
            });
            describe('When I call "mergeTemplatePath"', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplatePath(instance(context));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then there is no error', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then the resulting templatePath is defined', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the resulting templatePath is as expected', () => {
                    expect(result).toEqual('element1');
                });
            });
        });
        describe('and the context has an array of templatePath', () => {
            describe('and this array of templatePath contains unique elements', () => {
                beforeEach(() => {
                    when(context.templatePath).thenReturn(() => ['element1', 'element2']);
                });
                describe('When I call "mergeTemplatePath"', () => {
                    beforeEach(() => {
                        try {
                            result = mergeTemplatePath(instance(context));
                        } catch (error: unknown) {
                            exception = error as Error;
                        }
                    });
                    test('Then there is no error', () => {
                        expect(exception).toBeUndefined();
                    });
                    test('Then the resulting templatePath is defined', () => {
                        expect(result).not.toBeUndefined();
                    });
                    test('Then the resulting templatePath is an array', () => {
                        expect(result).toBeInstanceOf(Array);
                    });
                    test('Then the resulting templatePath contains 2 elements', () => {
                        expect((result as string[]).length).toEqual(2);
                    });
                    test('Then the resulting templatePath is as expected', () => {
                        expect(result).toEqual(['element1', 'element2']);
                    });
                });
            });
            describe('and this array of templatePath contains not only unique elements', () => {});
        });
    });
    describe('Given two context', () => {
        describe('and the first context has a single templatePath', () => {
            describe('and the second context contains a single templatePath', () => {
                describe('and there is no overlap between templatePath of each context', () => {});
                describe('and there is overlap between templatePath of each context', () => {});
            });
            describe('and the second context contains an array of templatePath', () => {
                describe('and there is no overlap between templatePath of each context', () => {});
                describe('and there is overlap between templatePath of each context', () => {});
            });
        });
        describe('and the first context has an array of templatePath', () => {});
    });
    describe('Given 3 context', () => {
        describe('and each containing only a single templatePath', () => {});
        describe('and each containing an array of templatePath', () => {});
        describe('and all of them contains empty array', () => {});
    });
});
xdescribe('mergeDestinationPathProcessor', () => {});

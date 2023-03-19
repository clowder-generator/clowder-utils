import { instance, mock, when } from 'ts-mockito';
import {
    Context, EmptyTemplatePath, mergeDestinationPathProcessor,
    mergeTemplateContext, mergeTemplatePath,
    silentIfSameValue,
    TemplateContextMergeConflictError
} from './context';
import { ITemplateData } from '../yeoman-helper';
import { DestinationPathProcessor } from '../destination-path-processor-helper/destination-path-processor';

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
    let result: string[] | undefined;
    let exception: Error | undefined;
    beforeEach(() => {
        result = undefined;
        exception = undefined;
    });
    describe('Given a set of valid context', () => {
        describe.each([
            ['one context, with template path as a single string', ['path'], ['path']],
            ['one context, with template path as an array with one element', [['path']], ['path']],
            ['one context, with template path as an array with multiple unique element', [['p1', 'p2', 'p3']], ['p1', 'p2', 'p3']],
            ['one context, with template path as an array with multiple overlapping element', [['p1', 'p2', 'p2', 'p3', 'p3', 'p3']], ['p1', 'p2', 'p3']],
            ['two contexts, both with only one string as templatePath, no overlap', ['p1', 'p2'], ['p1', 'p2']],
            ['two contexts, both with only one string as templatePath, with overlap', ['p1', 'p1'], ['p1']],
            ['two contexts, both with an array of only one string as templatePath, no overlap', [['p1'], ['p2']], ['p1', 'p2']],
            ['two contexts, both with an array of only one string as templatePath, with overlap', [['p1'], ['p1']], ['p1']],
            ['two contexts, both with an array of multiple string as templatePath, no overlap', [['p1', 'p2', 'p3'], ['p4', 'p5']], ['p1', 'p2', 'p3', 'p4', 'p5']],
            ['two contexts, both with an array of multiple string as templatePath, with overlap', [['p1', 'p2', 'p3'], ['p2', 'p4']], ['p1', 'p2', 'p3', 'p4']],
            ['three contexts, with a mix of string and arrays of one or multiple string as templatePath, no overlap', ['p1', ['p2'], ['p3', 'p4']], ['p1', 'p2', 'p3', 'p4']],
            ['three contexts, with a mix of string and arrays of one or multiple string as templatePath, with overlap', ['p1', ['p1'], ['p1', 'p2']], ['p1', 'p2']]
        ])('%s', (description: string, templatePath: Array<string | string[]>, expectedAfterMerge: string[]) => {
            let contexts: Context[] = [];
            beforeEach(() => {
                contexts = templatePath.map(_ => mock<Context>());
                contexts.forEach((context, index) => when(context.templatePath).thenReturn(() => templatePath[index]));
            });

            describe('When I call "mergeTemplatePath"', () => {
                beforeEach(() => {
                    try {
                        result = mergeTemplatePath(...contexts.map(context => instance(context)));
                    } catch (error: unknown) {
                        exception = error as Error;
                    }
                });
                test('Then I should not get an error', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then I should get a result', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then the result should be an array', () => {
                    expect(result).toBeInstanceOf(Array<string>);
                });
                test('Then the result should be as expected', () => {
                    expect(result).toEqual(expectedAfterMerge);
                });
            });
        });
    });
    describe.each([
        ['one context, one template path as string, empty', ''],
        ['one context, one template path as string, blank', ' '],
        ['one context, one template path as string, blank', '\t'],
        ['one context, one template path as string, blank', '\n'],
        ['one context, one template path as string, blank', '\t \n'],
        ['one context, one array of template path as string, one empty', ['']],
        ['one context, one empty array of template path', []],
        ['one context, one array of template path as string, multiple empty or blank', ['thisOneIsOk', '', ' ', '\n']]
    ])('Given %s', (description: string, input: string | string[]) => {
        let context: Context;
        beforeEach(() => {
            context = mock<Context>();
            when(context.templatePath).thenReturn(() => input);
        });

        describe('When I call "mergeTemplatePath"', () => {
            beforeEach(() => {
                try {
                    result = mergeTemplatePath(instance(context));
                } catch (error: unknown) {
                    exception = error as Error;
                }
            });
            test('Then I got an error', () => {
                expect(exception).not.toBeUndefined();
            });
            test('Then I do not have a result', () => {
                expect(result).toBeUndefined();
            });
            test('Then the error is of type "EmptyTemplatePath"', () => {
                expect(exception).toBeInstanceOf(EmptyTemplatePath);
            });
            test('Then the error contains the error message "invalid empty or blank templatePath"', () => {
                expect(exception?.message).toEqual('invalid empty or blank templatePath');
            });
        });
    });
});

describe('mergeDestinationPathProcessor', () => {
    describe('Given 3 defined destination path processors', () => {
        let pathProcessor1: DestinationPathProcessor;
        let pathProcessor1CallCounter: number;
        let pathProcessor2: DestinationPathProcessor;
        let pathProcessor2CallCounter: number;
        let pathProcessor3: DestinationPathProcessor;
        let pathProcessor3CallCounter: number;

        beforeEach(() => {
            pathProcessor1CallCounter = 0;
            pathProcessor2CallCounter = 0;
            pathProcessor3CallCounter = 0;
            pathProcessor1 = (pathToProcess: string) => {
                pathProcessor1CallCounter++;
                return pathToProcess;
            };
            pathProcessor2 = (pathToProcess: string) => {
                pathProcessor2CallCounter++;
                return pathToProcess;
            };
            pathProcessor3 = (pathToProcess: string) => {
                pathProcessor3CallCounter++;
                return pathToProcess;
            };
        });
        describe('And given 3 contexts', () => {
            let context1: Context;
            let context2: Context;
            let context3: Context;
            describe('and all three context returned those 3 processors', () => {
                beforeEach(() => {
                    context1 = mock<Context>();
                    when(context1.destinationPathProcessor).thenReturn(pathProcessor1);
                    context2 = mock<Context>();
                    when(context2.destinationPathProcessor).thenReturn(pathProcessor2);
                    context3 = mock<Context>();
                    when(context3.destinationPathProcessor).thenReturn(pathProcessor3);
                });

                describe('When I call "mergeDestinationPathProcessor"', () => {
                    let resultingFunction: DestinationPathProcessor;
                    beforeEach(() => {
                        resultingFunction = mergeDestinationPathProcessor(instance(context1), instance(context2), instance(context3));
                    });

                    test('Then I got a resulting function', () => {
                        expect(resultingFunction).not.toBeUndefined();
                    });

                    test('Then the resulting function is a function', () => {
                        expect(typeof resultingFunction).toEqual('function');
                    });

                    describe('And when I call the resulting function', () => {
                        let result: string | undefined;
                        const input = 'path';
                        beforeEach(() => {
                            result = resultingFunction?.(input);
                        });

                        test('Then result is not undefined', () => {
                            expect(result).not.toBeUndefined();
                        });

                        test('Then result is', () => {
                            expect(result).toEqual('path');
                        });

                        test('Then "pathProcessor1" has been called once', () => {
                            expect(pathProcessor1CallCounter).toEqual(1);
                        });

                        test('Then "pathProcessor2" has been called once', () => {
                            expect(pathProcessor2CallCounter).toEqual(1);
                        });

                        test('Then "pathProcessor3" has been called once', () => {
                            expect(pathProcessor3CallCounter).toEqual(1);
                        });
                    });
                });
            });
            describe('and two context have non undefined processor', () => {
                beforeEach(() => {
                    context1 = mock<Context>();
                    when(context1.destinationPathProcessor).thenReturn(pathProcessor1);
                    context2 = mock<Context>();
                    when(context2.destinationPathProcessor).thenReturn(undefined);
                    context3 = mock<Context>();
                    when(context3.destinationPathProcessor).thenReturn(pathProcessor3);
                });
                describe('When I call "mergeDestinationPathProcessor"', () => {
                    let resultingFunction: DestinationPathProcessor;
                    beforeEach(() => {
                        resultingFunction = mergeDestinationPathProcessor(instance(context1), instance(context2), instance(context3));
                    });

                    test('Then I got a resulting function', () => {
                        expect(resultingFunction).not.toBeUndefined();
                    });

                    test('Then the resulting function is a function', () => {
                        expect(typeof resultingFunction).toEqual('function');
                    });

                    describe('And when I call the resulting function', () => {
                        let result: string | undefined;
                        const input = 'path';
                        beforeEach(() => {
                            result = resultingFunction?.(input);
                        });

                        test('Then result is not undefined', () => {
                            expect(result).not.toBeUndefined();
                        });

                        test('Then result is', () => {
                            expect(result).toEqual('path');
                        });

                        test('Then "pathProcessor1" has been called once', () => {
                            expect(pathProcessor1CallCounter).toEqual(1);
                        });

                        test('Then "pathProcessor2" should not have been called once', () => {
                            expect(pathProcessor2CallCounter).toEqual(0);
                        });

                        test('Then "pathProcessor3" has been called once', () => {
                            expect(pathProcessor3CallCounter).toEqual(1);
                        });
                    });
                });
            });
            describe('and the 3 context have undefined destinationPathProcessor', () => {
                beforeEach(() => {
                    context1 = mock<Context>();
                    when(context1.destinationPathProcessor).thenReturn(undefined);
                    context2 = mock<Context>();
                    when(context2.destinationPathProcessor).thenReturn(undefined);
                    context3 = mock<Context>();
                    when(context3.destinationPathProcessor).thenReturn(undefined);
                });
                describe('When I call "mergeDestinationPathProcessor"', () => {
                    let resultingFunction: DestinationPathProcessor;
                    beforeEach(() => {
                        resultingFunction = mergeDestinationPathProcessor(instance(context1), instance(context2), instance(context3));
                    });

                    test('Then I get a  undefined resulting function', () => {
                        expect(resultingFunction).toBeUndefined();
                    });
                });
            });
        });
    });
});

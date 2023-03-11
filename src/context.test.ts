import { instance, mock, when } from 'ts-mockito';
import { Context, mergeTemplateContext } from './context';
import { ITemplateData } from './yeoman-helper';

describe('mergeTemplateContext', () => {
    describe('Given two contexts', () => {
        const context1: Context = mock<Context>();
        const context2: Context = mock<Context>();

        describe('with no conflicted template context', () => {
            const templateContext1: ITemplateData = {
                first: 'one',
                second: 'two'
            };
            const templateContext2: ITemplateData = {
                third: 'three'
            };
            beforeEach(() => {
                when(context1.templateContext).thenReturn(() => templateContext1);
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

                test('Then I got no error', () => {
                    expect(exception).toBeUndefined();
                });
                test('Then I got a defined object ITemplateData', () => {
                    expect(result).not.toBeUndefined();
                });
                test('Then I got a new ITemplateData with all field from both templateContext', () => {
                    // TODO
                });
            });
        });
        describe('with conflicted template context', () => {
            describe('and no overlapping merge strategy', () => {});
            describe('and an overlapping merge strategy', () => {});
        });
        describe('with one undefined template context', () => {});
        describe('with two undefined template context', () => {});
    });
});
xdescribe('mergeTemplatePath', () => {});
xdescribe('mergeDestinationPathProcessor', () => {});

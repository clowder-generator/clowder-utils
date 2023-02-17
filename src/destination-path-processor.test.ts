// Disclaimer: all tests will assume they are run on a *nix
// base system. There are no plans to support windows
describe('rename', () => {
    describe('Given a path as a string with no duplicated folder name', () => {
        describe('And a name to replace that is present in the path', () => {
            describe('When I call the "rename" higher function result on with the name to replace on the path', () => {
                test('Then the resulting string should not contains the previous name', () => {});
                test('Then the resulting string should be correctly updated', () => {});
            });
        });
        describe('And a name to replace that is not present in the path', () => {});
    });
    describe('Given a path as a string with duplicated folder name', () => {
        describe('And a name to replace that is present on time in the path', () => {});
        describe('And a name to replace that is present multiple time in the path', () => {});
        describe('And a name to replace that is not present in the path', () => {});
    });
});
describe('renameAll', () => {});

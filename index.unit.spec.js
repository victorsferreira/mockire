const assert = require('assert');
const { match, clearStubs, exact, reset, init, clearRequireCache } = require('./index');

describe('Unit tests', () => {
    const fixtures = {
        requiredMock: { foo: 'it\'s me' }
    };
    afterEach(() => {
        clearStubs()
    });
    beforeEach(() => {
        init()
    });

    describe('match', () => {
        it('must intercept requires with a given pattern', (done) => {
            match('some/path/*', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
        it('must intercept requires that contain the given path', (done) => {
            match('some/path/', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
        it('must intercept requires that is exactly the given path', (done) => {
            match('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
        it('must intercept correctly even if multiple stubs were passed', (done) => {
            const otherMock = {...fixtures.requiredMock, xpto: 'hello there'};

            match('./some/path/other/env.json', otherMock);
            match('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/other/env.json'), otherMock);
            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
        it('must fail if the required module does not contain given path', (done) => {
            match('./some/other/path/env.json', fixtures.requiredMock);

            try {
                require('./some/path/env.json');
                assert.fail('Should not be able to require this module');
            } catch (e) {
                done();
            }
        });
    });

    describe('exact', () => {
        it('must intercept requires with exactly the given path', (done) => {
            exact('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
        it('must fail if the required module is not exactly the given path', (done) => {
            exact('./some/other/path/env.json', fixtures.requiredMock);

            try {
                require('./some/path/env.json');
                assert.fail('Should not be able to require this module');
            } catch (e) {
                done();
            }
        });
    });

    describe('reset', () => {
        it('must stop using the interceptor if reset was invoked', (done) => {
            exact('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            reset();

            try {
                require('./some/path/env.json');
                assert.fail('Should not be able to require this module');
            } catch (err) {
                done();
            }
        });
    });

    describe('init', () => {
        it('must be able to init manually', (done) => {
            exact('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            reset();

            try {
                require('./some/path/env.json');
                assert.fail('Should not be able to require this module');
            } catch (err) {
                assert(err instanceof Error)
            }

            init();

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            done();
        });
    });

    describe('clearStubs', () => {
        it('must be able to clear stubs', (done) => {
            exact('./some/path/env.json', fixtures.requiredMock);

            assert.deepStrictEqual(require('./some/path/env.json'), fixtures.requiredMock);

            clearStubs();

            try {
                require('./some/path/env.json');
                assert.fail('Should not be able to require this module');
            } catch (err) {
                done();
            }
        });
    });

    describe('clearRequireCache', () => {
        it('must be able to clear the require cache', (done) => {
            assert.strictEqual(Object.keys(require.cache).length > 0, true)
            clearRequireCache();
            assert.strictEqual(Object.keys(require.cache).length === 0, true)
            done()
        });
    });
});

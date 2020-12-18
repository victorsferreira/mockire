const Mod = require('module');

const stubs = [];
const req = Mod.prototype.require;

function init () {
    Mod.prototype.require = function () {
        const filename = arguments[0];
    
        for (let stub of stubs) {
            // returns stub if matches
            if(test(filename, stub)) return stub.value;
        }
    
        // requires normally otherwise
        return req.apply(this, arguments);
    };
}

function test(filename, stub) {
    if (stub.type === 'match') {
        return filename.search(stub.pattern) !== -1;
    }

    if (stub.type === 'exact') {
        return filename === stub.input;
    }

    return false;
}

function match(input, value) {
    const pattern = new RegExp(input);
    stubs.push({ type: 'match', pattern, value });
}

function exact(input, value) {
    stubs.push({ type: 'exact', input, value });
}

function clearStubs() {
    stubs.splice(0, stubs.length);
}

function reset() {
    Mod.prototype.require = req;
}

function clearRequireCache() {
    Object.keys(require.cache).forEach((key) => {
        delete require.cache[key];
    });
}

init();

module.exports = {
    clearStubs,
    match,
    exact,
    reset,
    init,
    clearRequireCache
}
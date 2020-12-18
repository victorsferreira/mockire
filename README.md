This library allows developers to stub and clear the `require` built-in method. 

The Mockire interceptor is initialized as soon as the module is required.

Use with caution.

## Methods

- `match(pattern, value)`: matches the module path against a regular expression.
- `exact(input, value)`: expects the provided path to be exactly as required.
- `clearStubs()`: clears all stubs.
- `reset()`: removes the monkey patch.
- `init()`: initializes the interceptor.
- `clearRequireCache()`: clears all modules stored in the require cache. Modules will be loaded again next time `require` is invoked.

## Use cases:

### Clearing cache before tests start
```
const { clearRequireCache } = require('mockire');
let server;
describe('Unit tests', () => {
    before((done) => {
        clearRequireCache();
        server = require('./MyCustomServer');
    })
} 
```

### Loads fake dependencies
```
const { match } = require('mockire');
match('MyProjectDirectory/config/env/*', { port: 8000, db: { host: 'localhost', port: '27017' } });
const server = require('./MyCustomServer');

describe('Unit tests', () => {
    before((done) => {
        server.start()
    })
} 
```

### Creates virtual dependency
```
const { exact, clearStubs } = require('mockire');
if (!fs.existsSync('./path/customLib)) {
    exact('./path/customLib', { something });
}
const lib = require('./path/customLib');
await lib.foo();
clearStubs();
```
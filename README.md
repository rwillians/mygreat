# mygreat

Agnostic migration tool


## Usage

**Structure:**

```txt
- /
  - migrations/
    - 20171001190100.js
    - 20171001190200.js
  - remote-synced-sample/
  - .mygreat.js
```

**Migration file example:**

```js
'use strict'

module.exports = {
    up: async (db) => { },
    down: async (db) => { }
}
```


**`.mygreat.js` configuration file sample:**

```js
'use strict'

const Database = require('some-database')
const directory = require('@haoc-labs/mygreat-directory')

module.exports = (env) => ({
    local: directory('./migrations'),
    remote: directory('./remote-synced-sample'),
    setup: () => new Database('localhost')
})
```

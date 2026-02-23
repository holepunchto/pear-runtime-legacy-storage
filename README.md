# pear-runtime-legacy-storage

Read app storage from the Pear platform `hyperdb` (read-only).

## Installation

```bash
npm install pear-runtime-legacy-storage
```

## Usage

```javascript
const getAppStorage = require('pear-runtime-legacy-storage')
const storage = await getAppStorage('pear://my-app-key')
if (!storage) {
  console.log('Not found or failed to open DB')
} else {
  console.log(storage)
}
```

# alls (All Settled) - wait till all the promises settled
[![License](https://img.shields.io/github/license/rpgeeganage/alls.svg)](https://github.com/rpgeeganage/alls)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/rpgeeganage/alls.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rpgeeganage/alls/context:javascript)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8fc6d45ba07412a975fb823379cdbdf)](https://www.codacy.com/app/rpgeeganage/alls?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rpgeeganage/alls&amp;utm_campaign=Badge_Grade)
[![Build Status](https://travis-ci.org/rpgeeganage/alls.svg?branch=master)](https://travis-ci.org/rpgeeganage/alls)
[![Known Vulnerabilities](https://snyk.io/test/github/rpgeeganage/alls/badge.svg?targetFile=package.json)](https://snyk.io/test/github/rpgeeganage/alls?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/66cd49a28da26d6f51f1/maintainability)](https://codeclimate.com/github/rpgeeganage/alls/maintainability)
### Just another library with the sole purpose of waiting till all promises to complete. Nothing more, Nothing less.

### TypeScript Doc: [https://rpgeeganage.github.io/alls/doc/](https://rpgeeganage.github.io/alls/doc/)

### Basic Usage:
```js
const { alls } = require('alls');
```

#### Return value for ```Resolve```
```js
{
    status: 'fulfilled',
    value: <promise return value>
}
```

#### Return value for ```Reject```
```js
{
    status: 'rejected',
    reason: <Error thrown by promise>
}
```

### final output

```js
const error1 = new Error('error 1');
const error2 = new Error('error 2');
const error3 = new Error('error 3');

const results = await alls([
  Promise.resolve(1),
  Promise.reject(error1),
  Promise.resolve(2),
  Promise.reject(error2),
  Promise.resolve(3),
  Promise.reject(error3)
]);

/**
* content of the 'result'
*/
[
  { state: 'fulfilled', value: 1 },
  { state: 'rejected', reason: error1 },
  { state: 'fulfilled', value: 2 },
  { state: 'rejected', reason: error2 },
  { state: 'fulfilled', value: 3 },
  { state: 'rejected', reason: error3 }
]
```

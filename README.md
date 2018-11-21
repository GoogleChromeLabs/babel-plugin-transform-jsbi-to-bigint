# babel-plugin-transform-jsbi-to-bigint [![Build status](https://travis-ci.com/GoogleChromeLabs/babel-plugin-transform-jsbi-to-bigint.svg?branch=master)](https://travis-ci.com/GoogleChromeLabs/babel-plugin-transform-jsbi-to-bigint)

Compile [JSBI](https://github.com/GoogleChromeLabs/jsbi) code that works in today’s environments to native BigInt code.

## Example

Input using [JSBI](https://github.com/GoogleChromeLabs/jsbi):

```js
import JSBI from 'jsbi';

const a = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
const b = JSBI.BigInt(12);

JSBI.add(a, b);
JSBI.subtract(a, b);
JSBI.multiply(a, b);
JSBI.divide(a, b);
JSBI.remainder(a, b);
JSBI.exponentiate(a, b);
JSBI.leftShift(a, b);
JSBI.signedRightShift(a, b);
JSBI.bitwiseAnd(a, b);
JSBI.bitwiseOr(a, b);
JSBI.bitwiseXor(a, b);

JSBI.unaryMinus(a);
JSBI.bitwiseNot(a);

JSBI.equal(a, b);
JSBI.lessThan(a, b);
JSBI.lessThanOrEqual(a, b);
JSBI.greaterThan(a, b);
JSBI.greaterThanOrEqual(a, b);

a.toString();
JSBI.toNumber(a);
```

Transpiled output using [native `BigInt`s](https://developers.google.com/web/updates/2018/05/bigint):

```js
const a = BigInt(Number.MAX_SAFE_INTEGER);
const b = 12n;

a + b;
a - b;
a * b;
a / b;
a % b;
a ** b;
a << b;
a >> b;
a & b;
a | b;
a ^ b;

-a;
~a;

a === b;
a < b;
a <= b;
a > b;
a >= b;

a.toString();
Number(a);
```

See [the JSBI documentation](https://github.com/GoogleChromeLabs/jsbi) for more information.

## Installation

```sh
$ npm install babel-plugin-transform-jsbi-to-bigint
```

## Usage

### Via `.babelrc` (recommended)

`.babelrc`

```json
{
  "plugins": ["transform-jsbi-to-bigint"]
}
```

### Via CLI

```sh
$ babel --plugins transform-jsbi-to-bigint script.js
```

### Via Node.js API

```js
require('@babel/core').transform(code, {
  'plugins': ['transform-jsbi-to-bigint']
});
```

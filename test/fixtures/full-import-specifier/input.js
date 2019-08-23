// Copyright 2018 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the “License”);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// <https://apache.org/licenses/LICENSE-2.0>.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import JSBI from './foo/bar/jsbi.mjs';

const a = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
const b = JSBI.BigInt(12);
console.log(JSBI.add(a, b));
JSBI.BigInt('1');
JSBI.BigInt('34');
JSBI.BigInt('00034');

const JSBigInt = JSBI.BigInt;
JSBigInt(34);
const JSBigInt2 = JSBI['BigInt'];
JSBigInt2(56);
const JSBIadd = JSBI.add;
JSBIadd(7, 8);

JSBI.add(a, b);
JSBI.subtract(a, b);
JSBI.multiply(a, b);
JSBI.divide(a, b);
JSBI.remainder(a, b);
JSBI.exponentiate(a, b);
const c = JSBI.unaryMinus(a);
const d = JSBI.bitwiseNot(a);
JSBI.leftShift(a, b);
JSBI.signedRightShift(a, b);
JSBI.bitwiseAnd(a, b);
JSBI.bitwiseOr(a, b);
JSBI.bitwiseXor(a, b);

JSBI.equal(a, b);
JSBI.notEqual(a, b);
JSBI.lessThan(a, b);
JSBI.lessThanOrEqual(a, b);
JSBI.greaterThan(a, b);
JSBI.greaterThanOrEqual(a, b);

JSBI.EQ(a, b);
JSBI.NE(a, b);
JSBI.LT(a, b);
JSBI.LE(a, b);
JSBI.GT(a, b);
JSBI.GE(a, b);

a.toString();
JSBI.toNumber(a);
a instanceof JSBI;

JSBI.asIntN(64, JSBI.BigInt('42'));
JSBI.asUintN(64, JSBI.BigInt('42'));

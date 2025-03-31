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

const a = BigInt(Number.MAX_SAFE_INTEGER);
const b = 12n;
console.log(a + b);
1n;
34n;
BigInt('00034');
34n;
56n;
7 + 8;
a + b;
a - b;
a * b;
a / b;
a % b;
a ** b;
const c = -a;
const d = ~a;
a << b;
a >> b;
a & b;
a | b;
a ^ b;
a === b;
a !== b;
a < b;
a <= b;
a > b;
a >= b;
a == b;
a != b;
a < b;
a <= b;
a > b;
a >= b;
a.toString();
Number(a);
typeof a === "bigint";
BigInt.asIntN(64, 42n);
BigInt.asUintN(64, 42n);
const buffer = new ArrayBuffer(16);
// 0x7FFFFFFFFFFFFFFFn, the highest possible BigInt value that fits in
// a signed 64-bit integer.
const max = 9223372036854775807n;
const view = new DataView(buffer);
view.setBigInt64(1, max);
const result = view.getBigInt64(1);
console.log(result.toString());
// → '9223372036854775807'

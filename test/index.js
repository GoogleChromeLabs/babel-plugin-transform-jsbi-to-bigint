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

import path from 'path';
import fs from 'fs';
import assert from 'assert';
import {transformFileSync, transformSync, parseSync} from '@babel/core';
import plugin from '../src/index.js';

describe('babel-plugin-transform-jsbi-to-bigint', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const inputPath = path.join(fixtureDir, 'input.js');
      const actual = transformFileSync(inputPath, {
        'plugins': [
          plugin,
        ],
      }).code;
      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js'),
      ).toString();
      // To update expectation files:
      // fs.writeFileSync(
      //     path.join(fixtureDir, 'expected.js'),
      //     `${actual.trim()}\n`);
      assert.equal(actual.trim(), expected.trim());
    });
  });
});


describe('BigInt numeric literals', () => {
  const values = [
    '1e21', '1e100', '1.5', '1e-7', '1e309',
    '0', '42', '1e20', '0xff', '0b1010', '0o77',
    '0x20000000000001', '-1e21', '-1.5', '"123456789012345678901234567890"',
  ];
  for (const value of values) {
    it(`preserves the value or runtime error for ${value}`, () => {
      const source = `import JSBI from 'jsbi'; result = JSBI.BigInt(${value});`;
      const actual = transformSync(source, {
        plugins: [plugin],
        babelrc: false,
        configFile: false,
      }).code;
      // The generated program must be valid syntax even when BigInt will
      // reject its argument at runtime.
      parseSync(actual, {babelrc: false, configFile: false});
      const execute = (code) => Function(`let result; ${code}; return result;`)();
      const expected = `result = BigInt(${value});`;
      let result;
      let expectedError;
      try {
        result = execute(expected);
      } catch (error) {
        expectedError = error;
      }
      if (expectedError) {
        assert.throws(() => execute(actual), expectedError.constructor);
      } else {
        assert.strictEqual(execute(actual), result);
      }
    });
  }
});

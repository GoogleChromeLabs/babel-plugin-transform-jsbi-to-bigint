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
import {transformFileSync} from '@babel/core';
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
          path.join(fixtureDir, 'expected.js')
      ).toString();
      // To update expectation files:
      // fs.writeFileSync(
      //     path.join(fixtureDir, 'expected.js'),
      //     `${actual.trim()}\n`);
      assert.equal(actual.trim(), expected.trim());
    });
  });
});

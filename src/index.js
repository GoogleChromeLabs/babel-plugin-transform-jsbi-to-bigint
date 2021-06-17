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

// https://github.com/GoogleChromeLabs/jsbi#how
const binaryFunctionToExpression = new Map([
  ['add', '+'],
  ['subtract', '-'],
  ['multiply', '*'],
  ['divide', '/'],
  ['remainder', '%'],
  ['exponentiate', '**'],
  ['leftShift', '<<'],
  ['signedRightShift', '>>'],
  ['bitwiseAnd', '&'],
  ['bitwiseOr', '|'],
  ['bitwiseXor', '^'],
  ['equal', '==='],
  ['notEqual', '!=='],
  ['lessThan', '<'],
  ['lessThanOrEqual', '<='],
  ['greaterThan', '>'],
  ['greaterThanOrEqual', '>='],
  ['EQ', '=='],
  ['NE', '!='],
  ['LT', '<'],
  ['LE', '<='],
  ['GT', '>'],
  ['GE', '>='],
  ['ADD', '+'],
]);

// https://github.com/GoogleChromeLabs/jsbi#how
const unaryFunctionToExpression = new Map([
  ['unaryMinus', '-'],
  ['bitwiseNot', '~'],
]);

// https://github.com/GoogleChromeLabs/jsbi#how
const staticMethods = new Set([
  'asIntN',
  'asUintN',
]);

const DATA_IDENTIFIER = 'JSBI';

export default function(babel) {
  const {types: t} = babel;

  const createExpression = (path, name, args) => {
    if (name === 'BigInt') {
      return createBigIntConstructor(path);
    }
    if (binaryFunctionToExpression.has(name)) {
      if (args.length !== 2) {
        throw path.buildCodeFrameError(
            'Binary operators must have exactly two arguments');
      }
      return t.binaryExpression(binaryFunctionToExpression.get(name),
          args[0], args[1]);
    }
    if (unaryFunctionToExpression.has(name)) {
      if (args.length !== 1) {
        throw path.buildCodeFrameError(
            'Unary operators must have exactly one argument');
      }
      return t.unaryExpression(unaryFunctionToExpression.get(name),
          args[0]);
    }
    if (staticMethods.has(name)) {
      if (args.length !== 2) {
        throw path.buildCodeFrameError(
            'Static methods must have exactly two arguments');
      }
      return t.callExpression(
          t.memberExpression(
              t.identifier('BigInt'), t.identifier(name)),
          args);
    }
    if (name === 'toNumber') {
      if (args.length !== 1) {
        throw path.buildCodeFrameError(
            'toNumber must have exactly one argument');
      }
      return t.callExpression(t.identifier('Number'), args);
    }
    throw path.buildCodeFrameError(`Unknown JSBI function '${name}'`);
  };

  const createBigIntConstructor = (path) => {
    const reInteger = /^(?:0|[1-9][0-9]*)$/;
    const arg = path.node.arguments[0];
    if (t.isNumericLiteral(arg) ||
        (t.isStringLiteral(arg) && reInteger.test(arg.value))) {
      return t.bigIntLiteral(arg.value);
    }
    return t.callExpression(t.identifier('BigInt'), [arg]);
  };

  const getPropertyName = (path) => {
    const {node} = path;
    if (t.isIdentifier(node)) return node.name;
    if (t.isStringLiteral(node)) return node.value;
    throw path.buildCodeFrameError(
        'Only .BigInt or [\'BigInt\'] allowed here.');
  };

  const resolveBinding = (_path, name) => {
    const binding = _path.scope.getBinding(name);
    if (binding === undefined) return;
    const path = binding.path;
    if (path.getData(DATA_IDENTIFIER)) return binding;
    const init = path.node.init;
    if (t.isVariableDeclarator(path) &&
        t.isMemberExpression(init)) {
      return resolveBinding(path.get('init'), init.object.name);
    }
    return binding;
  };

  const getJSBIProperty = (path, name) => {
    const binding = resolveBinding(path, name);
    return binding && binding.path.getData(DATA_IDENTIFIER);
  };

  const setJSBIProperty = (path, data) => {
    return path.setData(DATA_IDENTIFIER, data);
  };

  const hasJSBIProperty = (path, name) => {
    return getJSBIProperty(path, name) !== undefined;
  };

  return {
    pre() {
      this.remove = new Set();
    },
    visitor: {
      Program: {
        exit() {
          for (const path of this.remove) {
            path.remove();
          }
        },
      },
      ImportDeclaration(path) {
        const source = path.node.source;
        if (t.isStringLiteral(source) &&
            // Match exact "jsbi" or ".../jsbi.mjs" paths.
            (/^jsbi$/i.test(source.value) ||
             /[/\\]jsbi\.mjs$/i.test(source.value))) {
          for (const specifier of path.get('specifiers')) {
            if (t.isImportDefaultSpecifier(specifier)) {
              setJSBIProperty(specifier, '');
            }
          }
          this.remove.add(path);
        }
      },
      VariableDeclarator(path) {
        const init = path.node.init;
        if (t.isMemberExpression(init)) {
          if (hasJSBIProperty(path, init.object.name)) {
            setJSBIProperty(path,
                getPropertyName(path.get('init.property')));
            this.remove.add(path);
          }
        }
      },
      CallExpression(path) {
        const callee = path.node.callee;
        if (t.isMemberExpression(callee) &&
            hasJSBIProperty(path, callee.object.name)) {
          // Handle usage via `JSBI.foo(bar)`.
          path.replaceWith(createExpression(path,
              getPropertyName(path.get('callee.property')),
              path.node.arguments));
        } else {
          // Handle usage via `JSBigInt = JSBI.BigInt; JSBigInt(foo)`.
          const jsbiProp = getJSBIProperty(path, callee.name);
          if (jsbiProp) {
            path.replaceWith(createExpression(path,
                jsbiProp,
                path.node.arguments));
          }
        }
      },
      BinaryExpression(path) {
        const {operator, left, right} = path.node;
        if (operator === 'instanceof' &&
            t.isIdentifier(right, {name: 'JSBI'})) {
          path.replaceWith(
              t.binaryExpression(
                  '===',
                  t.unaryExpression(
                      'typeof',
                      left
                  ),
                  t.stringLiteral('bigint')
              )
          );
        }
      },
    },
  };
}

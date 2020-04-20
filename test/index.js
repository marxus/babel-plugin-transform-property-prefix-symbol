import { transformSync } from '@babel/core';
import assert from 'assert';
import plugin from '../src';


const prettify = str => str
  .split('\n')
  .map(l => l.trim().replace(/ +/g, ' '))
  .filter(Boolean)
  .join('\n');

const transform = code => transformSync(code, {
  presets: ['@babel/env'],
  plugins: [[plugin, { prefix: 'ס_' }]]
}).code;

assert.transformed = (actual, expected) => {
  assert.equal(prettify(transform(actual)), prettify(expected));
}

describe('handles prefixed named properties', () => {
  it('should transform them to computed Symbol.for properties ', () => {
    const actual = `
      foo
        .ס_filter(x => x)
        .ס_map(y => y);
    `;

    const expected = `
      "use strict";

      var _symbolFor = Symbol.for;

      foo[_symbolFor("filter")](function (x) {
        return x;
      })[_symbolFor("map")](function (y) {
        return y;
      });
    `;

    assert.transformed(actual, expected);
  });

  it('should return a nice hello msg', () => {
    const code = transform(`
      String.prototype.ס_sayHello = function(to) {
        return \`\${this} says hello to \${to}\`;
      }

      export default "Amit".ס_sayHello("the world!");
    `)
    const msg = eval(code)
    assert.equal(msg, "Amit says hello to the world!")
  })
});

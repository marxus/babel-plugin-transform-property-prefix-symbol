# babel-plugin-transform-property-prefix-symbol

transforms prefixed named properties to computed Symbol.for properties

## Example

**In**

```js
// { prefixes: ["s_", "_x"] }
foo
  .s_filter(x => x)
  .s_thru(y => y)
  ._xmap(z => z);
```

**Out**

```js
var _symbolFor = Symbol.for;

foo
  [_symbolFor("s_filter")](x => x)
  [_symbolFor("s_thru")](y => y)
  [_symbolFor("_xmap")](z => z);
```

**Use case (at least, my own)**

extending the Object prototype with properties that:
1. are not iterable (it's a symbol property, loops and such work on named properties)
2. won't get accidentally overwritten by another property assignment
3. won't accidentally overwrite existing properties
4. enables nice chaining without a wrapper

```js
// { prefixes: ["ס_"] } // any viable unicode javascript variable name is okay.
Object.prototype.ס_reduce = function(...args) {
  return _.reduce(this, ...args);
};

const obj = { a: 1, b: 2, c: 3 };

obj.ס_reduce((result, value, key) => {
  result[key] = value * 2;
  return result;
}, { });
```

**WTF is "ס" in your example?**

"ס" is the hebrew character that sounds like S (Symbol)<br/>
and also the first character for the hebrew words "Semel" and "Siman" (which both translates to Symbol)<br/>
just my personal pick for a prefix, pick your own...

## Installation

```sh
$ npm install @marxus/babel-plugin-transform-property-prefix-symbol --save-dev
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": [
    [
      "@marxus/transform-property-prefix-symbol",
      { "prefixes": ["s_"] }
    ]
  ]
}
```

### Via Node API

```js
require("babel-core").transform("code", {
  plugins: [
    [
      "@marxus/transform-property-prefix-symbol",
      { prefixes: ["s_"] }
    ]
  ]
});
```

# babel-plugin-transform-property-prefix-symbol

transforms prefixed named properties to computed Symbol.for properties

## Example

**In**

```js
// { prefix: "ס_" } (any valid unicode js variable string is okay)
foo
  .ס_filter(x => x)
  .ס_map(y => y);
```

**Out**

```js
var _symbolFor = Symbol.for;

foo
  [_symbolFor("filter")](x => x)
  [_symbolFor("map")](y => y);
```

**Use case (at least, my own)**

defining `Object` prototype property that:
1. is not iterable (it's a symbol property, loops and such work on named properties)
2. won't get accidentally overwritten (specially if i'll use non-english unicode charater)
3. won't accidentally overwrite
4. enables nice chaining without a wrapper

```js
Object.prototype.ס_reduce = function(...args) {
  return _.reduce(this, ...args);
};

const obj = { a: 1, b: 2, c: 3 };

obj.ס_reduce((result, value, key) => {
  result[key] = value * 2;
  return result;
}, { });
```

**WTF is "ס"?**

"ס" is the hebrew character that sounds like S (Symbol)<br/>
and also the first character for the hebrew words "Semel" and "Siman" (which both translates to Symbol)

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
      { "prefix": "s_" }
    ]
  ]
}
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: [
    [
      "@marxus/transform-property-prefix-symbol",
      { prefix: "s_" }
    ]
  ]
});
```

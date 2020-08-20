# preserve-native Hackium plugin

A plugin for Hackium that preserves native DOM API methods in the `hackium` object, e.g.

```js
JSON.stringify = function(){ throw new Error('Nope, no stringify for you'); }

let myObject = { a: 'b' };

let json = JSON.stringify(myObject); // throws error

let json = hackium.JSON.stringify(myObject); // preserved intact.
```

## When would I use this?

Some sites override methods for "security" purposes, others intercept method calls to modify behavior, and others still have outdated, buggy polyfills that you can't rely on. This plugin keeps many native methods around. Submit a PR if you want other methods saved.

## Usage

```js
import { Hackium } from 'hackium';
import plugin from 'hackium-plugin-preserve-native';

let hackium = new Hackium({ plugins: [ plugin ] });
...
```


# yargs-default-command

A plugin for [yargs](https://github.com/bcoe/yargs) which allows adding a default command that will match if called without a command or no other command matches.

## Install

`npm install --save yargs-default-command`

## Example

index.js:
```javascript
#!/usr/bin/env node

var yargs = require('yargs');
var args = require('yargs-default-command')(yargs);

args
  .command('*', 'default command', function(yargs) {
    console.log('DEFAULT');
  })
  .command('build', 'build command', function(yargs) {
    console.log('BUILD');
  })
  .args;
```

Output:
```
$ ./index.js build
BUILD

$ ./index.js foo
DEFAULT

$ ./index.js
DEFAULT
```

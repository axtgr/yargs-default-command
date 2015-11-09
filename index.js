'use strict';

module.exports = function(yargs) {
  // A simple way to get the underlying yargs object
  yargs = yargs.exitProcess();

  var yargsChild = Object.create(yargs);

  // Patch the methods so that they return our object
  // instead of the original one
  Object.keys(yargs).forEach(function(key) {
    if (typeof yargs[key] !== 'function') {
      return;
    }

    yargsChild[key] = function() {
      var result = yargs[key].apply(this, arguments);
      return (result === yargs) ? yargsChild : result;
    };
  });

  Object.defineProperty(yargsChild, 'argv', {
    get: function() {
      var commandHandlers = this.getCommandHandlers();

      if (!commandHandlers['*']) {
        return yargs.argv;
      }

      var commandTriggered = false;
      var result;

      Object.keys(commandHandlers).forEach(function(command) {
        var oldCommandHandler = commandHandlers[command];
        commandHandlers[command] = function() {
          commandTriggered = true;
          return oldCommandHandler.call(this, yargsChild.reset());
        };
      });

      result = yargs.argv;

      if (!commandTriggered) {
        commandHandlers['*'](yargsChild.reset());
        return result;
      }

      return result;
    },
    enumerable: true
  });

  return yargsChild;
};

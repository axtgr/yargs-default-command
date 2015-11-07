'use strict';

module.exports = function(yargs) {
  var yargsChild = Object.create(yargs);

  Object.defineProperty(yargsChild, 'argv', {
    get: function () {
      var commandHandlers = this.getCommandHandlers();

      if (!commandHandlers['*']) {
        return yargs.argv;
      }

      var commandTriggered = false;
      var result;

      Object.keys(commandHandlers).forEach(function(command) {
        var oldCommandHandler = commandHandlers[command];
        commandHandlers[command] = function(newYargs) {
          commandTriggered = true;
          return oldCommandHandler.call(this, newYargs);
        };
      });

      result = yargs.argv;

      if (!commandTriggered) {
        return commandHandlers['*'](yargsChild.reset());
      }

      return result;
    },
    enumerable: true
  });

  return yargsChild;
};

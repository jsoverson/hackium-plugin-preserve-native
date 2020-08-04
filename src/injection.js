(function (global, clientName) {
  const hackium = clientName in global ? global[clientName] : {};

  const natives = ['Function', 'JSON', 'Math', 'Array', 'Number', 'String'];

  function preserveFunctions(object) {
    const preserved = {};
    const descriptors = Object.entries(Object.getOwnPropertyDescriptors(object));
    for (let [prop, descriptor] of descriptors) {
      if (typeof descriptor.value === 'function') {
        preserved[prop] = descriptor.value;
      }
    }
    return preserved;
  }

  for (let nativeProp of natives) {
    hackium[nativeProp] = preserveFunctions(global[nativeProp]);
    if ('prototype' in global[nativeProp]) {
      if (!hackium[nativeProp]) hackium[nativeProp] = {};
      hackium[nativeProp].prototype = preserveFunctions(global[nativeProp].prototype);
    }
  }

  console.log('preserve-native plugin loaded.');
})(window, 'hackium');

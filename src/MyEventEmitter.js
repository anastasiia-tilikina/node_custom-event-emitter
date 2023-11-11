/* eslint-disable max-len */
'use strict';

function setDefaultEvents(event) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
}

function createOnceWrapper(event, callback) {
  const onceWrapper = (...args) => {
    this.events[event] = this.events[event].filter((fn) => fn !== onceWrapper);

    return callback(...args);
  };

  onceWrapper.listener = callback;

  return onceWrapper;
}

class MyEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    setDefaultEvents.call(this, event);
    this.events[event].push(callback);
  }

  once(event, callback) {
    setDefaultEvents.call(this, event);

    const onceWrapper = createOnceWrapper.call(this, event, callback);

    this.events[event].push(onceWrapper);
  }

  off(event, listener) {
    if (!this.events[event]) {
      return;
    }

    let index = this.events[event].length - 1;

    for (; index >= 0; index--) {
      if (
        this.events[event][index] === listener
        || this.events[event][index].listener === listener
      ) {
        break;
      }
    }

    this.events[event] = this.events[event].filter((_, i) => i !== index);
  }

  emit(event, ...args) {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((fn) => {
      fn(...args);
    });
  }

  prependListener(event, callback) {
    setDefaultEvents.call(this, event);

    this.events[event].unshift(callback);
  }

  prependOnceListener(event, callback) {
    setDefaultEvents.call(this, event);

    const onceWrapper = createOnceWrapper.call(this, event, callback);

    this.events[event].unshift(onceWrapper);
  }

  removeAllListeners(event) {
    delete this.events[event];
  }

  listenerCount(event, listener) {
    if (!this.events[event]) {
      return 0;
    }

    // Listener argument was added in node v19.8.0, v18.16.0
    // If listener is provided, it will return how many times the listener is found in the list of the listeners of the event.

    if (!listener) {
      return this.events[event].length;
    }

    return this.events[event].filter(
      (ev) => ev === listener || ev.listener === listener,
    ).length;
  }

  eventNames() {
    return Object.keys(this.events);
  }

  listeners(event) {
    if (!this.events[event]) {
      return [];
    }

    return this.events[event].map((l) => l.listener || l);
  }

  rawListeners(event) {
    if (!this.events[event]) {
      return [];
    }

    return [...this.events[event]];
  }
}

module.exports = { MyEventEmitter };

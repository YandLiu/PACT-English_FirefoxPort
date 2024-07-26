import { b as boot } from "./index.454a89f7.js";
class EventBus {
  constructor() {
    this.__stack = {};
  }
  on(name, callback, ctx) {
    (this.__stack[name] || (this.__stack[name] = [])).push({
      fn: callback,
      ctx
    });
    return this;
  }
  once(name, callback, ctx) {
    const listener = (...args) => {
      this.off(name, listener);
      callback.apply(ctx, args);
    };
    listener.__callback = callback;
    return this.on(name, listener, ctx);
  }
  emit(name) {
    const list = this.__stack[name];
    if (list !== void 0) {
      const params = [].slice.call(arguments, 1);
      list.forEach((entry) => {
        entry.fn.apply(entry.ctx, params);
      });
    }
    return this;
  }
  off(name, callback) {
    const list = this.__stack[name];
    if (list === void 0) {
      return this;
    }
    if (callback === void 0) {
      delete this.__stack[name];
      return this;
    }
    const liveEvents = list.filter(
      (entry) => entry.fn !== callback && entry.fn.__callback !== callback
    );
    if (liveEvents.length !== 0) {
      this.__stack[name] = liveEvents;
    } else {
      delete this.__stack[name];
    }
    return this;
  }
}
const bus = new EventBus();
var eventBus = boot(({ app }) => {
  app.provide("bus", bus);
});
export { bus, eventBus as default };

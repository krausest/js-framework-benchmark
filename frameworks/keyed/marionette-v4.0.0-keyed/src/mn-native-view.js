import _ from 'underscore';
import Bb from 'backbone';
import { View, CollectionView } from 'backbone.marionette';

// From https://github.com/akre54/Backbone.NativeView

// Cached regex to match an opening '<' of an HTML tag, possibly left-padded
// with whitespace.
const paddedLt = /^\s*</;

// Caches a local reference to `Element.prototype` for faster access.
const ElementProto = (typeof Element !== 'undefined' && Element.prototype) || {};

// Cross-browser event listener shims
const elementAddEventListener = ElementProto.addEventListener

const elementRemoveEventListener = ElementProto.removeEventListener

// Find the right `Element#matches` for IE>=9 and modern browsers.
const matchesSelector = ElementProto.matches ||
    ElementProto.webkitMatchesSelector ||
    ElementProto.mozMatchesSelector ||
    ElementProto.msMatchesSelector ||
    ElementProto.oMatchesSelector;

// Patch Bb.View
_.extend(Bb.View.prototype, {
  $: function(selector) {
    return this.el.querySelectorAll(selector);
  },

  // Apply the `element` to the view. `element` can be a CSS selector,
  // a string of HTML, or an Element node. If passed a NodeList or CSS
  // selector, uses just the first match.
  _setElement: function(element) {
    if (typeof element === 'string') {
      if (paddedLt.test(element)) {
        var el = document.createElement('div');
        el.innerHTML = element;
        this.el = el.firstChild;
      } else {
        this.el = document.querySelector(element);
      }
    } else if (element && element.length) {
      this.el = element[0];
    } else {
      this.el = element;
    }
    this.$el = [this.el];
  },

  // Set a hash of attributes to the view's `el`. We use the "prop" version
  // if available, falling back to `setAttribute` for the catch-all.
  _setAttributes: function(attrs) {
    for (var attr in attrs) {
      attr in this.el ? this.el[attr] = attrs[attr] : this.el.setAttribute(attr, attrs[attr]);
    }
  },

  // Make a event delegation handler for the given `eventName` and `selector`
  // and attach it to `this.el`.
  // If selector is empty, the listener will be bound to `this.el`. If not, a
  // new handler that will recursively traverse up the event target's DOM
  // hierarchy looking for a node that matches the selector. If one is found,
  // the event's `delegateTarget` property is set to it and the return the
  // result of calling bound `listener` with the parameters given to the
  // handler.
  delegate: function(eventName, selector, listener) {
    this._domEvents || (this._domEvents = []);
    if (typeof selector === 'function') {
      listener = selector;
      selector = null;
    }

    var root = this.el;
    var handler = selector ? function (e) {
      var node = e.target;
      for (; node && node !== root; node = node.parentNode) {
        if (matchesSelector.call(node, selector)) {
          e.delegateTarget = node;
          listener(e);
        }
      }
    } : listener;

    // remove namespace
    var dotIndex = eventName.indexOf('.')
    if (dotIndex > 0) eventName = eventName.slice(0, dotIndex).trim();

    elementAddEventListener.call(this.el, eventName, handler, false);
    this._domEvents.push({eventName: eventName, handler: handler, listener: listener, selector: selector});
    return handler;
  },

  // Remove a single delegated event. Either `eventName` or `selector` must
  // be included, `selector` and `listener` are optional.
  undelegate: function(eventName, selector, listener) {
    if (typeof selector === 'function') {
      listener = selector;
      selector = null;
    }

    if (this.el && this._domEvents) {
      var handlers = this._domEvents.slice();
      var i = handlers.length;
      while (i--) {
        var item = handlers[i];

        var match = item.eventName === eventName &&
            (listener ? item.listener === listener : true) &&
            (selector ? item.selector === selector : true);

        if (!match) continue;

        elementRemoveEventListener.call(this.el, item.eventName, item.handler, false);
        this._domEvents.splice(i, 1);
      }
    }
    return this;
  },

  // Remove all events created with `delegate` from `el`
  undelegateEvents: function() {
    if (this.el && this._domEvents) {
      for (var i = 0, len = this._domEvents.length; i < len; i++) {
        var item = this._domEvents[i];
        elementRemoveEventListener.call(this.el, item.eventName, item.handler, false);
      };
      this._domEvents.length = 0;
    }
    return this;
  }
});

function NativeRemove() {
  this.undelegateEvents();
  if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
}

View.prototype._removeElement = NativeRemove;
CollectionView.prototype._removeElement = NativeRemove;

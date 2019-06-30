import Component from "@ember/component";
import { computed } from "@ember/object";

export default Component.extend({
  internalTag: "div",
  init() {
    this._super(...arguments);
    this.fragment = document.createElement(this.internalTag);
  },
  addFragmentToDom: computed(function() {
    this.element.appendChild(this.fragment);
    return "";
  })
});

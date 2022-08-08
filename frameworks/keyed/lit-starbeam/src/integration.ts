// https://twitter.com/wycats/status/1539445571294941184/photo/1
import {
  FormulaFn,
  Formula,
  TIMELINE, DEBUG_RENDERER, LIFETIME
} from '@starbeam/core';

const FORMULAS = new WeakMap<object, FormulaFn<any>>();

export function starbeam(
  target: object,
  key: PropertyKey,
  descriptor: PropertyDescriptor,
) {
  const method = descriptor.value;

  descriptor.value = function () {
    let formula = FORMULAS.get(this);

    if (!formula) {
      formula = FormulaFn(
        method.bind(this),
        `render function for Component: ${this.localName}`
      );

      FORMULAS.set(this, formula);

      TIMELINE.on.change(formula, () => {
        this.requestUpdate();
      });
    }

    return formula.current;
  };

  return descriptor;
}

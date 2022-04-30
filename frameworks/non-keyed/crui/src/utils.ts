import { children, Component, h, sc2 } from '@crui/core';
import { props } from '@crui/core/setups/props';

export const klass = (className: string) =>
    props({ className })

export function div(cls: string, cs: Component[]) {
    return h('div', sc2(
        klass(cls),
        children(cs)
    ))
}
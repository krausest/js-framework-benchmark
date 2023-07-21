import { elementOpen, elementClose } from 'incremental-dom';

export function Div(className: string, func: () => void) {
  elementOpen('div', null, null, 'class', className);
  func();
  elementClose('div');
}
export default function _ifEq([testA, testB, truthy]) {
  return ((testA === testB) ? truthy : '');
}

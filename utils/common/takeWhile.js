function takeWhile(array, predicate) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (predicate(value, i, array)) {
      result.push(value);
    } else {
      break;
    }
  }
  return result;
}

export { takeWhile };

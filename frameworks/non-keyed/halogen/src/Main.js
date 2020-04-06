function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

exports.createRandomNRowsImpl = function(
  adjectives,
  colours,
  nouns,
  count,
  lastId
) {
  var data = [];
  for (var i = 0; i < count; i++)
    data.push({
      id: ++lastId,
      label:
        adjectives[_random(adjectives.length)] +
        " " +
        colours[_random(colours.length)] +
        " " +
        nouns[_random(nouns.length)]
    });
  return data;
};

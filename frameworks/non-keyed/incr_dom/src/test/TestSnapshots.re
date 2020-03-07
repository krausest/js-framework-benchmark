open Framework;

describe("my first test suite", ({test}) => {
  test("1 + 1 should equal 2", ({expect}) => {
    expect.int(1 + 1).toBe(2);
  });
});

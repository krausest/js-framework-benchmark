open Framework;
/* open JsFrameworkBenchmarkComponents; */
/* open Virtual_dom.Vdom; */

describe("my first test suite", ({test, _}) => {
  test("1 + 1 should equal 2", ({expect, _}) => {
    /* let row = <Row
      onSelect={_ => Event.Ignore}
      onRemove={_ => Event.Ignore}
      selected={false}
      item
    /> */

    expect.string("abc").toMatchSnapshot();
  });
});

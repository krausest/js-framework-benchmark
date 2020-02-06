import { expect } from 'chai';
import { mount } from 'enzyme';
var preact = require('preact');
import { render, Component,h  } from 'preact';

it.only('should allow for swapping keyed lists', () => {
  const data = [];
  let swap;
  for (let i = 1; i <= 10;i++) {
    data.push({
      id: i,
      label: 'hi' + i
    });
  }

  const Row = ({ data }) => <p>{data.label}</p>;

  class App extends Component {
    constructor(props) {
      super(props);
      this.state = { data };
      swap = this.swap = this.swap.bind(this);
    }

    swap() {
      const { data } = this.state;
      const a = data[0];
      data[0] = data[9];
      data[9] = a;
      this.setState({ data });
    }

    render() {
      return (
        <div>
          {this.state.data.map((data) => (
            <Row data={data} key={data.id} />
          ))}
        </div>
      );
    }
  }

  const buildP = (p) => `<p>hi${p}</p>`;

  let scratch = render(<App />);
  expect(scratch).to.equal(
    `<div>${buildP(1)}${buildP(2)}${buildP(3)}${buildP(4)}${buildP(5)}${buildP(6)}${buildP(7)}${buildP(8)}${buildP(9)}${buildP(10)}</div>`
  );

  console.log('swapping');
  swap();
  rerender();
  expect(scratch.innerHTML).to.equal(
    `<div>${buildP(10)}${buildP(2)}${buildP(3)}${buildP(4)}${buildP(5)}${buildP(6)}${buildP(7)}${buildP(8)}${buildP(9)}${buildP(1)}</div>`
  );
});
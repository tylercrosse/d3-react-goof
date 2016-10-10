import React from 'react';
import ReactDOM from 'react-dom';

import { d3Chart } from './d3Chart.js';
import dataGenerator from './dataGenerator.js';
import './mainStyle.scss';

const sampleData = dataGenerator.generate(50);

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      data: sampleData,
      domain: {x: [0,30], y: [0, 100]}
    };
  }
  render() {
    return (
      <div>
        <h1>Hello React</h1>
        <Chart
          data={this.state.data}
          domain={this.state.domain} />
      </div>
    );
  }
}

class Chart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState());
  }
  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  }
  render() {
    return (
      <div className="Chart"></div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
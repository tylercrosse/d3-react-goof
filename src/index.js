import * as d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import dataGenerator from './dataGenerator.js';
import './mainStyle.scss';

const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);
      
    svg.append('g')
      .attr('class', 'd3-points');
      
    this.update(el, state);
  },
  update(el, state) {
    let scales = this._scales(el, state.domain);
    this._drawPoints(el, scales, state.data);
  },
  destroy(el) {},
  _drawPoints(el, scales, data) {
    let g = d3.select(el).selectAll('.d3-points');
    let point = g.selectAll('.d3-point')
      .data(data, (d) => (d.id));
      
    point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', (d) => (scales.x(d.x)))
      .attr('cy', (d) => (scales.y(d.y)))
      .attr('r', (d) => (scales.z(d.z)));
      
    point.exit()
      .remove();
  },
  _scales(el, domain) {
    if (!domain) {
      return null;
    }
    let width = el.offsetWidth;
    let height = el.offsetHeight;
    let x = d3.scaleLinear()
      .range([0, width])
      .domain(domain.x);
    let y = d3.scaleLinear()
      .range([height, 0])
      .domain(domain.y);
    let z = d3.scaleLinear()
      .range([5, 20])
      .domain([1, 10]);
    return {x: x, y: y, z: z};
  }
};

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
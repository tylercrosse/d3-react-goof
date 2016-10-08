import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

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
      .attr('class', 'd3-point');
      
    point.attr('cx', (d) => (scales.x(d.x)))
      .attr('cy', (d) => (scales.y(d.y)))
      .attr('r', (d) => (scales.z(d.z)));
      
    point.exit()
      .remove();
  }
};

let sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4f8phwm', x: 11, y: 45, z: 9}
]

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
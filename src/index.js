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
      domain: {x: [0,30], y: [0, 100]},
      tooltip: null
    };
  }
  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }
  render() {
    return (
      <div>
        <h1>Hello React</h1>
        <Chart
          data={this.state.data}
          domain={this.state.domain}
          setAppState={(partialState, callback) => this.setAppState(partialState, callback)} />
      </div>
    );
  }
}

class Chart extends React.Component {
  componentDidMount() {
    let el = ReactDOM.findDOMNode(this);
    let dispatcher = d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState())
    
    let self = this
    dispatcher.on('point:mouseover', this.showTooltip.bind(this));
    dispatcher.on('point:moustout', this.hideTooltip.bind(this));
    this.dispatcher = dispatcher;
  }
  componentDidUpdate() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState(), this.dispatcher);
  }
  getChartState() {
    return {
      data: this.props.data,
      domain: this.props.domain,
      tooltips: [this.props.tooltip]
    };
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  }
  showTooltip(d) {
    console.log(this, d);
    this.props.setAppState({tooltip: d});
  }
  hideTooltip() {
    this.props.setAppState({tooltip: null});
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
import * as d3 from 'd3';
import { EventEmitter } from 'events'

export const d3Chart = {
  create(el, props, state) {
    let svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);
      
    svg.append('g')
      .attr('class', 'd3-points');
    
    let dispatcher = new EventEmitter();
    this.update(el, state, dispatcher);
    
    return dispatcher;
  },
  update(el, state, dispatcher) {
    let scales = this._scales(el, state.domain);
    this._drawPoints(el, scales, state.data, dispatcher);
    this._drawTooltips(el, scales, state.tooltips);
  },
  destroy(el) {},
  _drawPoints(el, scales, data, dispatcher) {
    let g = d3.select(el).selectAll('.d3-points');
    let point = g.selectAll('.d3-point')
      .data(data, (d) => (d.id));
      
    point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', (d) => (scales.x(d.x)))
      .attr('cy', (d) => (scales.y(d.y)))
      .attr('r', (d) => (scales.z(d.z)))
      .on('mouseover', (d) => {dispatcher.emit('point:mouseover', d)})
      .on('mouseout', (d) => {dispatcher.emit('point:mouseout', d)});
      
    point.exit()
      .remove();
  },
  _drawTooltips(el, scales, tooltips) {
    let TOOLTIP_WIDTH = 20;
    let TOOLTIP_HEIGHT = 20;
    let g = d3.select(el).selectAll('.d3-tooltips');
    let tooltipRect = g.selectAll('.d3-tooltip-rect')
      .data(tooltips, (d) => (d.id));
      
    tooltipRect.enter().append('rect')
      .attr('class', 'd3-tooltip-rect')
      .attr('width', TOOLTIP_WIDTH)
      .attr('height', TOOLTIP_HEIGHT);
      
    tooltipRect.attr('y', (d) => (scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT))
      .attr('x', (d) => (scales.x(d.x) - TOOLTIP_WIDTH/2))
      
    tooltipRect.exit()
      .remove();
      
    let tooltipText = g.selectAll('.d3-tooltip-text')
      .data(tooltips, (d) => (d.id))
      
    tooltipText.enter().append('text')
      .attr('class', 'd3-tooltip-text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) => (d.z));
      
    tooltipText.attr('y', (d) => (scales.y(d.y) - scales.z(d.z)/2 - TOOLTIP_HEIGHT/2))
      .attr('x', (d) => (scales.x(d.x)))
      
    tooltipText.exit()
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
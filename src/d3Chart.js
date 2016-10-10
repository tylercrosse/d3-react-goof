import * as d3 from 'd3';

export const d3Chart = {
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
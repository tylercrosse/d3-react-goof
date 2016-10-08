import cuid from 'cuid';

const X_MIN = 1;
const X_MAX = 100;
const Y_MIN = 10;
const Y_MAX = 90;
const Z_MIN = 1;
const Z_MAX = 10;

const dataGenerator = {
  generate(n) {
    let res = [];
    for (let i = 0; i < n; i++) {
      res.push(this.generateDatum([X_MIN, X_MAX]));
    }
    return res;
  },
  generateDatum(domain) {
    return {
      id: this._uid(),
      x: this._randomIntBetween(domain[0], domain[1]),
      y: this._randomIntBetween(Y_MIN, Y_MAX),
      z: this._randomIntBetween(Z_MIN, Z_MAX)
    };
  },
  _randomIntBetween(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  _uid() {
    return cuid();
  }
}

export default dataGenerator;
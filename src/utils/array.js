export const find = (array, predicate, context) => {
  if (typeof Array.prototype.find === 'function') {
    return array.find(predicate, context);
  }

  context = context || this;
  let length = array.length;
  let i;

  if (typeof predicate !== 'function') {
    throw new TypeError(predicate + ' is not a function');
  }

  for (i = 0; i < length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return array[i];
    }
  }
}


let hasOwn = Object.prototype.hasOwnProperty;

export const map = (xs, f) => {
  if (xs.map) return xs.map(f);
  let res = [];
  for (let i = 0; i < xs.length; i++) {
      let x = xs[i];
      if (hasOwn.call(xs, i)) res.push(f(x, i, xs));
  }
  return res;
};

export const filter = (arr, fn, self) => {
  if (arr.filter) return arr.filter(fn, self);
  if (void 0 === arr || null === arr) throw new TypeError;
  if ('function' != typeof fn) throw new TypeError;
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    if (!hasOwn.call(arr, i)) continue;
    let val = arr[i];
    if (fn.call(self, val, i, arr)) ret.push(val);
  }
  return ret;
};

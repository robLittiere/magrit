function breaks(data, lower_class_limits, n_classes) {
  var kclass = [];
  var m = data.length,
    j,
    jj;

  kclass[n_classes] = data[data.length - 1];
  kclass[0] = data[0];

  for (j = 1; j < n_classes; j++) {
    jj = n_classes - j + 1;
    kclass[jj - 1] = data[lower_class_limits[m - 1][jj - 1] - 2];
    m = lower_class_limits[m - 1][jj - 1] - 1;
  }

  return kclass;
}

function getMatrices(data, n_classes) {
  var lower_class_limits = [],
    variance_combinations = [],
    length_data = data.length;
  var i, j, m, l, variance, val, sum, sum_squares, w, temp_val, i4, lower_class_limit;

  for (i = 0; i < length_data; i++) {
    var tmp1 = [],
      tmp2 = [];
    var t = i === 0 ? 1 : 0;

    for (j = 0; j < n_classes; j++) {
      tmp1.push(t);
      tmp2.push(Infinity);
    }

    lower_class_limits.push(tmp1);
    variance_combinations.push(tmp2);
  }

  variance = 0;

  for (l = 0; l < length_data; l++) {
    sum = sum_squares = w = 0;

    for (m = 0; m <= l; m++) {
      lower_class_limit = l - m;
      val = data[lower_class_limit];
      w++;
      sum += val;
      sum_squares += val * val;
      variance = sum_squares - sum * sum / w;
      i4 = lower_class_limit - 1;

      if (i4 > -1) {
        for (j = 1; j < n_classes; j++) {
          temp_val = variance + variance_combinations[i4][j - 1];

          if (variance_combinations[l][j] >= temp_val) {
            lower_class_limits[l][j] = lower_class_limit + 1;
            variance_combinations[l][j] = temp_val;
          }
        }
      }
    }

    lower_class_limits[l][0] = 1;
    variance_combinations[l][0] = variance;
  }

  return {
    lower_class_limits: lower_class_limits,
    variance_combinations: variance_combinations
  };
}

function jenks(data, n_classes) {
  if (n_classes > data.length) return null;
  var unique = Array.from(new Set(data));
  if (n_classes > unique.length) return null;
  data = data.map(function (a) {
    return +a;
  }).sort(function (a, b) {
    return a - b;
  });
  var matrices = getMatrices(data, n_classes);
  var lower_class_limits = matrices.lower_class_limits;
  return breaks(data, lower_class_limits, n_classes);
}

onmessage = function (e) {
  const brks = jenks(e.data[0], e.data[1]);
  postMessage(brks);
};

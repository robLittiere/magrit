onmessage = function (e) {
  const [join_values1, join_values2] = e.data;
  const nb_features = join_values1.length;
  const field_join_map = [];
  let hits = 0;
  let val;
  if (typeof join_values1[0] === 'number' && typeof join_values2[0] === 'string') {
    for (let i = 0; i < nb_features; i++) {
      val = join_values2.indexOf(String(join_values1[i]));
      if (val !== -1) {
        field_join_map.push(val);
        hits += 1;
      } else {
        field_join_map.push(undefined);
      }
    }
  } else if (typeof join_values2[0] === 'number' && typeof join_values1[0] === 'string') {
    for (let i = 0; i < nb_features; i++) {
      val = join_values2.indexOf(Number(join_values1[i]));
      if (val !== -1) {
        field_join_map.push(val);
        hits += 1;
      } else {
        field_join_map.push(undefined);
      }
    }
  } else if (typeof join_values2[0] === 'number' && typeof join_values1[0] === 'number') {
    for (let i = 0; i < nb_features; i++) {
      val = join_values2.indexOf(join_values1[i]);
      if (val !== -1) {
        field_join_map.push(val);
        hits += 1;
      } else {
        field_join_map.push(undefined);
      }
    }
  } else {
    for (let i = 0; i < nb_features; i++) {
      val = join_values2.indexOf(String(join_values1[i]));
      if (val !== -1) {
        field_join_map.push(val);
        hits += 1;
      } else {
        field_join_map.push(undefined);
      }
    }
  }
  postMessage([field_join_map, hits]);
};

import { selection, select } from 'd3-selection';
import { transition } from 'd3-transition';

// We want the features that were offered by 'd3-selection-multi'
// (deprecated and incompatible with new 'd3-selection' versions)
// to be available on the 'd3-selection' module
function attrsFunctionSelection(_selection, map) {
  return _selection.each(function () {
    const x = map.apply(this, arguments);
    const s = select(this);
    for (const name in x) s.attr(name, x[name]);
  });
}

function attrsObjectSelection(_selection, map) {
  for (const name in map) _selection.attr(name, map[name]);
  return _selection;
}

const attrsSelection = function (map) {
  return (typeof map === 'function' ? attrsFunctionSelection : attrsObjectSelection)(this, map);
};

function propertiesFunctionSelection(_selection, map) {
  return _selection.each(function () {
    const x = map.apply(this, arguments);
    const s = select(this);
    for (const name in x) s.property(name, x[name]);
  });
}

function propertiesObjectSelection(_selection, map) {
  for (const name in map) _selection.property(name, map[name]);
  return _selection;
}

const propertiesSelection = function (map) {
  return (typeof map === 'function' ? propertiesFunctionSelection : propertiesObjectSelection)(this, map);
};

function stylesFunctionSelection(_selection, map, priority) {
  return _selection.each(function () {
    const x = map.apply(this, arguments);
    const s = select(this);
    for (const name in x) s.style(name, x[name], priority);
  });
}

function stylesObjectSelection(_selection, map, priority) {
  for (const name in map) _selection.style(name, map[name], priority);
  return _selection;
}

const stylesSelection = function (map, priority) {
  return (typeof map === 'function' ? stylesFunctionSelection : stylesObjectSelection)(this, map, priority == null ? '' : priority);
};

selection.prototype.attrs = attrsSelection;
selection.prototype.styles = stylesSelection;
selection.prototype.properties = propertiesSelection;

function attrsFunctionTransition(_transition, map) {
  return _transition.each(function () {
    const x = map.apply(this, arguments);
    const t = select(this).transition(_transition);
    for (const name in x) t.attr(name, x[name]);
  });
}

function attrsObjectTransition(_transition, map) {
  for (const name in map) _transition.attr(name, map[name]);
  return _transition;
}

const attrsTransition = function (map) {
  return (typeof map === 'function' ? attrsFunctionTransition : attrsObjectTransition)(this, map);
};

function stylesFunctionTransition(_transition, map, priority) {
  return _transition.each(function () {
    const x = map.apply(this, arguments); const
      t = select(this).transition(_transition);
    for (const name in x) t.style(name, x[name], priority);
  });
}

function stylesObjectTransition(_transition, map, priority) {
  for (const name in map) _transition.style(name, map[name], priority);
  return _transition;
}

const stylesTransition = function (map, priority) {
  return (typeof map === 'function' ? stylesFunctionTransition : stylesObjectTransition)(this, map, priority == null ? '' : priority);
};

transition.prototype.attrs = attrsTransition;
transition.prototype.styles = stylesTransition;

export {
  event,
  select,
  selection,
  selectAll,
} from 'd3-selection';

export {
  active,
  interrupt,
  transition,
} from 'd3-transition';

export {
  json,
  csv,
} from 'd3-request';

export {
  line,
  curveBasis,
} from 'd3-shape';

export {
  polygonArea,
  polygonCentroid,
  polygonHull,
  polygonContains,
  polygonLength,
} from 'd3-polygon';

export {
  path,
} from 'd3-path';

export {
  histogram,
  max,
  mean,
  min,
} from 'd3-array';

export {
  interpolate,
  interpolateArray,
  interpolateNumber,
  interpolateObject,
  interpolateRound,
  interpolateString,
  interpolateTransformCss,
  interpolateTransformSvg,
  interpolateZoom,
  interpolateRgb,
  interpolateRgbBasis,
  interpolateRgbBasisClosed,
  interpolateHsl,
  interpolateHslLong,
  interpolateLab,
  interpolateHcl,
  interpolateHclLong,
  interpolateCubehelix,
  interpolateCubehelixLong,
  interpolateBasis,
  interpolateBasisClosed,
  quantize,
} from 'd3-interpolate';

export {
  dsvFormat,
  csvParse,
  csvParseRows,
  csvFormat,
  csvFormatRows,
  tsvParse,
  tsvParseRows,
  tsvFormat,
  tsvFormatRows,
} from 'd3-dsv';

export {
  format,
  formatPrefix,
  formatLocale,
  formatDefaultLocale,
  formatSpecifier,
  precisionFixed,
  precisionPrefix,
  precisionRound,
} from 'd3-format';

export {
  scaleBand,
  scalePoint,
  scaleIdentity,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scaleImplicit,
  scalePow,
  scaleSqrt,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
} from 'd3-scale';

export {
  schemeSet3,
} from 'd3-scale-chromatic';

export {
  axisTop,
  axisRight,
  axisBottom,
  axisLeft,
} from 'd3-axis';

export {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';

export {
  drag,
} from 'd3-drag';

export {
  zoom,
  zoomIdentity,
  zoomTransform,
} from 'd3-zoom';

export {
  brush,
  brushX,
  brushY,
  brushSelection,
} from 'd3-brush';

export {
  voronoi,
} from 'd3-voronoi';

export {
  geoAlbers,
  geoAlbersUsa,
  geoArea,
  geoAzimuthalEqualArea,
  geoAzimuthalEqualAreaRaw,
  geoAzimuthalEquidistant,
  geoAzimuthalEquidistantRaw,
  geoBounds,
  geoCentroid,
  geoCircle,
  geoClipAntimeridian,
  geoClipCircle,
  geoClipRectangle,
  geoConicConformal,
  geoConicConformalRaw,
  geoConicEqualArea,
  geoConicEqualAreaRaw,
  geoConicEquidistant,
  geoConicEquidistantRaw,
  geoDistance,
  geoEquirectangular,
  geoEquirectangularRaw,
  geoGnomonic,
  geoGnomonicRaw,
  geoGraticule,
  geoGraticule10,
  geoIdentity,
  geoInterpolate,
  geoLength,
  geoMercator,
  geoMercatorRaw,
  geoNaturalEarth1,
  geoOrthographic,
  geoOrthographicRaw,
  geoPath,
  geoProjection,
  geoProjectionMutator,
  geoRotation,
  geoStereographic,
  geoStereographicRaw,
  geoStream,
  geoTransform,
  geoTransverseMercator,
  geoTransverseMercatorRaw,
} from 'd3-geo';

export {
  geoArmadillo,
  geoBaker,
  geoBertin1953,
  geoBoggs,
  geoInterruptedBoggs,
  geoBonne,
  geoBottomley,
  geoBromley,
  geoCollignon,
  geoCraster,
  geoCylindricalEqualArea,
  geoCylindricalEqualAreaRaw,
  geoCylindricalStereographic,
  geoCylindricalStereographicRaw,
  geoEckert1,
  geoEckert2,
  geoEckert3,
  geoEckert4,
  geoEckert5,
  geoEckert6,
  geoEisenlohr,
  geoGilbert,
  geoGringorten,
  geoGringortenQuincuncial,
  geoHammer,
  geoHammerRaw,
  geoHealpix,
  geoHomolosine,
  geoInterruptedHomolosine,
  geoLoximuthal,
  geoNaturalEarth2,
  geoMiller,
  geoModifiedStereographicMiller,
  geoMollweide,
  geoPatterson,
  geoPeirceQuincuncial,
  geoPolyconic,
  geoRobinson,
  geoRobinsonRaw,
  geoInterruptedSinuMollweide,
  geoSinuMollweide,
  geoSinusoidal,
  geoInterruptedSinusoidal,
  geoVanDerGrinten,
  geoVanDerGrinten2,
  geoVanDerGrinten3,
  geoVanDerGrinten4,
  geoWinkel3,
} from 'd3-geo-projection';

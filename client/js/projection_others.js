const sin = Math.sin;
const asin = Math.asin;
const abs = Math.abs;
const cos = Math.cos;

const NITER = 20;
const EPS = 1e-7;
const ONETOL = 1.000001;
const CN = 2.67595;
const CS = 2.43763;
const RCN = 0.37369906014686373063;
const RCS = 0.41023453108141924738;
const FYCN = 1.75859;
const FYCS = 1.93052;
const RYCN = 0.56863737426006061674;
const RYCS = 0.51799515156538134803;
const FXC = 0.85;
const RXC = 1.17647058823529411764;
const M_HALFPI = Math.PI / 2;

export function hatanoRaw(lambda, phi) {
  const c = sin(phi) * (phi < 0 ? CS : CN);
  let y = phi;
  let th1;
  let i;
  for (i = NITER; i; --i) {
    y -= th1 = (y + sin(y) - c) / (1 + cos(y));
    if (abs(th1) < EPS) break;
  }
  return [
    FXC * lambda * cos(y *= 0.5),
    sin(y) * (y < 0 ? FYCS : FYCN),
  ];
}

hatanoRaw.invert = (x, y) => {
  let xx = x;
  let yy = y;
  let th = yy * (yy < 0 ? RYCS : RYCN);
  if (abs(th) > 1) {
    if (abs(th) > ONETOL) {
      console.log('Error');
      return [NaN, NaN];
    }
    th = th > 0 ? M_HALFPI : -M_HALFPI;
  } else {
    th = asin(th);
  }
  xx = RXC * xx / cos(th);
  th += th;
  yy = (th + sin(th)) * (yy < 0 ? RCS : RCN);
  if (abs(yy) > 1) {
    if (abs(yy) > ONETOL) {
      console.log('Error');
      return [NaN, NaN];
    }
    yy = yy > 0 ? M_HALFPI : -M_HALFPI;
  } else {
    yy = asin(yy);
  }
  return [xx, yy];
};

export function winkel1Raw(latTrueScale) {
  const cosphi1 = cos(latTrueScale);

  function forward(lambda, phi) {
    const x = lambda;
    const y = phi;
    return [0.5 * x * (cosphi1 + cos(phi)), y];
  }

  forward.invert = (x, y) => {
    const lambda = x;
    const phi = y;
    return [2 * lambda / (cosphi1 + cos(phi)), phi];
  };

  return forward;
}

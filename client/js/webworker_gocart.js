importScripts('go-cart.js');

let GoCart;

onmessage = function(e) {
  const { geojson, field_name } = e.data;
  const response = {};
  let result;
  try {
    result = GoCart.makeCartogram(geojson, field_name);
    response.success = true;
    response.data = result;
  } catch (e) {
    console.log(e);
    response.success = false;
    response.data = e.message;
  }
  postMessage(response);
};

initGoCart()
  .then((GoCartModule) => {
    GoCart = GoCartModule;
    postMessage({ success: true, data: 'ready' });
  });


importScripts('https://unpkg.com/go-cart-wasm@0.2.0/dist/go-cart.js');

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

initGoCart({
  locateFile: () => 'https://unpkg.com/go-cart-wasm@0.2.0/dist/cart.wasm',
}).then((GoCartModule) => {
  GoCart = GoCartModule;
  postMessage({ success: true, data: 'ready' });
});

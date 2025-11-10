/**
 * Flutterwave Payment Utility
 * Alternative implementation using FlutterwaveCheckout inline script
 * More compatible with React 19+
 */

export const initializeFlutterwavePayment = (config, callback) => {
  // Load Flutterwave inline script if not already loaded
  if (!window.FlutterwaveCheckout) {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      makePayment(config, callback);
    };
    document.body.appendChild(script);
  } else {
    makePayment(config, callback);
  }
};

const makePayment = (config, callback) => {
  window.FlutterwaveCheckout({
    ...config,
    callback: (response) => {
      window.FlutterwaveCheckout.close();
      callback(response);
    },
    onclose: () => {
      console.log('Payment modal closed');
      if (config.onClose) {
        config.onClose();
      }
    },
  });
};

export default initializeFlutterwavePayment;

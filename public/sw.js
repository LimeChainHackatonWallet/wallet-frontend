let paymentRequestResolver;

class PromiseResolver {
  constructor() {
    this.promise_ = new Promise((resolve, reject) => {
      this.resolve_ = resolve;
      this.reject_ = reject;
    });
  }

  get promise() {
    return this.promise_;
  }

  get resolve() {
    return this.resolve_;
  }

  get reject() {
    return this.reject_;
  }
}

PromiseResolver.prototype = {
  get promise() {
    return this.promise_;
  },

  get resolve() {
    return this.resolve_;
  },

  get reject() {
    return this.reject_;
  },
};

function sendPaymentRequest() {
  if (!paymentRequestEvent) return;

  const options = {
    includeUncontrolled: false,
    type: "window",
  };

  clients.matchAll(options).then((clientList) => {
    console.log(
      "sending payment request event to frontend",
      paymentRequestEvent
    );
    for (const client of clientList) {
      client.postMessage({
        origin: paymentRequestEvent.paymentRequestOrigin,
        total: paymentRequestEvent.total,
        methodData: paymentRequestEvent.methodData,
        paymentRequestId: paymentRequestEvent.paymentRequestId,
      });
    }
  });
}

self.addEventListener("canmakepayment", (e) => {
  e.respondWith(true);
});

self.addEventListener("paymentrequest", (e) => {
  paymentRequestEvent = e;
  console.log("received payment request", e);

  paymentRequestResolver = new PromiseResolver();
  e.respondWith(paymentRequestResolver.promise);

  e.openWindow("/pay")
    .then((windowClient) => {
      if (windowClient == null) {
        paymentRequestResolver.reject("Failed to open window");
      }
    })
    .catch((err) => {
      paymentRequestResolver.reject(err);
    });
});

self.addEventListener("message", (e) => {
  console.log("got message from frontend", e.data);
  if (e.data === "payment_app_window_ready") {
    sendPaymentRequest();
    return;
  }

  if (e.data.methodName) {
    paymentRequestResolver.resolve(e.data);
  } else {
    paymentRequestResolver.reject(e.data);
  }
  paymentRequestEvent = null; // TODO: remove if not works
});

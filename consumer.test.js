const path = require("path");
const { Pact } = require("@pact-foundation/pact");
const request = require("superagent");

const MOCK_SERVER_PORT = 2202;

describe("Pact", () => {
  // (1) Create the Pact object to represent your provider
  const provider = new Pact({
    consumer: "foo",
    provider: "bar",
    port: MOCK_SERVER_PORT,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO",
    spec: 2
  });

  // this is the response you expect from your Provider
  const EXPECTED_BODY = { foo: "bar" };

  describe("simple test", () => {
    before(done => {
      // (2) Start the mock server
      provider
        .setup()
        // (3) add interactions to the Mock Server, as many as required
        .then(() => {
          return provider.addInteraction({
            // The 'state' field specifies a "Provider State"
            state: "some state",
            uponReceiving: "a request",
            withRequest: {
              method: "GET",
              path: "/foo"
            },
            willRespondWith: {
              status: 200,
              headers: { "Content-Type": "application/json; charset=utf-8" },
              body: EXPECTED_BODY
            }
          });
        })
        .then(() => done());
    });

    // (4) write your test(s)
    it("should return some nice data", () => {
      return request.get("http://127.0.0.1:2202/foo").then(res => {
        if (res.body.foo !== "bar") {
          throw new Error("Expected bar, got " + res.body.foo);
        }
      });
    });

    // (6) write the pact file for this consumer-provider pair,
    // and shutdown the associated mock server.
    // You should do this only _once_ per Provider you are testing.
    after(() => {
      provider.finalize();
    });
  });
});

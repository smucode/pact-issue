const path = require("path");
const { Verifier } = require("@pact-foundation/pact");

const providerBaseUrl = "http://127.0.0.1:3000";

const opts = {
  providerBaseUrl, // Running API provider host endpoint. Required.
  provider: "foo-bar", // Name of the Provider. Required.
  pactUrls: [path.resolve(process.cwd(), "pacts/foo-bar.json")], // Array of local Pact file paths or HTTP-based URLs (e.g. from a broker). Required if not using a Broker.
  providerStatesSetupUrl: `${providerBaseUrl}/state`, // URL to send PUT requests to setup a given provider state. Optional, required only if you provide a 'state' in any consumer tests.
  // tags: <Array>,                        // Array of tags, used to filter pacts from the Broker. Optional.
  // publishVerificationResult: <Boolean>, // Publish verification result to Broker. Optional
  // providerVersion: <Boolean>,           // Provider version, required to publish verification result to Broker. Optional otherwise.
  // timeout: <Number>                     // The duration in ms we should wait to confirm verification process was successful. Defaults to 30000, Optional.
  timeout: 60000
};

new Verifier().verifyProvider(opts).then(
  result => {
    console.info(result);
    process.exit(~result.indexOf("0 failures") ? 0 : 1);
  },
  result => {
    console.error(result);
    process.exit(1);
  }
);

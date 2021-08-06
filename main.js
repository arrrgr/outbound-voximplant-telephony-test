const dasha = require("@dasha.ai/sdk");

async function main() {
  const app = await dasha.deploy(`${__dirname}/dsl`);

  app.ttsDispatcher = () => "dasha";

  app.connectionProvider = () =>
    dasha.sip.connect(new dasha.sip.Endpoint("default"));

  await app.start();

  const conv = app.createConversation({ endpoint: process.argv[2] });
  const result = await conv.execute();
  console.log("test");
  console.log(result.output);

  await app.stop();
  app.dispose();
}

main();

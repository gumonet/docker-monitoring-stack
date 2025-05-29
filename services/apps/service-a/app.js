require("./tracing");
const express = require("express");
const axios = require("axios");
const { context, trace } = require("@opentelemetry/api");
const logger = require("./logger");

const app = express();
const port = 8080;

app.get("/", async (req, res) => {
  const span = trace.getTracer("default").startSpan("service-a-request");

  await context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const response = await axios.get("http://service-b:8081/");
      const traceId = span.spanContext().traceId;
      logger.info({ trace_id: traceId }, "Calling Service B from Service A");
      res.send(`Service A → B: ${response.data}`);
    } catch (err) {
      logger.error({ error: err.message }, "Error calling Service B");
      res.status(500).send("Error calling service B");
    } finally {
      span.end();
    }
  });
});

app.listen(port, () => {
  console.log(`Service A running on http://localhost:${port}`);
});

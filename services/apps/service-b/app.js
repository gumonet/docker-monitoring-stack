require("./tracing");
const express = require("express");
const { Pool } = require("pg");
const { context, trace } = require("@opentelemetry/api");
const logger = require("./logger");

const app = express();
const port = 8081;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASS || "pass",
  database: process.env.DB_NAME || "demo",
  port: 5432,
});

app.get("/", async (req, res) => {
  const span = trace.getTracer("default").startSpan("service-b-db-query");

  await context.with(trace.setSpan(context.active(), span), async () => {
    const traceId = span.spanContext().traceId;

    try {
      const result = await pool.query("SELECT NOW()");
      logger.info({ trace_id: traceId }, "Successfully queried database");
      res.send(`DB Time: ${result.rows[0].now}`);
    } catch (err) {
      logger.error(
        { trace_id: traceId, error: err.message },
        "Database query failed"
      );
      res.status(500).send("Error querying database");
    } finally {
      span.end();
    }
  });
});

app.listen(port, () => {
  console.log(`Service B running on http://localhost:${port}`);
});

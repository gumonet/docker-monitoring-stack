import express from "express";
import { metrics } from "@opentelemetry/api";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

// Env esperados (ajusta en k8s)
const OTEL_COLLECTOR_HTTP =
  process.env.OTEL_COLLECTOR_HTTP ||
  "http://otel-collector.otel.svc.cluster.local:4318";
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || "demo-api";
const SERVICE_VERSION = process.env.OTEL_SERVICE_VERSION || "1.0.0";

const exporter = new OTLPMetricExporter({
  url: `${OTEL_COLLECTOR_HTTP}/v1/metrics`, // OTLP HTTP
  // headers: { Authorization: `Bearer ${process.env.OTEL_TOKEN}` } // si requieres auth
});

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
  [SEMRESATTRS_SERVICE_VERSION]: SERVICE_VERSION,
  "deployment.environment": process.env.DEPLOY_ENV || "dev",
});

const meterProvider = new MeterProvider({ resource });
meterProvider.addMetricReader(
  new PeriodicExportingMetricReader({
    exporter,
    exportIntervalMillis: 10000,
  })
);
metrics.setGlobalMeterProvider(meterProvider);

const meter = metrics.getMeter(`${SERVICE_NAME}/meter`);
const reqCounter = meter.createCounter("http_server_requests_total");
const latencyHist = meter.createHistogram(
  "http_server_request_duration_seconds",
  { unit: "s" }
);

const app = express();

app.get("/health", (req, res) => {
  const t0 = process.hrtime.bigint();
  res.status(200).send("ok");
  const t1 = process.hrtime.bigint();
  const latency = Number(t1 - t0) / 1e9;

  const attrs = {
    "http.method": req.method,
    "http.target": req.path,
    "http.status_code": 200,
    "service.name": SERVICE_NAME,
  };
  reqCounter.add(1, attrs);
  latencyHist.record(latency, attrs);
});

app.get("/work", async (req, res) => {
  const t0 = process.hrtime.bigint();
  await new Promise((r) => setTimeout(r, Math.floor(Math.random() * 200) + 20));
  res.status(200).send("done");
  const t1 = process.hrtime.bigint();
  const latency = Number(t1 - t0) / 1e9;

  const attrs = {
    "http.method": req.method,
    "http.target": req.path,
    "http.status_code": 200,
    "service.name": SERVICE_NAME,
  };
  reqCounter.add(1, attrs);
  latencyHist.record(latency, attrs);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(
    `listening on :${port} → exporting metrics to ${OTEL_COLLECTOR_HTTP}/v1/metrics`
  );
});

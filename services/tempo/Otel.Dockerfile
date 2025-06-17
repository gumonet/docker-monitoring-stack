FROM otel/opentelemetry-collector-contrib:0.128.0
COPY collector-config.yaml /etc/otel/config.yaml
CMD ["--config=/etc/otel/config.yaml"]
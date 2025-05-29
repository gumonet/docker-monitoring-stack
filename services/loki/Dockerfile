FROM grafana/loki:3.5.0

USER root
RUN mkdir -p /etc/loki

COPY local-config.yaml /etc/loki/loki-config.yaml

RUN chown -R 10001:10001 /etc/loki

ENTRYPOINT ["/usr/bin/loki"]

CMD ["-config.file=/etc/loki/loki-config.yaml", "-config.expand-env=true"]
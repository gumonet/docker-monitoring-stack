FROM alpine:latest AS builder

RUN apk add --no-cache curl tar bash

RUN curl -L https://github.com/grafana/tempo/releases/download/v2.8.0/tempo_2.8.0_linux_amd64.tar.gz \
    | tar -xz -C /tmp

RUN ls -la /tmp

FROM alpine:latest

RUN apk add --no-cache bash gettext

COPY --from=builder /tmp/tempo /tempo
COPY tempo.yaml.template /etc/tempo.yaml.template

CMD ["/bin/sh", "-c", "envsubst < /etc/tempo.yaml.template > /etc/tempo.yaml && /tempo -config.file=/etc/tempo.yaml"]
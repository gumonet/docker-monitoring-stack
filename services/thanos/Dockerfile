# FROM thanosio/thanos:v0.38.0
# COPY s3-config.yaml /etc/thanos/s3.yaml
# #RUN mkdir -p /tmp/data
# COPY hashring.json /etc/thanos/hashring.json


# Etapa 1: builder
FROM alpine:3.20 AS builder


# Instalar herramientas necesarias
RUN apk add --no-cache curl tar

# Descargar y extraer el binario de Thanos
RUN curl -L https://github.com/thanos-io/thanos/releases/download/v0.38.0/thanos-0.38.0.linux-amd64.tar.gz \
    | tar -xz -C /tmp

# Etapa 2: imagen final minimalista y segura
FROM alpine:3.20

# Crear usuario no-root seguro
RUN addgroup -g 1000 thanosgroup && \
    adduser -D -u 1000 -G thanosgroup thanosuser && \
    mkdir -p /data /etc/thanos && \
    chown -R thanosuser:thanosgroup /data /etc/thanos

# Copiar binario de Thanos
COPY --from=builder /tmp/thanos-0.38.0.linux-amd64/thanos /usr/local/bin/thanos

COPY s3-config.yaml /etc/thanos/s3.yaml
COPY hashring.json /etc/thanos/hashring.json

RUN chown -R thanosuser:thanosgroup /etc/thanos

# Usar usuario no-root
USER thanosuser
WORKDIR /app

# Puerto expuesto para los componentes (puedes cambiar según componente)
EXPOSE 10901 10902 10903 9090 9091 19291

# Entrypoint general, puedes sobreescribirlo en `docker run`
ENTRYPOINT ["/usr/local/bin/thanos"]

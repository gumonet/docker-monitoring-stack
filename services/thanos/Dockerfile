FROM thanosio/thanos:v0.38.0
COPY s3-config.yaml /etc/thanos/s3.yaml
RUN mkdir -p /tmp/data
COPY hashring.json /etc/thanos/hashring.json
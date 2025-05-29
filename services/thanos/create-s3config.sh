#!/bin/bash
BUCKET=$1
REGION=$2
ACCESS_KEY=$3
SECRET_KEY=$4

cat <<EOF > s3-config.yaml
type: S3
config:
  bucket: "$BUCKET"
  endpoint: "s3.amazonaws.com"
  region: "$REGION"
  access_key: "$ACCESS_KEY"
  secret_key: "$SECRET_KEY"
  insecure: false
  signature_version2: false
EOF
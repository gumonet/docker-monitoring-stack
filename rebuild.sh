CONTAINER_NAME=$1

docker compose down ${CONTAINER_NAME} && docker compose build ${CONTAINER_NAME} && docker compose up -d ${CONTAINER_NAME}

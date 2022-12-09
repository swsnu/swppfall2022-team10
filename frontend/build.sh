#!/bin/bash
#
#
docker build -t frontend_build:dev -f Dockerfile.dev.build .

mkdir -p build

docker run --rm -it \
    -v $PWD/build:/frontend/build \
    frontend_build:dev \
    npm run build --prod


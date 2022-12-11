#!/bin/bash


# Build docker image for production build
docker build -t frontend_build:dev -f Dockerfile.dev.build .

# remove localhost url (will be redirected by proxy in deployment)
sed 's/http:\/\/localhost:8000//' src/**/*.tsx -i


mkdir -p build
docker run --rm -it \
    -v $PWD/build:/frontend/build \
    frontend_build:dev \
    npm run build --prod --silent

tar czf build.tar.gz --directory=build .  
gcloud storage cp build.tar.gz gs://swpp22-team10-frontend-build/

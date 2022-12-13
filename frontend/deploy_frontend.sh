#!/bin/bash
#
npm run build --prod --silent
gcloud builds submit --config cloudmigrate.yaml
#gcloud run deploy beafamily-frontend \
#    --platform managed \
#    --region asia-northeast1 \
#    --image gcr.io/swpp22-team10/beafamily-frontend \
#    --allow-unauthenticated

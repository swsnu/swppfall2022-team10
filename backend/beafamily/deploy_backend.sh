#!/bin/bash
#

gcloud builds submit --config cloudmigrate.yaml
gcloud run deploy beafamily-backend \
    --platform managed \
    --region asia-northeast1 \
    --image gcr.io/swpp22-team10/beafamily-backend \
    --add-cloudsql-instances swpp22-team10:asia-northeast1:beafamily-database-1 \
    --allow-unauthenticated


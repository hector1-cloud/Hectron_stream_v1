#!/bin/bash

# Setup Application Default Credentials (ADC)
bash <(curl -sSL https://storage.googleapis.com/cloud-samples-data/adc/setup_adc.sh)

# Replace these values with the appropriate values for your real project.
export GOOGLE_CLOUD_PROJECT="tus-datos-reales-proyecto-id"
export GOOGLE_CLOUD_LOCATION="global"
export GOOGLE_GENAI_USE_ENTERPRISE="True"

echo "Environment initialized. Run 'go get google.golang.org/genai' or 'pip install google-genai'."

#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found"
  echo "Please create a .env file based on the .env.example template"
  exit 1
fi

# Check if .env file is valid YAML
if ! python3 -c "import yaml; yaml.safe_load(open('.env'))" &>/dev/null; then
  echo "Error: .env file is not valid YAML"
  echo "Please make sure the file follows the YAML format as shown in .env.example"
  exit 1
fi

# Make sure you have authenticated with GCP before running this script
# gcloud auth login

# Install required Ansible collections if not already installed
ansible-galaxy collection install google.cloud

# Run the Ansible playbook
ansible-playbook -i inventory.ini setup-k6-gcp-spot.yml

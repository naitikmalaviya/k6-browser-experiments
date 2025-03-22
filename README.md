# K6 Browser Load Testing on GCP Spot Instances

This project helps you run web page load tests using k6 and its browser module on cheap Google Cloud Platform (GCP) spot instances. You can watch real-time test metrics on your local computer while the tests run in the cloud.

![Live Metrics Demo](assets/live-metrics-sample.gif)

## What This Project Does

- Creates a temporary spot instance (VM) on Google Cloud
- Sets up k6 with browser testing capabilities on that VM
- Runs your load test against any website
- Shows you live metrics on your local computer
- Downloads HTML report files to your local machine for later analysis
- Automatically cleans up when finished (optional)

## Project Structure

All k6 load testing scripts are organized in the `tests` directory:
```
k6-browser-experiments/
├── tests/                  # Directory containing all k6 test scripts
│   ├── page-load-test.js   # Default page load test script
│   └── ...                 # Other test scripts you may add
├── results/                # Test results are saved here
├── k6-cloud-testing-pipeline.yml   # Ansible playbook for GCP setup
└── ...
```

## Setup Instructions

1. Make sure you have Ansible installed on your local machine:
   ```bash
   # For macOS
   brew install ansible
   
   # For Ubuntu/Debian
   sudo apt-get install ansible
   ```

2. Copy the example environment file to create your settings:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your details:
   ```yaml
   # GCP Configuration
   GCP_PROJECT: your-project-id
   GCP_REGION: us-central1
   GCP_ZONE: us-central1-a

   # Instance Configuration
   INSTANCE_NAME: k6-browser-test
   MACHINE_TYPE: n1-standard-4
   IMAGE_FAMILY: debian-12
   IMAGE_PROJECT: debian-cloud
   NETWORK: default
   DISK_SIZE_GB: 10

   # SSH Configuration
   SSH_PUBLIC_KEY_PATH: ~/.ssh/id_rsa.pub
   SSH_PRIVATE_KEY_PATH: ~/.ssh/id_rsa

   # K6 Configuration
   K6_SCRIPT_PATH: tests/page-load-test.js  # Updated path to the tests directory

   # Application Configuration
   TARGET_URL: https://example.com
   ```

4. Login to your Google Cloud account (if not already logged in):
   ```bash
   gcloud auth login
   ```

## Running Tests

### Running on GCP Spot Instance

To run the test on a GCP spot instance with all default settings:

```bash
./gcp-ansible.sh
```

Alternatively, you can run the Ansible playbook directly:

```bash
# Install required Ansible collections first
ansible-galaxy collection install google.cloud

# Run the playbook
ansible-playbook k6-cloud-testing-pipeline.yml
```

This will:
1. Create a spot instance on GCP
2. Set up k6 with browser testing
3. Run the test against your TARGET_URL
4. Show real-time metrics in your browser
5. Download HTML report files to your local machine
6. Destroy the instance when done

### Keep the VM Running

If you want to keep the VM after the test finishes (to run more tests later):

```bash
ansible-playbook k6-cloud-testing-pipeline.yml --skip-tags destroy
```

### Running Locally Without GCP

You can also run the test script directly on your local machine without using GCP:

```bash
# Install k6 locally first
# macOS: brew install k6
# Other systems: https://grafana.com/docs/k6/latest/set-up/install-k6/

# Run the test
k6 run -e TARGET_URL=https://example.com tests/page-load-test.js
```

## How Live Metrics Work

The live metrics feature works because Ansible creates a port forwarding connection from the remote GCP machine to your local computer. This means the test runs in the cloud, but you can see the results as if they were running locally.

## Important Notes

- Spot instances are cheaper but can be terminated by Google if demand is high
- Make sure your GCP project has the necessary API permissions enabled
- The SSH key used must not have a passphrase for automated deployment
- All test scripts should be placed in the `tests` directory

## Troubleshooting

If you encounter issues:

1. Check your `.env` file configuration
2. Ensure you're logged in to GCP with `gcloud auth login`
3. Verify that your SSH keys are correctly specified
4. Check GCP console for any quota or permission errors

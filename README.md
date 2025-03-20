# K6 Browser Experiments

A collection of scripts for testing web pages with k6 and its browser module.

> **Note:** This project is still a work in progress. The k6 remote execution functionality using GCP spot instances has not been fully tested yet.

## Setup

1. Copy the environment example file to create your own environment file:
   ```
   cp .env.example .env
   ```

2. Edit the `.env` file to configure:
   - GCP project settings
   - Instance configuration
   - SSH keys
   - Target URL and test parameters
   ```yaml
   GCP_PROJECT: your-project-id
   TARGET_URL: https://yourwebsite.com
   # ... other configuration options
   ```

## Running Tests

### Local Execution

Run the page load test locally:

```bash
npm run test
```

Or provide the URL directly:

```bash
k6 run -e TARGET_URL=https://example.com page-load-test.js
```

### Remote Execution (WIP)

To run tests on a GCP spot instance:

1. Make sure you have authenticated with GCP:
   ```bash
   gcloud auth login
   ```

2. Run the test deployment:
   ```bash
   ./gcp-ansible.sh
   ```

## Project Structure

- **Test Scripts**
  - `page-load-test.js`: Main test script for page load testing
  
- **Infrastructure**
  - `setup-k6-gcp-spot.yml`: Ansible playbook for GCP spot instance setup
  - `inventory.ini`: Ansible inventory file
  - `gcp-ansible.sh`: Helper script for running Ansible deployment
  
- **Configuration**
  - `.env`: Local environment variables (not checked into git)
  - `.env.example`: Template for environment configuration
  
- **Output**
  - `screenshots/`: Directory where screenshots are saved during tests
  - `results/`: Directory for test result files

## Ansible Playbook Details

The `setup-k6-gcp-spot.yml` playbook:
1. Creates a preemptible GCP instance
2. Sets up k6 and required dependencies
3. Runs the test script
4. Collects results
5. Terminates the instance

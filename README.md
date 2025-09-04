# K6 Stress Test for AlemX

This repository contains K6-based stress testing scripts for the AlemX social media platform API. The tests simulate user behavior including login, scrolling feed, creating posts, and other interactions to evaluate the API's performance under load.

## Features

- **Load Testing**: Simulates 100 virtual users over 1 minute duration
- **Scenario-Based Testing**: Includes login, feed scrolling, and post creation scenarios
- **HTML Reporting**: Generates detailed HTML reports using the k6-reporter
- **CSV Data-Driven**: Uses account data from CSV files for realistic user simulation
- **Modular Scenarios**: Organized test scenarios in separate files for maintainability

## Project Structure

```
├── master.js              # Main test script with options and default function
├── load-env.js            # Script to load .env file and run K6
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── scenarios/             # Individual test scenario files
│   ├── login.js
│   ├── createPost.js
│   ├── createStory.js
│   └── scrollFeed.js
├── data/
│   └── accounts.csv       # Test account data
├── libs/                  # Utility libraries and shims
├── .github/
│   └── workflows/
│       └── deploy-summary.yml  # GitHub Actions workflow
├── stressTest.json        # Postman collection for API testing
├── summary.html           # Generated HTML report
└── package.json           # Project configuration
```

## Prerequisites

- [K6](https://k6.io/docs/get-started/installation/) installed on your system
- Node.js and npm (for package management)

## Setup

1. Clone this repository:
   ```bash
   git clone git@github.com:alem-x/K6-stree-testing.git
   cd k6-stress-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Prepare your test data:
   - Update `data/accounts.csv` with valid test account credentials
   - Ensure the CSV format matches: email,password (header row expected)

## Running Tests

### Basic Test Run
```bash
npm run test
```

This will execute the main test script with the configured options (100 VUs for 1 minute).

### Test with Environment Variables from .env
```bash
npm run test:env
```

This will load environment variables from your `.env` file and run the tests.

### Custom Test Configuration
You can modify the test options in `master.js`:
- `vus`: Number of virtual users
- `duration`: Test duration

### Running with Custom Options
```bash
# Using environment variables
npm run test:env -- --vus 50 --duration 30s

# Direct k6 command (without .env loading)
k6 run --vus 50 --duration 30s master.js

# Using the custom script for any k6 command
npm run test:custom -- run --vus 50 --duration 30s master.js
```

## Test Scenarios

The test suite includes the following scenarios:

1. **Login**: Authenticates users using credentials from CSV
2. **Scroll Feed**: Simulates users browsing the feed (50% probability)
3. **Create Post**: Simulates post creation with captions and hashtags (30% probability)
4. **Create Story**: Simulates story creation with location and content (20% probability)
5. **Feed Interaction**: Various feed-related operations

## Reporting

After test execution, an HTML report is automatically generated as `summary.html`. This report includes:
- Test execution summary
- Performance metrics
- Error details
- Response times
- Throughput statistics

## API Endpoints Tested

The tests target the AlemX API (configurable via `BASE_URL` environment variable, defaults to `https://api-dev.alemx.com`):
- `POST /user/login` - User authentication
- `GET /feed/` - Retrieve feed posts
- `POST /posts` - Create new posts
- `POST /story` - Create new stories

## Postman Collection

A Postman collection (`stressTest.json`) is included for manual API testing and validation. Import this into Postman to test individual endpoints.

## Configuration

### Environment Variables
The tests support the following environment variables:

- `BASE_URL`: The base URL for the API (defaults to `https://api-dev.alemx.com`)
- Test accounts loaded from `data/accounts.csv`

### Setting Environment Variables

#### Method 1: Using .env file (Recommended for Local Development)
1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```bash
   BASE_URL=https://your-api-endpoint.com
   ```

3. Run tests with environment loading:
   ```bash
   npm run test:env
   ```

#### Method 2: Direct Environment Variables
```bash
export BASE_URL=https://your-api-endpoint.com
npm run test
```

#### Method 3: For GitHub Actions
1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `BASE_URL`
5. Value: Your API base URL (e.g., `https://api-prod.alemx.com`)
6. The workflow will automatically use this secret

**Note:** The `.env` file is ignored by Git and should not be committed to version control.

### Test Data
- Ensure `data/accounts.csv` contains valid email/password combinations
- The test rotates through available accounts using `__VU % accounts.length`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your test scenarios or improvements
4. Run tests to ensure everything works
5. Submit a pull request

## Deploying Reports to GitHub Pages

This repository includes a GitHub Actions workflow that allows you to manually deploy the generated `summary.html` report to GitHub Pages.

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"

### Configure Repository Secrets

Before running the workflow, you need to set up the `BASE_URL` secret:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `BASE_URL`
5. Value: Your API base URL (e.g., `https://api-prod.alemx.com`)

### Manual Deployment

1. Go to the "Actions" tab in your repository
2. Select the "Deploy K6 Summary to GitHub Pages" workflow
3. Click "Run workflow"
4. Configure the test parameters:
   - **Virtual Users (VUs)**: Number of concurrent users (default: 100)
   - **Duration**: Test duration (default: 1m, e.g., 30s, 5m, 1h)
   - **Base URL**: API endpoint to test (default: https://api-dev.alemx.com)
5. Click "Run workflow" to start the deployment
6. The workflow will:
   - Install K6
   - Run the stress tests with your specified parameters
   - Generate the HTML report
   - Deploy it to your GitHub Pages site

After deployment, the report will be available at `https://<username>.github.io/<repository-name>/`

### Live Report
The latest stress test report is published at: <a href="https://alem-x.github.io/K6-stree-testing/" target="_blank">**https://alem-x.github.io/K6-stree-testing/**</a>

### Example Test Scenarios

You can run different load tests by adjusting the parameters:

- **Light Load Test**: VUs: 10, Duration: 30s (quick smoke test)
- **Medium Load Test**: VUs: 50, Duration: 2m (moderate stress test)
- **Heavy Load Test**: VUs: 200, Duration: 5m (high stress test)
- **Spike Test**: VUs: 500, Duration: 1m (sudden traffic spike)
- **Endurance Test**: VUs: 100, Duration: 10m (long-running stability test)

### Environment-Specific Testing

You can also test different environments by changing the Base URL:

- **Development**: `https://api-dev.alemx.com` (default)
- **Staging**: `https://api-staging.alemx.com`
- **Production**: `https://api.alemx.com`

### Workflow Details

The workflow is defined in `.github/workflows/deploy-summary.yml` and includes:
- Manual trigger via `workflow_dispatch` with configurable parameters
- **Input Parameters**:
  - `vus`: Number of virtual users (default: 100)
  - `duration`: Test duration (default: 1m)
  - `base_url`: API endpoint to test (default: https://api-dev.alemx.com)
- Automated test execution with custom load parameters
- Report generation and deployment
- Proper permissions for GitHub Pages deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
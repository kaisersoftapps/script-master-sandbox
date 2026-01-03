# Script Master: Companion App

## Overview

"Script Master: Companion App" is a companion app for [Script Master for Jira](https://marketplace.atlassian.com/apps/1233958/script-master-for-jira?hosting=cloud) and [Script Master for Confluence](https://marketplace.atlassian.com/apps/1234082/script-master-for-confluence?hosting=cloud). This app enables secure script execution for Forge back-end functions.

## The Problem

Running untrusted code is a complex challenge that requires meticulous attention. Atlassian employs a "shared responsibility" model for Forge backend function invocations and storage. While each Forge app operates in its own isolated "container", the functions of the same app are shared across all customer instances (tenants). This creates a theoretical risk where custom scripted Web Triggers, Scheduled Jobs, and other back-end-related modules in Script Master could access global variables or contexts of multiple tenants.

## The Solution

This free app creates an isolated environment for executing all Script Master back-end scripts. By installing your own instance of this app, you gain an environment isolated from all other tenants, ensuring secure and private execution of your scripts. 

## Installation and Configuration

The installation and configuration process consists of five steps:
1. **Clone the Repository** 
2. **Prepare Your Environment** 
3. **Register this app as your own Forge app**  
4. **Install the app in your environment alongside Script Master**  
5. **Generate a secure access token and apply it to Script Master**

### 1. Clone the Repository

Start by cloning this repository to your local machine.

```bash
git clone https://github.com/kaisersoftapps/script-master-sandbox.git
```

### 2. Prepare Your Environment

> [!TIP]
> Skip this step if you've already created a Forge app for this environment.

1. Complete the prerequisites for Forge apps by following Atlassian's [Getting Started Guide](https://developer.atlassian.com/platform/forge/getting-started/).  
   - Ensure Node.js and Forge CLI are installed globally.
2. Install the latest version of `yarn` and enable `corepack` by running
   ```bash
   npm install -g yarn && corepack enable
   ```
   For more details, see the [official documentation](https://yarnpkg.com/corepack).
3. Log in to Forge using
   ```bash
   forge login
   ```
   with an Atlassian API token.

### 3. Register the App

1. Install all project dependencies using
   ```bash
   yarn install
   ```
2. Register a new app in the [Atlassian Developer Console](https://developer.atlassian.com/console/myapps/). This app supports multiple applications and is compatible with Jira and Cloud.
   ```bash
   yarn forge-register script-master-companion-app
   ```

### 4. Install the App

1. Build and deploy the app artifact by running
   ```bash
   yarn forge-deploy -e production
   ```
   from the project root.  
2. Install the app to your cloud site using:
   ```bash
   yarn forge-install --site NAME.atlassian.net --product jira --non-interactive -e production
   ```
   Ensure you have **Administer permissions** on the `NAME.atlassian.net` site where you want to install the app.  
3. Once deployed, the app will be available in the **Manage apps** section of your cloud application.

### 5. Generate and Apply Secure Token

1. Navigate to **Admin settings** → **Apps** → **Script Master: Companion App**.  
2. Copy the auto-generated "Token".
3. Go to **Admin settings** → **Apps** → **Script Master** → **⚙ Settings**.
4. Paste the token and verify that the execution status changes to "Secured Execution".

Once completed, all back-end scripts from Web Triggers, Scheduled Jobs, Custom Fields, Workflow Extensions, and other back-end modules will execute securely within the secured and isolated environment provided by the **Script Master: Companion App** app.

## Troubleshooting and Support

- For issues with Forge installation, building, or deployment, refer to Atlassian's [Getting Started Guide](https://developer.atlassian.com/platform/forge/getting-started/).  
- For additional questions, bug reports, or suggestions, please [contact our Support Team](https://kaisersoftapps.atlassian.net/servicedesk/customer/portal/1).  

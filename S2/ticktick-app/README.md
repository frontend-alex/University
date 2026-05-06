# Project Setup Guide

## Prerequisites
- Node.js and npm installed
- (Optional) Stripe CLI (if testing Stripe payments)

## Installation

### Root Folder
1. Navigate to the root folder and run:
   ```bash
   npm install
   ```
   This will install dependencies for running Cypress tests.

### Server and Client Setup
2. Navigate to both the `server` and `client` folders and run:
   ```bash
   npm install
   ```
3. In both directories, copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

## Server Configuration (TypeScript)
4. In the `server` folder, compile the TypeScript code:
   ```bash
   npm run build
   ```
5. For normal email/password registration functionality, copy the templates folder:
   ```bash
   cp -r src/templates build/templates
   ```

## Stripe Payment Setup & Testing
To test the Stripe payment system and premium account features:

### Stripe CLI Setup
6. Either:
   - Install the Stripe CLI and run:
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
     or on Windows:
     ```bash
     C:\stripe\stripe.exe listen --forward-to localhost:3000/api/stripe/webhook
     ```
   - Or download the Stripe CLI zip and run the same command

7. Copy the generated webhook signing key into your `.env` file in the server directory.

### Test Payment Information
Use these dummy card details for testing payments:

- Card number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits

**Important Note**: 
- The yearly subscription option is currently not functional
- **Use only the monthly subscription option** for testing purposes

## Running the Application
- Start the client and server according to their respective documentation
- Run Cypress tests from the root folder when needed

## Notes
- Make sure to configure all necessary environment variables in both `.env` files
- The Stripe CLI is only required for testing payment functionality
- All test payments are in test mode - no real charges will occur

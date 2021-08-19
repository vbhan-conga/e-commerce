# Digital Commerce Core Reference Template

This is the base reference application for the apttus ecommerce product. Follow the below instructions to get started. See the [docs](https://cmoyle336.github.io/sdk-docs/overview.html) for more detailed instructions on interacting with the underlying SDK.

## Install the managed package in your org
Login to your org and use the following [link](https://login.salesforce.com/packaging/installPackage.apexp?p0=04to000000047xK) to install the managed package. The managed package requires a password, and you'll need to reach out to an Apttus representative to obtain this.

## Install the application
In a terminal window run
```bash
npm install
```

## Sentry Logging
Sentry will be installed and running and, if you run into errors, you may see a popup asking for feedback. You can disable this in your src/app/salesforce.config.ts file with the following flags:

```json
{
    "enableErrorLogging" : false,
    "enableErrorReporting": false
}
```

## Enable/disable localization
If you do not have multi-currency enabled in your org, you must turn off multi-currency support in your storefront in the src/app/salesforce.config.ts file.
```json
{
    "enableMultiCurrency" : false
}
```

## Debugging
You can add query and performance metrics in the console output using the following parameters in the src/app/salesforce.config.ts file
```json
{
    "enableQueryLogs" : true,
    "enablePerformanceLogs" : true
}
```

## Response Encryption
You can disable / enable response encryption (recommended enabled) in the src/app/salesforce.config.ts file
```json
{
    "encryptResponse" : true
}
```

## Product identifier
By default, routing to products in the reference template is dependent on the product code. However, if you wish to use a different field to route to products, you can set the 'productIdentifier' parameter in the config file
to any product field
```json
{
    "productIdentifier" : "ProductCode"
}
```

## Setup the proxy for local development
In the root directory, there is a file named 'proxy.config.json'. This allows you to make SOAP API calls from your local development server (for functionality like login and reprice cart). Populate the 'target' attributes in that file with the instance url of your community.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Deploy to your salesforce org
In a terminal window run
```bash
npm run deploy
```


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

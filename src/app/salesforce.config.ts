import { environment } from '../environments/environment';
import { SalesforceConfig } from 'ng-salesforce';

export const Configuration: SalesforceConfig = {
    instanceUrl: 'https://apttuscommunities-1650db92b24.force.com/ecomm',
    production: environment.production,
    organizationId: '00Df2000000DdlcEAC',
    defaultImageSrc: './',
    defaultCountry : 'US',
    defaultLanguage: 'en-US',
    enableErrorLogging: true,
    enableErrorReporting: true,
    enableMultiCurrency: false,
    enableQueryLogs: true,
    enablePerformanceLogs: false,
    defaultCurrency: 'USD',
    bufferTime: 200,
    maxBufferSize: 10,
    disableBuffer: false,
    disableCache: false,
    encryptResponse: false,
    productIdentifier: 'ProductCode'
};
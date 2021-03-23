# Test Assigment

That's my test assigment. Fun one.

## Installing project

### Using Docker

Check file README in docker directory

### Pre-requirements
* npm >= 6.14
* node >= v12.18.2


In the project directory, run:

### `npm install`

Add .app.Config.json file in the `src/` folder. 

Copy content of ./src/.appConfig.json.dist to ./src/.appConfig.json, don't forget to add a comma between lines:

```json
{
    "endpoints": {
      "translator": "/api/translator/v1/rest",
      "company": "/api/company/v1/rest"
    }
}
```
Copy content of .devProxyConfig.json.dist to .devProxyConfig.json, don't forget to add a comma between lines:
```json
{
  "/api": "https://feniks-omb.g4n.eu"
}
```

## Available commands

In the project directory, you can run:

### `npm start`

Yes, this takes long time!
If files .appConfig.json and .devProxyConfig.json do not exist this command will automatically copy this files from .dist files
Runs the app in the development mode.<br>
Open [http or https depends on HTTPS from .env]://[HOST from .env or localhost]:[PORT from .env] to view it in the browser (should open automatically)

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

If you have problem with creating ssl certificate make sure you have installed openssl and files certificate.cert and private-key.key in  ~/.config/devcert/certificate-authority directory has correct permissions

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Creating unit tests

When you use enzyme, don't forget to import configuration from setupTests.js


```js
import React from 'react';
import { shallow } from 'enzyme';
import FormTitle from './FormTitle';
import config from './../../utils/setupTests';
```
See [Jest documentation](https://jestjs.io/docs/en/getting-started.html)

### `npm test -- --coverage --watchAll=false`

See how [read test coverage reports in Jest](https://medium.com/@krishankantsinghal/how-to-read-test-coverage-report-generated-using-jest-c2d1cb70da8b)

Test coverage takes only files inside `src/Components` and `src/Utils` folder.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!



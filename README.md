# Angular CSV Viewer App

An AngularJS-based user interface for an CSV viewer app

## Installation

1. `npm install -g grunt-cli`
2. `npm install`
3. `grunt install`
4. `./node_modules/.bin/webdriver-manager update`

## Development

1. `grunt dev`
2. Go to: `http://localhost:8888`

## Testing

### Run all tests with
`grunt test` 

### Unit Testing

#### Single run tests
`grunt test:unit`

Note: if phantomjs fails to load, try downloading it from `phantomjs.com` to replace 
`./node_modules/karma-phantomjs-launcher/node_modules/phantomjs/bin/phantomjs`

#### Auto watching tests
`grunt autotest:unit`

### End to End Testing (Protractor)

#### Single run tests
`grunt test:e2e` 

#### Auto watching tests
`grunt autotest:e2e`

### Coverage Testing

`grunt coverage`

module.exports = function(config) {
  config.set({
    files: [
      'bower_components/jquery/jquery.js',
      'bower_components/underscore/underscore.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-spinkit/build/angular-spinkit.js',
      'bower_components/jquery.parse/jquery.parse.js',
      'bower_components/jsencrypt/bin/jsencrypt.js',
      'app/scripts/config.js',
      'app/scripts/directives.js',
      'app/scripts/services.js',
      'app/scripts/homePages.js',
      'app/scripts/filePages.js',
      'app/scripts/app.js',
      'test/unit/**/*.js',
      'app/templates/**/*.html'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    preprocessors: {
      '**/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: 'app'
    },
    browsers: ['PhantomJS'],
    // browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};

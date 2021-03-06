// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      captureConsole: true,
      mocha: {
        bail: true
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../coverage'),
      reports: ['html', 'lcovonly','text-summary'],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 0,
        lines: 0,
        branches: 0,
        functions: 0
      }
    },
    angularCli: {
      environment: 'dev',
      codeCoverage: true
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
    ? ['progress', 'coverage-istanbul']
    : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,
  });
};
// Karma configuration
module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        // reporters: ['progress', 'mocha', 'coverage'], // Enable this to see timing of inidividual reports
        reporters: ['mocha', 'coverage'],
        preprocessors: {
            'build/app/content/**/*.js': ['coverage']
        },
        coverageReporter: {
            dir: 'target/reports/coverage',
            reporters: [
                { type : 'html', subdir : 'report-html/' },
                { type: 'cobertura', subdir: 'report-cobertura', file: 'cobertura.xml' }
            ]
        },
        files: [
            // Polyfills.
            'node_modules/core-js/client/shim.min.js',
            'node_modules/traceur/bin/traceur.js',

            // 'node_modules/reflect-metadata/Reflect.js',

            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',

            // Zone.js dependencies
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/jasmine-patch.js',

            // RxJs.
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            'test-main.js',

            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: true},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true},

            // Applicate and Test Cases
            {pattern: 'build/app/content/**/*.js', included: false, watched: true},
            {pattern: 'build/app/ui.tests/**/*.js', included: false, watched: true},
            // Paths loaded by Angular compiler while compiling components
            {pattern: 'build/app/content/**/*.html', included: false, watched: true},
            {pattern: 'build/app/content/**/*.css', included: false, watched: true},

            // Source maps to support debugging
            {pattern: 'src/main/content/jcr_root/apps/ngaem/components/content/**/*.ts', included: false, watched: false},

            ////images
            //{pattern: 'wwwroot/app/**/*.png', included: false, watched: false},
            //{pattern: 'wwwroot/app/**/*.jpg', included: false, watched: false},
            //{pattern: 'wwwroot/app/**/*.svg', included: false, watched: false}
        ],

        proxies: {
            "/app": "/base/build/app"
        },

        exclude: [
            'node_modules/**/*_spec.js',
        ],

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // browsers: ['Chrome'],
        browsers: ['PhantomJS'],
        singleRun: false
    });
};
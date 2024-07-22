const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl: 'http://localhost:9000',
        options: {
            'sonar.sources': 'src',
            // 'sonar.tests': 'src',
            'sonar.exclusions': 'src/database/migrations/*.ts',
            'sonar.inclusions': 'src/**/*.ts, src/**/*.js' // Entry point of your code,
        }
    },
    () => process.exit()
);

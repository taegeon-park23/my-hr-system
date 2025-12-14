if (process.env.IS_DOCKER !== 'true') {
    console.error('\x1b[31m%s\x1b[0m', 'Error: This project should be run via Docker only.');
    console.error('Please run: docker-compose up');
    process.exit(1);
}

if (process.env.NODE_ENV === "production") {
    console.error(
        "Do not use nodemon in production, run build/server.js directly instead."
    );

    process.exitCode = 1;
    // return;
};

import ngrok from 'ngrok'
import nodemon from 'nodemon'

ngrok.connect({
    proto: 'http',
    addr: 5500
}).then((url) => {
    console.log(`ngrok ==== opened at: ${url}`)
    console.log('open ngrok dash at https://localhost:4040\n')

    nodemon({
        script: '../server.ts',
        exec: `NGROK_URL=${url} node`
    }).on('start', () => {
        console.group("Application restarted due to:")

    }).on('restart', (files) => {
        files?.forEach(file => console.log(file));
        console.groupEnd();
    }).on('quit', () => {
        console.log('The app has been closed, shutting down ngrok tunnel')
        ngrok.kill().then(() => process.exit(0))
    })
}).catch(error => {
    console.error('Error creating ngrok tunnel:', error)
    process.exitCode = 1
})
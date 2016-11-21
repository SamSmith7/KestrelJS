const createServer = require('./index.js')

const port = 3000
const Server$ = createServer(port)

Server$.do(({request, response}) => {
    console.log(request.url)
    response.end('Hello Node.js Server!')
}).subscribe()

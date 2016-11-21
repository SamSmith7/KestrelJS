const http = require('http')
const Rx = require('rxjs/Rx')

const create = (port) => {

    const handler$ = new Rx.Subject()

    const server = http.createServer((request, response) => handler$.next({request, response}))

    server.listen(port, err => {
        err ? console.log('something bad happened', err) : console.log(`server is listening on ${port}`)
        return
    })

    return handler$
}

module.exports = create

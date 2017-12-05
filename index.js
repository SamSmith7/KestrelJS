const http = require('http')
const _ = require('lodash')
const pathToRegexp = require('path-to-regexp')
const Rx = require('rxjs/Rx')


const DEFAULT_MESSAGE = 'Hello Node.js Server!'

class KestrelObservable extends Rx.Observable {

    constructor() {

        super()
        this.send.bind(this)
    }

    static create() {
        const observable = new KestrelObservable();
        observable.source = Rx.Observable.create(...arguments);
        return observable;
    }

    lift(operator) {
        const observable = new KestrelObservable()
        observable.source = this
        observable.operator = operator
        return observable
    }

    send(msg = DEFAULT_MESSAGE) {

        const source = this
        return source.subscribe(({response}) => {

            response.end(msg)
        })
    }
}

const create = (port) => {

    const handler$ = KestrelObservable
        .create(observer => {

            const server = http.createServer((request, response) => observer.next({request, response}))

            server.listen(port, err => {
                err ? console.log('something bad happened', err) : console.log(`server is listening on ${port}`)
                return
            })
        })
        .share()

    const urls = []

    const urlMatch = (index, method) => ({request}) => {

        const incomingUrl = request.url

        const firstMatch = _.findIndex(urls, urlTest => {

            return !_.isNull(urlTest.exec(incomingUrl))
        })

        return method === request.method && firstMatch === (index - 1)
    }

    const get = (url, options) => {

        urls.push(pathToRegexp(url))
        const index = _.size(urls)

        return handler$.filter(urlMatch(index, 'GET'))
    }

    return {

        get
    }
}

module.exports = create

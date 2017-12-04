const http = require('http')
const Rx = require('rxjs/Rx')


class KestrelObservable extends Rx.Observable {

    lift(operator) {
        const observable = new KestrelObservable() //<-- important part here
        observable.source = this
        observable.operator = operator
        observable.__internal = {
            request: {},
            response: {}
        }
        return observable
    }

    send() {

        return SendSubscriber()
    }
}

const SendSubscriber = () => {

    const source = this

    return source.subscribe(() => {

        const { response } = source.__internal
        response.end('Hello Node.js Server!')
    })
}

const findMatch = urlToTest => incomingUrl => {

    // Url Matcher
    return true
}

const create = (port) => {
    console.log(KestrelObservable)
    const handler$ = KestrelObservable
        .create(observer => {

            const server = http.createServer((request, response) => observer.next({request, response}))

            server.listen(port, err => {
                err ? console.log('something bad happened', err) : console.log(`server is listening on ${port}`)
                return
            })
        })

    const urls = []

    const urlMatch = (urlToMatch, method) => ({request}) => {

        const incomingUrl = request.url
        const firstMatch = _.findIndex(urls, findMatch(incomingUrl))

        return method === request.method
            && urlToMatch === urls[firstMatch]
    }

    const get = (url, options) => {

        urls.push(url)
        return handler$.filter(urlMatch(url, 'GET'))
    }

    return {

        get
    }
}

module.exports = create

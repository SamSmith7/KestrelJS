const http = require('http')
const _ = require('lodash')
const pathToRegexp = require('path-to-regexp')
const Rx = require('rxjs/Rx')
const KestrelObservable = require('./kestrel')


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

    const urlMatch = (index, method) => (request) => {

        const incomingUrl = request.url

        const firstMatch = _.findIndex(urls, urlTest => {

            return !_.isNull(urlTest.exec(incomingUrl))
        })

        return method === request.method && firstMatch === (index - 1)
    }

    const get = (url, options) => {

        urls.push(pathToRegexp(url))
        const index = _.size(urls)

        return handler$
            .map(({request, response}) => ({
                request,
                response,
                urlSections: urlMatch(index, 'GET')(request)
            }))
            .filter(({urlSections}) => urlSections)
    }

    return {

        get
    }
}

module.exports = create

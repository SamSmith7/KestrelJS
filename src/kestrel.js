const _ = require('lodash')
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
        return source.subscribe(args => {

            const message = _.isFunction(msg)
                ? msg(args)
                : msg

            args.response.end(message)
        })
    }

    setStatus(status) {

        return KestrelObservable.create(subscriber => {

            const source = this

            const subscription = source.subscribe(args => {

                args.response.statusCode = _.isFunction(status)
                    ? status(args)
                    : status

                try {
                    subscriber.next(args)
                } catch(err) {
                    subscriber.error(err)
                }
            },
            err => subscriber.error(err),
            () => subscriber.complete())

            return subscription;
        })
    }
}

module.exports = KestrelObservable

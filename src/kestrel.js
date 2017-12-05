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

module.exports = KestrelObservable

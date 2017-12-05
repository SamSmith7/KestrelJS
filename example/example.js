const createServer = require('../src/index.js')


const port = 3000
const app = createServer(port)

app.get('/route-one').send('This is a new route :o')

app.get('/').send('Some cool new RXJS api shizz')
// Server$.do(({request, response}) => {
//     console.log(request.url)
//     response.end('Hello Node.js Server!')
// }).subscribe()


// app.get$('/', ({request, response}) => {
//     console.log(request.url)
//     response.end('Hello Node.js Server!')
// })

// const store = mongoDBStore
// const passport = passport(config)
// const errorHandler = err => {
//
//     return {
//         code: 500,
//         message: `Couldn't get User`
//     }
// }

// app.get('/user')
//     .verify(passport)
//     .mergeMap(({body}) => store.fetch(body.userId))
//     .map(UserVO)
//     .catchAndSend(errorHandler)
//     .send()

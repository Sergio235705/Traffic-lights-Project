const config = require('./config')


let id_crossroads = []
let CustomerRatio = [false]
let data = []

function initRoute(app, main) {
    console.log(main)

    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.get('/crossroads/:id', (req, res) => {
        //console.log(req.params.id)
        //console.log(config.CROSSROADS)
        res.send(config.CROSSROADS[req.params.id])
        if (id_crossroads.length == 0) {
            id_crossroads.push(req.params.id)
            main._run()
        } else {
            id_crossroads.pop()
            id_crossroads.push(req.params.id)
        }
        console.log(id_crossroads)

        // console.log(main.data)
    })

    app.get('/last-data', (req, res) => {
        console.log(data)

        res.send(data[0])

    })
    app.post('/crossroads/customer/values', (req, res) => {
        //console.log("....")
        console.log(req.body.ratio)
        console.log(main)
        main.SetCustomerRatio(req.body.ratio)
        res.send(null)

    })
    app.post('/crossroads/api/values', (req, res) => {
        console.log("XXX")
        main.SetApiRatio()
        res.send(null)
        //res.send(main.data.length > 0 ? main.data.slice(main.data.length-1)[0]:null)
    })
}

module.exports = {initRoute, id_crossroads, data, CustomerRatio}

const main = require('./main')
const cors = require('cors')
const express = require('express')
const routes = require('./routes.js')
const morgan = require('morgan')
const app = express()
app.use(express.json());
const port = 3000

app.use(cors({
    origin: '*'
}))
app.use(morgan('tiny'));
//console.log(main.data)
//main.run()
routes.initRoute(app, main)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

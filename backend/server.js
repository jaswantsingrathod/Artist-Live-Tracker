const express = require('express');
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT

const app = express();
app.use(express.json());
app.use(cors())

const configureDB = require('./config/config')
configureDB();
const eventCltr=require('./app/controller/event-controller')

app.post('/events',eventCltr.create)
app.get('/events',eventCltr.list)
app.delete('/events/:id',eventCltr.remove)

app.listen(port, () => {
    console.log('server is running on port', port);
})
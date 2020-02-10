const fs = require('fs');

const express = require('express');
const cors = require('cors');

const fileDb = require('./fileDb');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

fileDb.init();

app.post('/messages', async (req, res) => {
    if(!req.body.author || !req.body.message || req.body.message.length === 0 || req.body.author.length === 0) {
        res.status(400).send({error: "Author and message must be present in the request"})
    } else {
        await fileDb.addNewMessage(req.body);
        res.send(req.body);
    }
});

app.get('/messages', (req, res) => {
    if(req.query.datetime) {
        const date = new Date(req.query.datetime);
        if (isNaN(date.getDate())) res.status(400).send({error: 'date is incorrect!'});

        res.send(fileDb.getLastMessages(req.query.datetime))
    } else res.send(fileDb.getMessages());
});

app.listen(port, () => {
    console.log(`server live on ${port}`);
});

const http = require('http');
const url = require('url');
const bodyParser = require('body-parser')
const express = require('express')
const querystring = require('querystring');
const { text } = require('body-parser');
const { response } = require('express');
const app = express()
const mongoClient = require('mongodb').MongoClient;
app.use(bodyParser.json())
var dbURL = "mongodb+srv://atiksh:lAVNmuWGEthmC0H0@cluster0.ido36.mongodb.net/sandbox?retryWrites=true&w=majority"
const moment = require('moment');
const { executionAsyncResource } = require('async_hooks');
const nodemailer =  require('nodemailer')
const PORT = process.env.PORT || 8080;



app.use(express.static('public'));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'solomonjohnson114@gmail.com',
        pass: '2I3OWU9eGOqx'
    }
});

app.get('/', (req, res) => {
    res.send('shjdj sdfjoiwerhr dfed s');
})


var server = app.listen(PORT, () => {
    var host = server.address().address;
    var port = server.address().address;

    console.log('example app listening at yadda yadda' + host + port);
    console.log(PORT)
})

app.post('/login', (req, res) => {
    console.log('login function reporting for duty')
    var r = req.body
    console.log(r)
    mongoClient.connect(dbURL, (err, db) => {
        if(err) throw err
        var dbo = db.db('sandbox')
        dbo.collection('users').findOne(r   , (err, result) => {
            if(err) throw err
            console.log(result)
            if(result == null) {
                res.send('No')
            }
            else {
                res.send('Yes')
            }
            db.close();
        })
    })
    // recieve the name and password
    // return a match or not
})

app.post('/register', (req, res) => {
    console.log('Registration reporting for duty sir')
    var r = req.body
    console.log(r)
    var mailOptions = {
        from: 'solomonjohnson114@gmail.com',
        to: 'atikshvaish@gmail.com', 
        subject: 'Registration for The HUB',
        text: JSON.stringify(r)
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });   
    mongoClient.connect(dbURL, (err, db) => {
        if(err) throw err
        var dbo = db.db('sandbox')
        dbo.collection('registration').insertOne(r, (err, res) => {
            if(err) throw err 
            console.log('1 document inserted succesfully')
            db.close();
        })
    })
    //receive the data from the text box
    //return 
})

app.post('/list', (req, res) =>  {
    mongoClient.connect(dbURL, (err, db) => {
        if (err) throw err
        var dbo = db.db('sandbox')
        dbo.collection('registration').find({}).toArray( (err, result) => {
            if(err) throw err
            res.send(result)
        })
    })
    //When approve is pressed in the list modal, this will move the approved user from 
    //registration into users
})

app.post('/saveText', (req, res) => {
    console.log('We, the text division of The HUB, are here.')
    // receive a
    // return a 
    var r = req.body
    console.log(r)
    if(r.switch == 'in 8A') {
        switchh = 'agenda'
    }else{
        switchh = 'agenda8b'
    }
    mongoClient.connect(dbURL, (err, db) => {
        if (err) throw err
        var dbo = db.db('sandbox')
        var query = { _id: r._id}
        console.log(query)  
        var time = moment().startOf(r.changed_dateTime).fromNow();
        dbo.collection(switchh).replaceOne(query, r, {upsert: true}, (err, result) => {
            if (err) throw err
            console.log('1 document updated')
            r.time = time
            db.close()
            res.send(r)
        })
    })

})

app.post('/loadText', (req, res) => {
    console.log('The single most important division of the HUB has responded to thy call')
    mongoClient.connect(dbURL, (err, db) => {
        if (err) throw err; 
        var dbo = db.db('sandbox');
        r = req.body
        if(r.switch == 'in 8A') {
            switchh = 'agenda'
        }else{
            switchh = 'agenda8b'
        }
        
        /*dbo.collection('agenda').deleteMany({}, (err, result) => {
            if(err) throw err
            console.log('deleted')
        })*/
        dbo.collection(switchh).find({},{sort:{_id:-1},limit:1}).toArray( (err, result) => { 
            if (err) throw err;
            console.log(result);
            var time = moment(result[0].changed_dateTime).fromNow();
            result[0].time = time       
            console.log(result[0])
            db.close();
            res.send(result[0])
        })

    })
})

/*app.post('/switch', (req, res) => {
    console.log('8B switcher working sire')
    r = req.body
    console.log(r.switch)
    if(r.switch == 'in 8A'){
        switchh = 'agenda8b'
    }else{
        switchh = 'agenda'
    }
    console.log(switchh)
    mongoClient.connect(dbURL, (err, db) => {
        if(err) throw err
        var dbo = db.db('sandbox')
        dbo.collection(switchh).find({}).toArray( (err, result) => {
            if(err) throw err 
            var time = moment(result[0].changed_dateTime).fromNow();
            result[0].time = time       
            res.send(result[0])
        })
    })
})
*/


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const cors = require('cors')
const moment = require('moment')

const mongoose = require('mongoose');
let uri = process.env.MONGO_URI;
mongoose.connect(uri, { 
  useUnifiedTopology: true, 
  useNewUrlParser: true 
});

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/addterms.html')
});


//MongoDB Schema setup for terms
let termSchema = new mongoose.Schema({
	topic: {type: String, required: true},
	term: {type: String, required: true},
	def: {type: String, required: true}
})

//Term for mongoDB Call
let termAdd = mongoose.model('termAdd', termSchema)

//Post to MongoDB

app.post('/api/addterms/add', (req, res) => {
	let topic = req.body.topic
	let newTerm = req.body.term
	let newDef = req.body.def
	let newTopic = topic.toUpperCase()

	console.log('topic = ', newTopic)
	console.log('Term = ', newTerm)
	console.log('Definition = ', newDef)

	termAdd.findOne({'term': newTerm}, (err, storedTerm) => {
	//search mongodb for term key word

		if (err) {
			return;
		} else if (storedTerm) {
			res.send('Term ' + '{' + newTerm + '}' + ' Already in DB')
		} else {
			let addTerm = new termAdd({term: newTerm, topic: newTopic, def: newDef})

			addTerm.save((err, addTerm) => {
				if (err) return;
				// let display = document.getElementById('display');
				console.log(JSON.stringify({term: newTerm}))
				// let string = JSON.stringify({term: newTerm})

				res.json({term: newTerm, topic: newTopic, def: newDef})
			})


		}


	})

})

app.get('/api/terms/get', (req, res) => {
		console.log(req.query.term)
		termAdd.find({}, '', (err, term) => {
			let allTerms = []

			term.map((term) => {
				allTerms.push(term)
			})

			res.send(allTerms)
		})

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
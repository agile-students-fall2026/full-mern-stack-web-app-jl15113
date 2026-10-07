require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// app.use('/static', express.static('picture'))

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

app.get('/about', async (req, res) => {
  try {
    res.json({
      title: 'About Me',
      paragraphs: [
        'Hi, I\'m Jolie Leong and I am currently a senior at NYU majoring in Computer Science and minoring in Integrated Design and Media. This year, I am one of the current co-president of Girls Who Code NYU, where I manage all of the operations within managing the club. Last year, I was the marketing chair where I designed graphics to promote club events and managed the Instagram and LinkedIn accounts.',
        'Outside from school I like to swim, see shows, and hang out with my friends. I take a Swim for Fitness class offered by NYU twice a week where I try to improve my endurance and speed. I love to score deals on Broadway show tickets whether that be from the Telecharge lottery or through NYU Scholastix. With my friends we enjoy watching movies, trying new restaurants, and going to pop ups. For our senior year we made a bucket list we are currently trying to go through. ',
        'To celebrate and capture my senior year, I have started a personal side project to make a documentary about it. My roommate gifted me a camcorder, so I try to record moments I want to remember but also ones I think are significant (good or bad) to my senior year. With no documentary making experience, I hope at the end of the year I am able to edit the videos to make a comprehensible documentary. Anyways, here is me apple picking this past weekend in the Hudson Valley.',
      ],
      imageUrl: 'http://localhost:7002/me.jpeg',
    })

  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to retrieve about me',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!

import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controller/webhooks.js'
import bodyParser from 'body-parser';


//intialise express
const app=express()

//connect to database
await connectDB()

//middlewares 
app.use(cors())
// Clerk webhooks use raw body (must come before express.json())
app.post(
  '/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  clerkWebhooks
);
app.use(express.json())


//routes
app.get('/',(req,res)=> res.send("API WORKING"))


//port
const port=process.env.PORT || 3000

Sentry.setupExpressErrorHandler(app);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

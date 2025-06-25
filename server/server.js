import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controller/webhooks.js'
import bodyParser from 'body-parser';
import connectCloudinary from './config/cloudinary.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'
import dotenv from 'dotenv';

//load env variables
dotenv.config(); 

//intialise express
const app=express()

//connect to database
await connectDB()
//connect cloudinary
await connectCloudinary()

//middlewares 
app.use(cors())
app.post( // clerk webhooks use raw body (must come before express.json())
  '/webhooks',
  bodyParser.raw({ type: 'application/json' }),
  clerkWebhooks
);
app.use(express.json())
app.use(clerkMiddleware())

//routes
app.get('/',(req,res)=> res.send("API WORKING"))
app.use('/api/company',companyRoutes);
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)

//port
const port=process.env.PORT || 3000

Sentry.setupExpressErrorHandler(app);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

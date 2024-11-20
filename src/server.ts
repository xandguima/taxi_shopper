import express from 'express'
import { knex } from './database'

const app=express()

app.use(express.json())




app.listen({
  port:8080,
},()=>{
  console.log('HTTP server running on http://localhost:8080')
})
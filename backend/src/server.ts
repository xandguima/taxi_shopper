import fastify from 'fastify';
import { rideRoutes } from './routes/rideRoutes';
import cors from '@fastify/cors';


const app = fastify()



app.register(cors, {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
});

app.get('/', async (request, reply) => {
  return reply.send("API rodando");
})

app.register(rideRoutes, {
  prefix: '/ride'
});


app.listen({
  port: 8080,
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
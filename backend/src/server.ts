import fastify from 'fastify';
import { rideRoutes } from './routes/rideRoutes';
import cors from '@fastify/cors';
import { driverRoutes } from './routes/driverRoutes';

const app = fastify()

app.register(cors, {
  origin: '*'
})


app.get('/', async (request, reply) => {
  return reply.send("API rodando");
})

app.register(rideRoutes, {
  prefix: '/ride'
});
app.register(driverRoutes,{
  prefix: '/driver'
})

app.listen({
  port: 8080,
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    console.log("error",err);
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
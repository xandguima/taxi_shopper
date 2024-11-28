import fastify from 'fastify';
import { rideRoutes } from './routes/rideRoutes';
import cors from '@fastify/cors';
import { driverRoutes } from './routes/driverRoutes';

export const app = fastify()

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

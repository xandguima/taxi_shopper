import fastify from 'fastify';
import { rideRoutes } from './routes/rideRoutes';
import { FastifyReply } from 'fastify';
//import cookie from '@fastify/cookie';


const app = fastify()
//app.register(cookie);

app.get('/', async (request, reply) => {
  return reply.send({ hello: 'world' });
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
import { FastifyInstance } from "fastify";

import { RideController } from "../controllers/rideController";

const rideController = new RideController();

export async function rideRoutes(app: FastifyInstance) {
  app.post('/estimate', rideController.estimate.bind(rideController));
  app.post('/confirm',rideController.confirm.bind(rideController));
  app.get('/:customer_id',rideController.listRidesByCustomer_id.bind(rideController));
}

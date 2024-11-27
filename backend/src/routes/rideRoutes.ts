import { FastifyInstance } from "fastify";

import { RideController } from "../controllers/RideController";

const rideController = new RideController();

export async function rideRoutes(app: FastifyInstance) {
  app.post('/estimate', rideController.estimate.bind(rideController));
  app.patch('/confirm',rideController.confirm.bind(rideController));
  app.get('/:customer_id',rideController.listRidesByCustomer_id.bind(rideController));
}

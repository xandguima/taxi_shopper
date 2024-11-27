
import { FastifyInstance } from "fastify";
import { DriverController } from "../controllers/DriverController";

const driverController = new DriverController();

export async function driverRoutes(app: FastifyInstance) {
  app.get('/:id',driverController.driverById.bind(driverController));
}
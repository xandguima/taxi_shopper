import { knex } from "../database";
import { z } from 'zod'
import { FastifyReply, FastifyRequest } from "fastify";
export class DriverController {
  async driverById(request: FastifyRequest, reply: FastifyReply) {
    const driverByIdGetSchemaParams = z.object({
      id: z.string(),
    })
    try {
      const params = driverByIdGetSchemaParams.parse(request.params);
      const { id } = params;
      const driver = await knex('drivers').where('id', id).first();
      if (!driver) {
        return reply.status(400).send({
          error_code: "INVALID_DRIVER",
          error_description: 'Motorista nao encontrado',
        });
      }
      return driver;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error_code: "INVALID_DRIVER",
          error_description: error.message,
        })
      } if (error instanceof Error) {
        return reply.status(400).send({
          error_code: "INVALID_DRIVER",
          error_description: 'Motorista nao encontrado',
        });
      } else {
        return reply.status(400).send({
          error_code: "INVALID_DRIVER",
          error_description: 'Erro desconhecido',
        });
      }
    }
  }
}
import { FastifyReply, FastifyRequest } from "fastify";
import { GoogleMapsService } from "../services/gcpService";
import { knex } from "../database";
import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config();

const GCP_API_KEY = process.env.GOOGLE_API_KEY!;

const gcpService = new GoogleMapsService(GCP_API_KEY);

export class RideController {
  async estimate(request: FastifyRequest, reply: FastifyReply) {
    const checkEstimatePostSchema = z.object({
      customer_id: z.string(),
      origin: z.string(),
      destination: z.string(),
    });

    try {

      const body = checkEstimatePostSchema.parse(request.body);

      const { origin, destination } = body;

      const [originLatLng, destinationLatLng] = await Promise.all([
        gcpService.getCoordinatesFromAddress(origin),
        gcpService.getCoordinatesFromAddress(destination),
      ]);

      // Busca a rota
      const route = await gcpService.getRoute(
        originLatLng.lat,
        originLatLng.lng,
        destinationLatLng.lat,
        destinationLatLng.lng
      );

      const drivers = await knex('drivers').select('*')

      const driversAcceptedRide = drivers
        .filter((driver) => {
          return driver.min_distance <= route.distanceMeters / 1000;
        })
        .map(({ min_distance, rate, review, ...rest }) => {
          return {
            ...rest,
            value: Number((rate * (route.distanceMeters / 1000)).toFixed(2)),
            review: JSON.parse(review),
          };
        });

      // Preparando a resposta
      const response = {
        origin: {
          latitude: originLatLng.lat,
          longitude: originLatLng.lng,
        },
        destination: {
          latitude: destinationLatLng.lat,
          longitude: destinationLatLng.lng,
        },
        distance: route.distanceMeters,
        duration: route.duration,
        options: driversAcceptedRide,
        routeResponse: route,
      };

      reply.status(200).send(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erro de validação do Zod
        reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
          details: error.errors,
        });
      } else if (error instanceof Error && error.message) {
        reply.status(500).send({
          error_code: 'INTERNAL_ERROR',
          error_description: 'Erro no processamento dos dados. Por favor, tente novamente.',
          details: error.message

        });
      } else {

        reply.status(500).send({
          error_code: 'UNEXPECTED_ERROR',
          error_description: 'Ocorreu um erro desconhecido. Por favor, tente novamente.',
        });
      }
    }
  }
  async confirm(request: FastifyRequest, reply: FastifyReply) {
    const checkConfirmPostSchema = z.object({
      customer_id: z.string(),
      origin: z.string(),
      destination: z.string(),
      distance: z.number(),
      duration: z.string(),//talvez opcional
      driver: z.object({
        id: z.number(),
        name: z.string()
      }),
      value: z.number()
    });
    try {
      const body = checkConfirmPostSchema.parse(request.body);
      const { customer_id, origin, destination, distance, duration, driver, value } = body;

      const originLatLng = await gcpService.getCoordinatesFromAddress(origin);
      const destinationLatLng = await gcpService.getCoordinatesFromAddress(destination);

      if (originLatLng.lat === destinationLatLng.lat && originLatLng.lng === destinationLatLng.lng) {
        return reply.status(400).send({
          error_code: "SAME_ORIGIN_AND_DESTINATION",
          error_description: 'Origem e destino devem ser diferentes',
        });
      }

      // const { rideEstimated } = request.cookies;
      //console.log("rideEstimated", rideEstimated)
      const driverConsult = await knex('drivers').where('id', driver.id).first();

      if (!driverConsult) {
        return reply.status(400).send({
          error_code: "DRIVER_NOT_FOUND",
          error_description: 'Motorista não encontrado',
        });
      }

      if (driverConsult.min_distance > distance / 1000) {
        return reply.status(400).send({
          error_code: "INVALID_DISTANCE",
          error_description: 'Quilometragem inválida para o motorista',
        });
      }

      await knex('rides').insert({
        customer_id,
        origin,
        destination,
        distance,
        duration,
        driver_id: driver.id,
        value,
      })


      reply.status(200).send({
        sucess: true
      })

    } catch (error) {
      if (error instanceof z.ZodError) {
        //Error validação dados pelo Zod
        reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: 'Os dados fornecidos no corpo da requisição são inválidos',
          details: error.errors,
        })
      } else if (error instanceof Error && error.message ) {
        reply.status(500).send({
          error_code: "INTERNAL_ERROR",
          error_description: 'Erro ao processar a requisição, por favor tente novamente',
          details: error.message
        })
      } else {
        reply.status(500).send({
          error_code: "UNEXPECTED_ERROR",
          error_description: 'Erro inesperado, por favor tente novamente',
        })
      }
    }
  }
  async listRidesByCustomer_id(request: FastifyRequest, reply: FastifyReply) {
    const listRidesByCustomer_idGetSchemaParams = z.object({
      customer_id: z.string(),

    })
    const listRidesByCustomer_idGetQuery = z.object({
      driver_id: z.string().optional(),
    })

    try {
      const params = listRidesByCustomer_idGetSchemaParams.parse(request.params);
      const query = listRidesByCustomer_idGetQuery.parse(request.query);

      const { customer_id } = params;
      const { driver_id } = query;
    
      let rides = await knex('rides').where({ customer_id }).select('*');

      if (driver_id) {
        const driver_id_number = Number(driver_id);
        const driver = await knex('drivers').where('id', driver_id_number).first();

        if (!driver) {
          return reply.status(400).send({
            error_code: "INVALID_DRIVER",
            error_description: 'Motorista nao encontrado',
          });
        }
        rides = await knex('rides')
          .where({ customer_id })
          .where('driver_id', driver_id_number)
          .select('*');
      }
       
      if (rides.length === 0) {
        return reply.status(404).send({
          error_code: "NO_RIDES_FOUND",
          error_description: 'Nenhuma corrida encontrada',
        });
      }

      reply.status(200).send(rides)

    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          error_code: "INVALID_DATA",
          error_description: "Dados enviados inválidos",
          details: error.errors
        })
      } else if (error instanceof Error) {
        console.log({error})
        reply.status(500).send({
          error_code: "INTERNAL_ERROR",
          error_description: "Ocorreu um erro interno ao processar a requisição, por favor tente novamente",
          details: error
        })
      } else {
        reply.status(500).send({
          error_code: "UNEXPECTED_ERROR",
          error_description: "Ocorreu um erro inesperado ao processar a requisição, por favor tente novamente",
        })
      }
    }
  }
}


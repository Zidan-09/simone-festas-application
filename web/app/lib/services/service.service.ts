import { prisma } from "../prisma";
import { CreateService, EditService } from "../utils/requests/service.request";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { AppError } from "../withError";

export type ServiceSearchPayload = {
  query: string;
};

export const ServiceService = {
  async create(content: CreateService) {
    try {
      return await prisma.service.create({
        data: {
          name: content.name.trim().normalize("NFC").toLowerCase(),
          price: content.price
        }
      });

    } catch {
      throw new AppError(400, ServiceResponses.SERVICE_CREATED_ERROR);
    }
  },

  async get(id: string) {
    const service = await prisma.service.findUnique({
      where: {
        id
      }
    });

    if (!service) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

    return service;
  },

  async getByName(name: string) {
    const services = await prisma.service.findMany({
      where: {
        name: name.trim().normalize("NFC").toLowerCase()
      }
    });

    if (services.length === 0) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

    return services;
  },

  async getAll() {
    return await prisma.service.findMany();
  },

  async edit(id: string, content: EditService) {
    try {
      const currentService = await prisma.service.findUnique({
        where: {
          id
        }
      });

      if (!currentService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

      let serviceEdited: boolean = false;

      if (
        currentService.name !== content.name ||
        !currentService.price.equals(content.price)
      ) {
        await prisma.service.update({
          where: {
            id
          },
          data: {
            name: content.name.trim().normalize("NFC").toLowerCase(),
            price: content.price
          }
        });

        serviceEdited = true;
      };

      return {
        serviceId: currentService.id,
        updatedService: serviceEdited
      };

    } catch (err: any) {
      if (err?.statusCode) throw err;

      throw new AppError(500, ServiceResponses.SERVICE_UPDATED_ERROR);
    }
  },

  async delete(id: string) {
    try {
      await prisma.service.delete({
        where: {
          id
        }
      });

    } catch {
      throw new AppError(404, ServiceResponses.SERVICE_DELETED_ERROR);
    }
  },

  async search(payload: ServiceSearchPayload) {
    return await prisma.service.findMany({
      where: {
        name: {
          startsWith: payload.query
        }
      }
    });
  }
}
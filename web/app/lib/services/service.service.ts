import { prisma } from "../prisma";
import { put, del } from "@vercel/blob";
import { CreateService, EditService } from "../utils/requests/service.request";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { AppError } from "../withError";

type FileOrString = File | string;

export type ServiceSearchPayload = {
  query: string;
};

export const ServiceService = {
  async create(formData: FormData) {
    const { name, icon, price }: CreateService = {
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      icon: formData.get("icon") as File
    }

    const serviceId = crypto.randomUUID();

    const blob = await put(
      `services/${serviceId}/${crypto.randomUUID()}`,
      icon,
      { access: "public" }
    );

    try {
      return await prisma.service.create({
        data: {
          id: serviceId,
          name: name.trim().normalize("NFC").toLowerCase(),
          price: price,
          icon: blob.url
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

  async edit(id: string, formData: FormData) {
    const { name, icon, price }: EditService = {
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      icon: formData.get("icon") as FileOrString,
    }

    try {
      const currentService = await prisma.service.findUnique({
        where: {
          id
        }
      });

      if (!currentService) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

      let serviceEdited: boolean = false;

      let image: string;

      if (icon instanceof File) {
        image = await put(
          `services/${id}/${crypto.randomUUID()}`,
          icon,
          { access: "public" }
        ).then(blob => blob.url);

        await del(currentService.icon);

      } else {
        image = icon;
      }

      if (
        currentService.name !== name ||
        !currentService.price.equals(price)
      ) {
        await prisma.service.update({
          where: {
            id
          },
          data: {
            name: name.trim().normalize("NFC").toLowerCase(),
            price: price,
            icon: image
          }
        });

        serviceEdited = true;
      };

      return {
        serviceId: currentService.id,
        updatedService: serviceEdited
      };

    } catch (err: unknown) {
      if (err instanceof AppError) throw err;

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
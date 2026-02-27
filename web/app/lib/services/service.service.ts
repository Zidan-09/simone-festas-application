import { prisma } from "../prisma";
import { put, del } from "@vercel/blob";
import { CreateService, EditService } from "../dto/service.request";
import { ServiceResponses } from "../utils/responses/serviceResponses.";
import { AppError } from "../withError";
import { KitType } from "@prisma/client";

type FileOrString = File | string;

export type ServiceSearchPayload = {
  query: string;
};

export const ServiceService = {
  async create(formData: FormData) {
    const { name, icon, price, forKit }: CreateService = {
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      icon: formData.get("icon") as File,
      forKit: formData.get("forKit") as KitType
    }

    const serviceId = crypto.randomUUID();

    const blob = await put(
      `services/${serviceId}/${crypto.randomUUID()}`,
      icon,
      { access: "public" }
    );

    const forKitType = Object.values(KitType).includes(forKit) ? forKit : "ALL";

    try {
      return await prisma.service.create({
        data: {
          id: serviceId,
          name: name.trim().normalize("NFC").toLowerCase(),
          price: price,
          icon: blob.url,
          forKit: forKitType
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

  async getAll(kitType: KitType) {
    const param = Object.values(KitType).includes(kitType) ? kitType : "ALL";
    const filter = [param];

    if (filter.includes("ALL")) {
      return await prisma.service.findMany();
    }

    filter.push("ALL");

    return await prisma.service.findMany({
      where: {
        forKit: {
          in: filter
        }
      }
    });
  },

  async edit(id: string, formData: FormData) {
    const { name, icon, price, forKit }: EditService = {
      name: String(formData.get("name")),
      price: Number(formData.get("price")),
      icon: formData.get("icon") as FileOrString,
      forKit: formData.get("forKit") as KitType
    }

    const forKitType = Object.values(KitType).includes(forKit) ? forKit : "ALL";

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
        !currentService.price.equals(price) ||
        currentService.forKit !== forKit
      ) {
        await prisma.service.update({
          where: {
            id
          },
          data: {
            name: name.trim().normalize("NFC").toLowerCase(),
            price: price,
            icon: image,
            forKit: forKitType
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
      const service = await prisma.service.findUnique({
        where: { id }
      });

      if (!service) throw new AppError(404, ServiceResponses.SERVICE_NOT_FOUND);

      await del(service.icon);

      await prisma.service.delete({
        where: {
          id
        }
      });

    } catch {
      throw new AppError(400, ServiceResponses.SERVICE_DELETED_ERROR);
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
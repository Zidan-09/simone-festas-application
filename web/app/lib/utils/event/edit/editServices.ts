import { Prisma } from "@prisma/client";
import { EventPayload } from "../../requests/event.request";

export async function editServices(
  tx: Prisma.TransactionClient,
  services: EventPayload["services"],
  eventId: string
): Promise<boolean> {
  let update = false;

  const currentServices = await tx.eventService.findMany({
    where: { eventId: eventId }
  });

  const currentServicesMap = new Map(currentServices.map((s) => [s.serviceId, s]));

  for (const serviceId of services) {
    const current = currentServicesMap.get(serviceId);

    if (!current) {
      await tx.eventService.create({
        data: {
          eventId: eventId,
          serviceId: serviceId
        }
      });

      update = true;
    };
  };

  const servicesIds = new Set(services.map(serviceId => serviceId));

  const servicesToDelete = currentServices
  .filter(service => !servicesIds.has(service.serviceId))
  .map(service => service.serviceId);

  if (servicesToDelete.length > 0) {
    await tx.eventService.deleteMany({
      where: {
        eventId,
        serviceId: { in: servicesToDelete }
      }
    });

    update = true;
  };

  return update;
};
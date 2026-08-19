import { Injectable, NotFoundException } from '@nestjs/common';
import { ModerationActionType, ModerationTargetType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type TxClient = Prisma.TransactionClient;

/**
 * Cada acción de moderación (hide/restore/ban) actualiza la entidad y escribe
 * su ModerationAction dentro de la MISMA transacción, para las 3 tablas
 * moderables (Business, Product, SupportPost) sin repetir el patrón 9 veces.
 */
@Injectable()
export class AdminModerationService {
  constructor(private readonly prisma: PrismaService) {}

  hideBusiness(id: string, adminId: string) {
    return this.moderate(ModerationTargetType.BUSINESS, id, ModerationActionType.SOFT_DELETE, adminId, undefined, (tx) =>
      tx.business.update({ where: { id }, data: { deletedAt: new Date() } }),
    );
  }

  restoreBusiness(id: string, adminId: string) {
    return this.moderate(ModerationTargetType.BUSINESS, id, ModerationActionType.RESTORE, adminId, undefined, (tx) =>
      tx.business.update({ where: { id }, data: { deletedAt: null } }),
    );
  }

  banBusiness(id: string, adminId: string, note: string) {
    return this.moderate(ModerationTargetType.BUSINESS, id, ModerationActionType.BAN, adminId, note, (tx) =>
      tx.business.update({ where: { id }, data: { bannedAt: new Date(), moderationNote: note } }),
    );
  }

  hideProduct(id: string, adminId: string) {
    return this.moderate(ModerationTargetType.PRODUCT, id, ModerationActionType.SOFT_DELETE, adminId, undefined, (tx) =>
      tx.product.update({ where: { id }, data: { deletedAt: new Date() } }),
    );
  }

  restoreProduct(id: string, adminId: string) {
    return this.moderate(ModerationTargetType.PRODUCT, id, ModerationActionType.RESTORE, adminId, undefined, (tx) =>
      tx.product.update({ where: { id }, data: { deletedAt: null } }),
    );
  }

  banProduct(id: string, adminId: string, note: string) {
    return this.moderate(ModerationTargetType.PRODUCT, id, ModerationActionType.BAN, adminId, note, (tx) =>
      tx.product.update({ where: { id }, data: { bannedAt: new Date(), moderationNote: note } }),
    );
  }

  hideSupportPost(id: string, adminId: string) {
    return this.moderate(
      ModerationTargetType.SUPPORT_POST,
      id,
      ModerationActionType.SOFT_DELETE,
      adminId,
      undefined,
      (tx) => tx.supportPost.update({ where: { id }, data: { deletedAt: new Date() } }),
    );
  }

  restoreSupportPost(id: string, adminId: string) {
    return this.moderate(ModerationTargetType.SUPPORT_POST, id, ModerationActionType.RESTORE, adminId, undefined, (tx) =>
      tx.supportPost.update({ where: { id }, data: { deletedAt: null } }),
    );
  }

  banSupportPost(id: string, adminId: string, note: string) {
    return this.moderate(ModerationTargetType.SUPPORT_POST, id, ModerationActionType.BAN, adminId, note, (tx) =>
      tx.supportPost.update({ where: { id }, data: { bannedAt: new Date(), moderationNote: note } }),
    );
  }

  private async moderate<T>(
    targetType: ModerationTargetType,
    targetId: string,
    action: ModerationActionType,
    adminId: string,
    note: string | undefined,
    update: (tx: TxClient) => Promise<T>,
  ): Promise<T> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const updated = await update(tx);

        await tx.moderationAction.create({
          data: { adminId, targetType, targetId, action, note },
        });

        return updated;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Contenido no encontrado');
      }

      throw error;
    }
  }
}

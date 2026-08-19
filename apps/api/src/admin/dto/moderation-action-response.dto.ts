import type { ModerationAction, ModerationActionType, ModerationTargetType } from '@prisma/client';

export interface ModerationActionResponseDto {
  id: string;
  action: ModerationActionType;
  targetType: ModerationTargetType;
  targetId: string;
  note: string | null;
  createdAt: Date;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

type ModerationActionWithAdmin = ModerationAction & {
  admin: { id: string; name: string; email: string };
};

export function toModerationActionResponse(action: ModerationActionWithAdmin): ModerationActionResponseDto {
  return {
    id: action.id,
    action: action.action,
    targetType: action.targetType,
    targetId: action.targetId,
    note: action.note,
    createdAt: action.createdAt,
    admin: action.admin,
  };
}

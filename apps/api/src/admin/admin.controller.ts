import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthenticatedAdmin } from '../auth/types/authenticated-admin.type';
import { AdminService } from './admin.service';
import { AdminModerationService } from './admin-moderation.service';
import { BanDto } from './dto/ban.dto';
import { QueryActionsDto } from './dto/query-actions.dto';
import { QueryAdminContentDto } from './dto/query-admin-content.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly moderationService: AdminModerationService,
  ) {}

  @Get('queue')
  getQueue() {
    return this.adminService.getQueue();
  }

  @Get('actions')
  listActions(@Query() query: QueryActionsDto) {
    return this.adminService.listActions(query);
  }

  /** A diferencia de /admin/queue (solo PENDIENTE), esto trae todo para poder buscar y revisar cualquier negocio. */
  @Get('businesses')
  listBusinesses(@Query() query: QueryAdminContentDto) {
    return this.adminService.listBusinesses(query);
  }

  @Get('support-posts')
  listSupportPosts(@Query() query: QueryAdminContentDto) {
    return this.adminService.listSupportPosts(query);
  }

  @Patch('businesses/:id/hide')
  hideBusiness(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.hideBusiness(id, admin.id);
  }

  @Patch('businesses/:id/restore')
  restoreBusiness(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.restoreBusiness(id, admin.id);
  }

  @Patch('businesses/:id/ban')
  banBusiness(@Param('id') id: string, @Body() dto: BanDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.banBusiness(id, admin.id, dto.note);
  }

  @Patch('products/:id/hide')
  hideProduct(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.hideProduct(id, admin.id);
  }

  @Patch('products/:id/restore')
  restoreProduct(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.restoreProduct(id, admin.id);
  }

  @Patch('products/:id/ban')
  banProduct(@Param('id') id: string, @Body() dto: BanDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.banProduct(id, admin.id, dto.note);
  }

  @Patch('support-posts/:id/hide')
  hideSupportPost(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.hideSupportPost(id, admin.id);
  }

  @Patch('support-posts/:id/restore')
  restoreSupportPost(@Param('id') id: string, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.restoreSupportPost(id, admin.id);
  }

  @Patch('support-posts/:id/ban')
  banSupportPost(@Param('id') id: string, @Body() dto: BanDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.moderationService.banSupportPost(id, admin.id, dto.note);
  }
}

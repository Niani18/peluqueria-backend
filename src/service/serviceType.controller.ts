import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ServiceTypeService } from "./serviceType.service.js";
import { ServiceTypeDTO } from "./dto/serviceType.dto.js";
import { ServiceType } from "./interface/serviceType.entity.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";

@Roles(Role.Admin)
@Controller('service-types')
export class ServiceTypeController {
  constructor(
    private readonly serviceTypeService: ServiceTypeService 
  ) {}

  @Get()
  async findAll(): Promise<ServiceType[]> {
    return this.serviceTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ServiceType | null> {
    return this.serviceTypeService.findById(id);
  }

  @Post()
  async create(@Body() body: ServiceTypeDTO): Promise<ServiceType>{
    return this.serviceTypeService.createServiceType(body);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: ServiceTypeDTO): Promise<ServiceType | null> {
    return this.serviceTypeService.updateServiceType(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.serviceTypeService.deleteServiceType(id);
  }

}


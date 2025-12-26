import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ServiceService } from "./service.service.js";
import { ServiceDTO } from "./dto/service.dto.js";
import { Service } from "./interface/service.entity.js";
import { PriceDTO } from "./dto/price.dto.js";
import { Price } from "./interface/price.entity.js";
import { UpdateServiceDTO } from "./dto/updateService.dto.js";
import { ServiceQueryDTO } from "./dto/service-pagination.dto.js";
import { Roles, User } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";



@Controller('service')
export class ServiceController {
  constructor(
    private readonly serviceService: ServiceService 
  ) {}

  @Roles(Role.Admin)
  @Get("search")
  async search(@Query() search: ServiceQueryDTO) {
    return this.serviceService.search(search);
  }

  @Roles(Role.User)
  @Get("search-user")
  async searchUser(@Query() search: ServiceQueryDTO){
    search.state = true
    return this.serviceService.search(search)
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Service | null> {
    return this.serviceService.findById(id);
  }

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: ServiceDTO): Promise<Service>{
    return this.serviceService.createService(body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateServiceDTO): Promise<Service | null> {
    return this.serviceService.updateService(id, body);
  }

  @Roles(Role.Admin)
  @Post(':id/price')
  async updatePrice(@Param('id', ParseIntPipe) id: number, @Body() body: PriceDTO): Promise<Price | null> {
    return this.serviceService.updatePrice(id, body);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.serviceService.deleteService(id);
  }

}


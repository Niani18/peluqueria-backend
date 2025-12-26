import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { SuppliesDto } from "./dto/supplies.dto.js";
import { SuppliesService } from "./supplies.service.js";
import { Supplies } from "./interface/materials.entity.js";
import { SuppliesQueryDto } from "./dto/paginationSupplies.dto.js";
import { SupplyUpdateDto } from "./dto/supply-update.dto.js";
import { Role } from "../auth/role.enum.js";
import { Roles } from "../shared/decorators.js";


@Roles(Role.Admin)
@Controller('supplies')
export class SuppliesController {
  constructor(
    private readonly suppliesService: SuppliesService
  ) {}

  @Get('all')
  async findAll(): Promise<Supplies[]> {
    return this.suppliesService.findAll();
  }

  @Get('search')
  async search(@Query() query: SuppliesQueryDto){
    return this.suppliesService.search(query)
  } 


  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Supplies | null> {
    return this.suppliesService.findById(id);
  }

  @Post()
  async create(@Body() body: SuppliesDto): Promise<Supplies>{
    return this.suppliesService.createSupplies(body);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: SupplyUpdateDto): Promise<Supplies | null> {
    return this.suppliesService.updateSupplies(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.suppliesService.deleteSupplies(id);
  }

}
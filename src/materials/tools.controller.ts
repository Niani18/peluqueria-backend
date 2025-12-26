import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ToolsDto } from "./dto/tools.dto.js";
import { ToolsService } from "./tools.service.js";
import { Tools } from "./interface/materials.entity.js";
import { ToolsQueryDto } from "./dto/paginationTools.dto.js";
import { ToolUpdateDto } from "./dto/tool-update.dto.js";
import { Role } from "../auth/role.enum.js";
import { Roles } from "../shared/decorators.js";

@Controller('tools')
@Roles(Role.Admin)
export class ToolsController {
  constructor(
    private readonly toolsService: ToolsService
  ) {}

  @Get('all')
  async findAll(): Promise<Tools[]> {
    return this.toolsService.findAll();
  }

  @Get('search')
  async search(@Query() query: ToolsQueryDto){
    return this.toolsService.search(query)
  } 

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tools | null> {
    return this.toolsService.findById(id);
  }

  @Post()
  async create(@Body() body: ToolsDto): Promise<Tools>{
    return this.toolsService.createTools(body);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: ToolUpdateDto): Promise<Tools | null> {
    return this.toolsService.updateTools(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.toolsService.deleteTools(id);
  }

}
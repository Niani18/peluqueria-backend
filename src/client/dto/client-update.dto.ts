import { PartialType } from "@nestjs/mapped-types";
import { CreateClientDto } from "./client.dto.js";


export class ClientUpdateDTO extends PartialType(CreateClientDto) {}
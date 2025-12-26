import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { Public } from "../shared/decorators.js";
import { LogInDTO } from "./dto/user-login.dto.js";
import { RegisterDTO } from "./dto/user-register.dto.js";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() logInDto: LogInDTO) {
    return this.authService.validateUser(logInDto.username, logInDto.password)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.signUp(registerDto);
  }

}
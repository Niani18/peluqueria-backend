import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { User } from "./interface/user.entity.js";
import { RegisterDTO } from "./dto/user-register.dto.js";
import { EntityManager } from "@mikro-orm/mysql";
import { Role } from "./role.enum.js";
import { ClientService } from "../client/client.service.js";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly clientRepo: ClientService
  ){}

  async validateUser (username: string, password: string): Promise<{ access_token: string }> {
 
    const user = await this.userRepository.findOneOrFail({ username }, {
      populate: ["client"],
      failHandler:  () => {throw new NotFoundException("User not found")}
    }) as User;

    if(user && user.password !== password) throw new UnauthorizedException('Invalid credentials');

    const payload = {username: user.username, clientId: user.client?.id, role: user.role};

    return {
      access_token: this.jwtService.sign(payload)
    }
  }

  async signUp(userData: RegisterDTO): Promise<User> {
    (userData as User).role = [Role.User];
    const { client, ...onlyUser } = userData;

    if (onlyUser.password !== onlyUser.passwordConfirm) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = this.userRepository.create(onlyUser);

    try {
      await this.em.persistAndFlush(user); // inserta el user
      if (client) {
        await this.clientRepo.createClient({
          surname: client.surname,
          name: client.name,
          email: client.email,
          phone: client.phone,
          user,
        });
      }
      return user;

    } catch (err) {
      // 👇 detectá la violación de unicidad
      if (err.name === 'UniqueConstraintViolationException' || err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('El email ya está registrado');
      }

      // cualquier otro error: lo lanzás para que lo agarre el filtro global
      throw err;
    }
  }

}
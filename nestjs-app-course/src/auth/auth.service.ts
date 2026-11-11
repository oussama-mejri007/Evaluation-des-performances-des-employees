import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User, Role } from "../user/entities/user.entity";

interface RegisterInput {
  email: string;
  password: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(dto: RegisterInput) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email as any } });
    if (existing) throw new ConflictException("Email already in use");

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      email: dto.email as any,
      passwordHash: passwordHash as any,
      role: dto.role ?? Role.EMPLOYEE,
      firstName: dto.firstName as any,
      lastName: dto.lastName as any,
    });
    await this.userRepository.save(user);
    return this.buildAuthResponse(user);
  }

  public async login(dto: LoginInput) {
    const user = await this.userRepository.findOne({ where: { email: dto.email as any } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isValid = await bcrypt.compare(dto.password, user.passwordHash as unknown as string);
    if (!isValid) throw new UnauthorizedException("Invalid credentials");

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
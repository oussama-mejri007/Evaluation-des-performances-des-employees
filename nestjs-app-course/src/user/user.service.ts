import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, Role } from "./entities/user.entity";

interface UpdateUserInput {
  email?: String;
  role?: Role;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public getAll() {
    return this.userRepository.find({ relations: ["employee"] });
  }

  public async getOneBy(id: String) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ["employee"] });
    if (!user) { throw new NotFoundException("user not found"); }
    return user;
  }

  public async update(id: String, dto: UpdateUserInput) {
    const user = await this.getOneBy(id);
    user.email = dto.email ?? user.email;
    user.role = dto.role ?? user.role;
    return this.userRepository.save(user);
  }

  public async delete(id: String) {
    const user = await this.getOneBy(id);
    this.userRepository.remove(user);
    return { message: "user delete succefully" };
  }
}
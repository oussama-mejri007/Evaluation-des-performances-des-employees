import { UserService } from "./user.service";
import { Controller, Get, Param, Put, Body, Delete } from "@nestjs/common";
import { Role } from "./entities/user.entity";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public getAllUsers() {
    return this.userService.getAll();
  }

  @Get(":id")
  public getSingleUser(@Param("id") id: String) {
    return this.userService.getOneBy(id);
  }

  @Put(":id")
  public updateUser(@Param("id") id: String, @Body() body: { email?: String; role?: Role }) {
    return this.userService.update(id, body);
  }

  @Delete(":id")
  public delete(@Param("id") id: String) {
    return this.userService.delete(id);
  }
}
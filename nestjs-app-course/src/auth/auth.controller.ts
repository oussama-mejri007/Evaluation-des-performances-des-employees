import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Role } from "../user/entities/user.entity";

@Controller("api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  public register(
    @Body() body: { email: string; password: string; role?: Role; firstName?: string; lastName?: string },
  ) {
    return this.authService.register(body);
  }

  @Post("login")
  public login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  public me(@Req() req: any) {
    return req.user;
  }
}
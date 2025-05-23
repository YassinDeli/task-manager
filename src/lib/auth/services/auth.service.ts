import { UserService } from "@/lib/users-management/services/user.service";
import { comparePasswords } from "@/lib/utils/hash.util";
import { ConnectPayload, RegisterPayload, User } from "@/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppConfig from "@/lib/config/app.config";

export class AuthService {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = jwt.sign(payload, AppConfig.JWT_SECRET, {
      expiresIn: AppConfig.JWT_ACCESS_EXPIRATION,
    });

    const refreshToken = jwt.sign(payload, AppConfig.JWT_SECRET, {
      expiresIn: AppConfig.JWT_REFRESH_EXPIRATION,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateUser(userId, { refreshToken: hashedToken });
  }

  async connect(payload: ConnectPayload) {
    const user = await this.userService.getUserByCondition({
      filter: `(username||$eq||${payload.usernameOrEmail};email||$eq||${payload.usernameOrEmail})`,
    });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch =
      user.password &&
      (await comparePasswords(payload.password, user.password));
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const { accessToken, refreshToken } = this.generateTokens(user);
    return { user, accessToken, refreshToken };
  }

  async register(payload: RegisterPayload) {
    const existingUser = await this.userService.getUserByCondition({
      filter: `(username||$eq||${payload.username};email||$eq||${payload.email})`,
    });
    if (existingUser) {
      throw new Error("Username or email already taken");
    }
    return this.userService.createUser(payload);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refreshToken) {
      throw new Error("Invalid refresh token");
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new Error("Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      this.generateTokens(user);
    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

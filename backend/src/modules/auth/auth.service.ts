import { AppDataSource } from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { LoginInput, RegisterInput } from "./auth.schemas";
import argon2 from "argon2";

const authErrors = {
  emailAlreadyExists: {
    status: 409,
    code: "EMAIL_ALREADY_EXISTS",
    message: "An account with this email already exists",
  },
  invalidCredentials: {
    status: 401,
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password",
  },
  userNotFound: {
    status: 404,
    code: "USER_NOT_FOUND",
    message: "User not found",
  },
} as const;

export default class AuthService {
  constructor(private userRepository = AppDataSource.getRepository(User)) {}

  //REGISTER
  async register(data: RegisterInput): Promise<User> {
    const { name, email, password } = data;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser)
      throw {
        status: 409,
        message: "An account with this email already exists",
      };

    const passwordHash = await argon2.hash(password);
    const user = this.userRepository.create({ email, passwordHash, name });
    return await this.userRepository.save(user);
  }

  //LOGIN
  async login(data: LoginInput): Promise<User> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw authErrors.userNotFound;

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid)
      throw { status: 401, message: "Invalid email or password" };
    return user;
  }

  //ME (AUTHERIZED USER)
  async me(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "name", "createdAt", "updatedAt"],
    });

    if (!user) if (!user) throw authErrors.userNotFound;
    return user;
  }
}

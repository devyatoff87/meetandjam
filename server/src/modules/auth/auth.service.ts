import { AppDataSource } from "../../db/data-source";
import { User } from "../../db/entities/user.entity";
import { LoginInput, RegisterInput } from "./auth.schemas";
import argon2 from "argon2";

export default class AuthService {
  constructor(private userRepository = AppDataSource.getRepository(User)) {}

  //REGISTER
  async register(data: RegisterInput): Promise<User> {
    const { name, email, password } = data;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser)
      throw new Error("An account with this email is already exists");

    const passwordHash = await argon2.hash(password);
    const user = this.userRepository.create({ email, passwordHash, name });
    return await this.userRepository.save(user);
  }

  //LOGIN
  async login(data: LoginInput): Promise<User> {
    const { email, password } = data;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error("Either email or password is not correct. Please retry");
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) {
      throw new Error("Login or password is not correct");
    }
    return user;
  }

  async me(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "name", "createdAt", "updatedAt"],
    });

    if (!user) {
      throw new Error("User could not be found");
    }
    return user;
  }
}

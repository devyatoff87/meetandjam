import { AppDataSource } from "../db/data-source";
import { User } from "../db/entities/user.entity";
import { hashMockUsers } from "./mock/users";

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);
  const users = await hashMockUsers();
  let count = 0;

  for (const user of users) {
    const exists = await userRepository.findOne({
      where: { email: user.email },
    });

    if (!exists) {
      await userRepository.save(user);
      count++;
    }
  }
}

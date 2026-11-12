import argon2 from "argon2";

export const mockUsers = [
  {
    email: "admin@meetandjam.de",
    password: "Admin123!",
    name: "Admin User",
  },
  {
    email: "jazzfan@berlin.de",
    password: "JazzFan123!",
    name: "Jazz Fan",
  },
  {
    email: "jammer@hamburg.de",
    password: "Jammer456!",
    name: "Jammer Hamburg",
  },
  {
    email: "musician@munich.de",
    password: "Musician789!",
    name: "Musician Munich",
  },
  {
    email: "organizer@cologne.de",
    password: "Organizer123!",
    name: "Organizer Cologne",
  },
  {
    email: "drummer@leipzig.de",
    password: "Drummer456!",
    name: "Drummer Leipzig",
  },
  {
    email: "guitarist@frankfurt.de",
    password: "Guitarist789!",
    name: "Guitarist Frankfurt",
  },
  {
    email: "singer@dresden.de",
    password: "Singer123!",
    name: "Singer Dresden",
  },
  {
    email: "bassist@stuttgart.de",
    password: "Bassist456!",
    name: "Bassist Stuttgart",
  },
  {
    email: "pianist@duesseldorf.de",
    password: "Pianist789!",
    name: "Pianist Düsseldorf",
  },
];

export async function hashMockUsers() {
  return await Promise.all(
    mockUsers.map(async (user) => ({
      email: user.email,
      passwordHash: await argon2.hash(user.password),
      name: user.name,
    })),
  );
}

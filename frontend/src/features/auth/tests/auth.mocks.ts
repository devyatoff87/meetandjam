export const loginMock = {
  success: { email: "maria.kowalska@example.com", password: "Sunset!Jam2026" },
  invalidEmail: {
    email: "maria.kowalska",
    password: "Sunset!Jam2026",
  },
  noPassword: {
    email: "maria.kowalska@example.com",
    password: "",
  },
  noEmail: {
    email: " ",
    password: "Sunset!Jam2026",
  },
};

export const registerMock = {
  success: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "Maria Kowalska",
  },
  noUpperCaseInPassword: {
    email: "maria.kowalska@example.com",
    password: "sunset!jam2026",
    name: "Maria Kowalska",
  },
  noLowerCaseInPassword: {
    email: "maria.kowalska@example.com",
    password: "sunset!jam2026",
    name: "Maria Kowalska",
  },
  noDigitInPassword: {
    email: "maria.kowalska@example.com",
    password: "sunset!jam2026",
    name: "Maria Kowalska",
  },
  noSpecialsInPassword: {
    email: "maria.kowalska@example.com",
    password: "sunset!jam2026",
    name: "Maria Kowalska",
  },
  tooShortPassword: {
    email: "maria.kowalska@example.com",
    password: "sunset!jam2026",
    name: "Maria Kowalska",
  },
  tooLongPassword: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026Sunset!Jam2026Sunset!Jam2026",
    name: "Maria Kowalska",
  },
  tooShortName: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "M",
  },
  tooLongName: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "Maria Kowalska Von Habsburg Und Wittelsbach",
  },
  invalidCharsInName: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "Maria123",
  },
  acceptsNameWithHyphen: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "Maria Kowalska-Smith",
  },
  acceptsNameWithApstr: {
    email: "maria.kowalska@example.com",
    password: "Sunset!Jam2026",
    name: "O'Brien",
  },
};

export const log = (info: [string, unknown]) => {
  console.log(info[0].toUpperCase() + ": ");
  console.log(info[1]);
  console.log("-------------------------------------------------");
};

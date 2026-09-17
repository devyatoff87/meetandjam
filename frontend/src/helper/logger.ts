export const log = (info: [string, any]) => {
  console.log(info[0].toUpperCase() + ": ");
  console.log(info[1]);
  console.log("-------------------------------------------------");
};

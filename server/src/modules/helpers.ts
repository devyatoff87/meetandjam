type SendError = (
  reply: any,
  code: number,
  message: string,
  errors?: any,
) => void;

export const sendError: SendError = (reply, code, message, errors) => {
  const response: any = { message };
  if (errors) {
    response.errors = errors.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  reply.code(code).send(response);
};

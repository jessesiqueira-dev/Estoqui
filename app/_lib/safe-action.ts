import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError: () =>
    "Não foi possível cadastrar o produto. Tente novamente.",
});

import { defineHandler } from "nitro";

export default defineHandler(async () => {
  return { success: true, message: "Déconnexion réussie" };
});
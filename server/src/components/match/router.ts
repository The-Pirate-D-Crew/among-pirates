import PromiseRouter from "express-promise-router";
import routes from "./routes";
export const router = PromiseRouter();

router.post("/", routes.create);
router.post("/:code/join", routes.join);
router.get("/:id/players", routes.getPlayers);
router.post("/:id/start", routes.start);

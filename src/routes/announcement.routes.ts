import { Router } from "express";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcement.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { announcementSchema } from "../validators/announcement.validator";

const router = Router();

router.get("/", getAllAnnouncements);
router.post("/", validateRequest(announcementSchema), createAnnouncement);
router.put("/:id", validateRequest(announcementSchema), updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;

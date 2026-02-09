import express from "express";
import upload from "../middleware/Upload.js";
import BarangController from "../controllers/barangController.js";

const router = express.Router();

router.post("/", upload.array("url_foto", 4), BarangController.create);

router.put(
  "/:id",
  upload.single("foto_pengambil_url"),
  BarangController.update
);

router.put("/:id", upload.array("url_foto", 4), BarangController.update);
router.get("/search", BarangController.searchByName);
router.get("/status/:status", BarangController.getByStatus);
router.get("/:id", BarangController.getById);
router.get("/", BarangController.getAll);
router.delete("/:id", BarangController.delete);


export default router;

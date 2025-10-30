import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cloudscape",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }]
  }
});

const upload = multer({ storage });

// Upload single image
router.post("/", upload.single("file"), async (req, res) => {
  try {
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Error uploading file" });
  }
});

// Delete image
router.delete("/", async (req, res) => {
  const { public_id } = req.body;
  try {
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
});

export default router;

import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.json({ data: "Every day is a Router Day!" });
});

export default router;

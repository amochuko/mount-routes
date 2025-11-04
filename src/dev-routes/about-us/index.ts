import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.json({ data: "About us on this side of the road" });
});

export default router;

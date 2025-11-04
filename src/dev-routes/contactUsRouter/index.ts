import express from "express";

const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.json({ data: "Contact us on our telephone lines: +234 9097 474 8383" });
});

export default router;

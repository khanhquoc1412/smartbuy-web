const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getAddresses,
  getAddress,
  getDefaultAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");

router.use(auth); // ✅ Auth middleware

router.get("/", getAddresses);
router.get("/default", getDefaultAddress);
router.get("/:addressId", getAddress);
router.post("/", addAddress); // ✅ POST handler
router.put("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);
router.patch("/:addressId/default", setDefaultAddress);

module.exports = router;

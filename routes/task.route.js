const express = require("express")
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const { addClient, addTasks, allTasks, editClient, editTask } = require("../controller/user.controller");
const { editProfile, getProfile } = require("../controller/profile.controller");

router.get("/all-tasks", authenticateUser, allTasks)
router.get("/profile",authenticateUser,getProfile)
router.put("/edit-profile",authenticateUser,editProfile)
router.post('/add-client', authenticateUser, addClient);
router.put("/edit-client/:id", authenticateUser, editClient);
router.post("/add-task", authenticateUser, addTasks)
router.put("/edit-task/:id",authenticateUser,editTask);
  
module.exports = router
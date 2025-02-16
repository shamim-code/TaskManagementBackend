const { register, login, forgotPassword, resetPassword, getProfile, updateProfile } = require("./controllers/authController");
const { createTask, getSingleTask, getAllTasks, updateTask, deleteTask } = require("./controllers/taskController");
const authMiddleware = require("./middleware/authMiddleware");

const routes = require("express").Router();

//Auth and users endpoints
routes.post('/auth/register',register);
routes.post('/auth/login',login);
routes.get('/auth/profile',authMiddleware,getProfile);
routes.put('/auth/profile',authMiddleware,updateProfile);
routes.post('/auth/forget-password',forgotPassword);
routes.post('/auth/reset-password',resetPassword);


//Task Management Endpoints
routes.get('/tasks',authMiddleware,getAllTasks);
routes.get('/tasks/:id',authMiddleware,getSingleTask);
routes.post('/tasks',authMiddleware,createTask);
routes.put('/tasks/:id',authMiddleware,updateTask);
routes.delete('/tasks/:id',authMiddleware,deleteTask);

module.exports = routes;
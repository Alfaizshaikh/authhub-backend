const authService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

exports.register = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    
    res.status(201).json(result);
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    res.json(result);
});

exports.profile = catchAsync(async (req, res) => {
    const profile = await authService.getUserProfile(req.user.id);
    
    res.json(profile);
});

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await authService.getAllUsers();
    
    res.json(users);
});

exports.updateUserRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await authService.updateRole(id, req.user.id, role);
    
    res.json(result);
});

exports.deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await authService.deleteUserAccount(id, req.user.id);
    
    res.json(result);
});

exports.changePassword = catchAsync(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const result = await authService.changeUserPassword(
        req.user.id, 
        oldPassword, 
        newPassword, 
        confirmPassword
    );
    
    res.json(result);
});
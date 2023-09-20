const roleModel = require('../models/role.model');


exports.addRole = async (userData, permissions) => {
    try {
        const formattedData = {
            userId: userData.userId,
            roleId: roleId,
            roleName: userData.roleName,
            permissions: permissions,
        }
        const saveData = await roleModel(formattedData);
        return saveData.save() ? true : false;
    } catch (error) {
        return false
    }
}
exports.changeRole = async (roleId, permission) => {
    try {
        const changeRole = await roleModel.findOneAndUpdate({ roleId }, permission);
        return changeRole ? true : false;
    } catch (error) {
        return false;
    }
}
exports.removeRole = async (roleId) => {
    try {
        const changeRole = await roleModel.findOneAndUpdate({ roleId }, { isActive: true });
        return changeRole ? true : false;
    } catch (error) {
        return false;
    }
}
exports.getRole = async (userId) => {
    try {
        const userRole = await roleModel.findOne({ userId });
        return userRole ? userRole : false;
    } catch (error) {
        return false
    }
}

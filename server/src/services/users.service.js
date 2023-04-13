
const getAllUsers = async () => {
    const all = await user.find();
    return all;
};

module.exports = {
    getAllUsers
};
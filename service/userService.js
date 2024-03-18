const UserSchema = require("../schema/UserSchema");
const { NotFoundError, BadRequestError, ForbiddenError, ValidationError } = require("../middleware/Error");

const getUsers = async (data) => {
    const users = await UserSchema.find({}, { "password": 0, "cPassword": 0  });
    if (!users) {
        throw new NotFoundError("Users not found");
    }
    return users;
};

const getOne = async (email) => {
    if (!email) {
        throw new ValidationError("email is required")
    }
    let foundUser = await UserSchema.findOne({ "email": email },{ "password": 0, "cPassword": 0  });
    if (!foundUser) {
        throw new NotFoundError("User not found")
    }
    return foundUser
};

const updateOne = async (id, data) => {
    const update = await UserSchema.findByIdAndUpdate(id, data, {
        new: true,
    });
    if (!update || id === undefined) {
        throw new BadRequestError("Verify user or new update");
    }
    update.updatedAt = new Date();
    await update.save();
    return update;
};

const deleteOne = async (id) => {
    const deletedUser = await UserSchema.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new BadRequestError("User does not exist");
    }
    return deletedUser

};
module.exports = {
    getUsers,
    getOne,
    updateOne,
    deleteOne,
};

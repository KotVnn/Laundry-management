import mongoose, {SchemaTypes} from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	role: {
		type: SchemaTypes.ObjectId,
		required: true,
		ref: "Role"
	},
});

UserSchema.methods.encryptPassword = async (password: string) => {
	return bcrypt.hash(password, bcrypt.genSaltSync(5));
};
UserSchema.methods.validPassword = async function (password: string) {
	return bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
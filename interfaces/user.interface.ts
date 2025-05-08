import {IRole} from "@/interfaces/role.interface";

export interface IUser {
	username: string;
	email: string;
	role: IRole;
}
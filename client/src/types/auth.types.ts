import { IUser } from "./user.types";

export interface ILoginBody {
  email: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string,
  refreshToken: string,
  user: IUser
  message: string,
  status: number
}
export enum LoginType {
  Normal = 'normal',
  Google = 'google',
  Facebook = 'facebook',
}
export interface ILoginOptions {
  type: LoginType;
}
export interface IRegisterBody {
  userName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface INewAccessToken {
  accessToken: string,
  message?: string,
  status?: number
}
export interface Department {
  name: string;
}

export interface Role {
  permission: string[];
  accessLevel: unknown[];
}

export interface IUserInfo {
  id: number;
  email: string;
  skills: unknown[];
  languages: unknown[];
  roles: string[];
  zohoId: string;
  name: string;
  username: string;
  gender: string;
  department: Department;
  role: Role;
  totalHours: number;
  totalProjects: number;
  totalRunningProject: number;
  workingHistory: unknown[];
}

export interface IMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  offset: number;
}

export interface IPagination {
  page?: number;
  take?: number;
  offset?: number;
  searching?: string;
}

export interface IMembershipTier {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: string;
  name: string;
  monthlyPrice?: number | null;
  tierDescription: string;
}

export interface IAthleteProfile {
  id: string;
  sport: string;
  sourceSubscriptionsTotal?: number;
  fullName: string;
  fan?: number;
  avatar: string;
  totalFan: number;
  totalInteractions: number;
  nickName: string;
  isCurrentUserSubscribed: boolean;
  membershipTier?: IMembershipTier;
}
'use server'
import crypto from 'crypto'
import { FindOneAndUpdateResponse, AddDocResponse, NewUser, User, OnboardingAnswers } from "@/app/types";
import { hashPassword } from '@/app/lib/server/cryptography';
import { getDoc } from '@/app/lib/server/mongo/get';
import { addDoc } from '@/app/lib/server/mongo/add';
import UserModel from '@/app/models/user';
import dbConnect from './db';
import { findOneAndUpdateDoc } from '../mongo/update';
import { FREE_CREDITS, SERVICE_NAME } from '@/app/constants/global';
import { addUsage } from './usage';

export async function getUser(email: string): Promise<User | null> {
  try {
    await dbConnect();
    const result =  await getDoc<User>(UserModel, {email})
    if(!result.success || !result.data) throw new Error(result.message);
    const user = result.data;
    // console.log(user)
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
   return null
  }
}

export async function signUp(newUser: NewUser): Promise<AddDocResponse> {
  await dbConnect();
  const {password, ...userInfo} = newUser;
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(password, salt)
  const user: Omit<User, 'id'> = {...userInfo, hashedPassword, salt, credits: FREE_CREDITS}; // every user gets 3 free credits
  return addDoc<Omit<User, 'id'>>(UserModel, user);
}

export async function updatePassword(email: string, newPassword: string): Promise<FindOneAndUpdateResponse<User>> {
  await dbConnect();
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedPassword = hashPassword(newPassword, salt)
  return findOneAndUpdateDoc(UserModel, {email}, {hashedPassword, salt});
}

export async function isValidUser(email: string): Promise<boolean> {
  try {
    await dbConnect();
    const user = await UserModel.findOne({email})
    return !!user;
  } catch (error: any) {
    console.error('Error checking user: ', error?.message)
    return false
  }
}
  
export async function updateCredits(email: string, creditDelta: number): Promise<number> {
  await dbConnect();

  const filter: Record<string, any> = { email };
  if (creditDelta < 0) {
    filter.credits = { $gte: Math.abs(creditDelta) }; // Prevent negative balance
  }

  const result = await findOneAndUpdateDoc<User>(
    UserModel,
    filter,
    { $inc: { credits: creditDelta } }
  );

  if(!result.success) throw new Error(result.message);

  await addUsage(email, SERVICE_NAME);

  return result.updatedDoc?.credits!;
}


export async function completedOnboarding(email: string, answers:OnboardingAnswers): Promise<FindOneAndUpdateResponse<User>> {
  await dbConnect()
    const filter = { email };
    const update = {
      'metadata.answers': answers,
      'metadata.hasCompletedOnboarding': true,
    };
  
    return await findOneAndUpdateDoc<User>(UserModel, filter, update);
  }
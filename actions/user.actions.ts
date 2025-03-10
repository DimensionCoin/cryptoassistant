"use server";

import User from "@/models/user.model";
import { connect } from "@/db";

export async function createUser(user: any) {
  try {
    await connect();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
    throw new Error("Error creating user");
  }
}

export async function getUser(userId: string) {
  try {
    await connect();
    const user = await User.findOne({
      clerkId: userId,
    });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}

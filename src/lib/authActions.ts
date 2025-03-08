import { getUserByUsername } from "@/models/userModel";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { TokenContent } from "@/types/DBTypes";
import CustomError from "@/classes/CustomError";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  // Verify credentials && get the user

  if (!process.env.JWT_SECRET) {
    throw new CustomError("JWT secret not set", 500);
  }

  const key = process.env.JWT_SECRET;

  const userLogin = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };
  if (!userLogin.username || !userLogin.password) {
    throw new CustomError("Empty fields", 400);
  }
  const user = await getUserByUsername(userLogin.username);

  if (!user) {
    throw new CustomError("Incorrect username/password", 403);
  }

  const tokenContent: TokenContent = {
    user_id: user.user_id,
    level_name: user.level_name,
  };
  // Create the session
  const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  const session = jwt.sign(tokenContent, key, {
    expiresIn: "7d",
  });

  // Save the session in a cookiev
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  if (!process.env.JWT_SECRET) {
    throw new CustomError("JWT secret not set", 500);
  }
  const key = process.env.JWT_SECRET as string;
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return jwt.verify(session, key) as TokenContent;
}

export async function updateSession(request: NextRequest) {
  if (!process.env.JWT_SECRET) {
    throw new CustomError("JWT secret not set", 500);
  }
  const key = process.env.JWT_SECRET as string;
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const tokenContent = jwt.verify(session, key) as TokenContent;
  const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: jwt.sign(tokenContent, key, { expiresIn: "7d" }),
    httpOnly: true,
    expires: expires,
  });
  return res;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user_id) {
    redirect("/login");
  }
}

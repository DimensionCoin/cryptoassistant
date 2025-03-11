// app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser } from "@/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is missing in env vars.");
    throw new Error("WEBHOOK_SECRET missing");
  }

  // Await headers() because it returns a Promise<ReadonlyHeaders>
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing Svix headers", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return NextResponse.json(
      { error: "Missing Svix headers." },
      { status: 400 }
    );
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  const eventType = evt.type;
  console.log("Received webhook event:", eventType);

  if (eventType === "user.created") {
    const userData = evt.data;
    const email = userData.email_addresses?.[0]?.email_address;
    if (!email) {
      console.error("Email not provided in webhook payload", userData);
      return NextResponse.json(
        { error: "Email not provided." },
        { status: 400 }
      );
    }

    const user = {
      clerkId: userData.id,
      email,
      subscriptionTier: "free",
      customerId: "",
      createdAt: new Date(userData.created_at),
    };

    console.log("Attempting to create user in DB:", user);
    let newUser;
    try {
      newUser = await createUser(user);
    } catch (dbError) {
      console.error("Error creating user in DB:", dbError);
      return NextResponse.json(
        { error: "Database error while creating user." },
        { status: 500 }
      );
    }

    console.log("New MongoDB user:", newUser);

    if (newUser) {
      try {
        // Get the actual Clerk client and update user metadata
        const clerk = await clerkClient();
        await clerk.users.updateUser(userData.id, {
          publicMetadata: { userId: newUser._id },
        });
        console.log("Updated Clerk user metadata with DB user ID.");
      } catch (clerkError) {
        console.error("Error updating Clerk user metadata:", clerkError);
      }
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  }

  return NextResponse.json(
    { message: "Unhandled event type." },
    { status: 200 }
  );
}

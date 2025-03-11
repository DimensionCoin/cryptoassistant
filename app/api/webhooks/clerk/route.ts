// app/api/webhooks/clerk/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser } from "@/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("WEBHOOK_SECRET missing from environment variables.");
  }

  // Use await since headers() returns a promise.
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
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

  if (eventType === "user.created") {
    const userData = evt.data;
    const email = userData.email_addresses?.[0]?.email_address;
    if (!email) {
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

    console.log("Creating user:", user);
    const newUser = await createUser(user);
    console.log("New MongoDB user:", newUser);

    if (newUser) {
      // Await the clerk client then access its users property.
      const clerk = await clerkClient();
      await clerk.users.updateUser(userData.id, {
        publicMetadata: { userId: newUser._id },
      });
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  }

  return NextResponse.json(
    { message: "Unhandled event type." },
    { status: 200 }
  );
}

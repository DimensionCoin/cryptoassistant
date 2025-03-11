"use client";
import { useUser } from "@clerk/nextjs";
import { useUserContext } from "@/providers/UserProvider";
import Link from "next/link";

const AccountPage = () => {
  const { user, isLoaded } = useUser();
  const { tier, createdAt } = useUserContext();

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <p className="text-zinc-300">Loading account information...</p>
      </div>
    );
  }

  // Helper function to compute membership duration
  const getMembershipDuration = (): string => {
    if (!createdAt) return "Unknown";
    const created = new Date(createdAt);
    const now = new Date();

    let years = now.getFullYear() - created.getFullYear();
    let months = now.getMonth() - created.getMonth();

    // Adjust if the current day is earlier than the created day
    if (now.getDate() < created.getDate()) {
      months -= 1;
    }
    // Adjust years and months if necessary
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
    const monthStr =
      months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";
    const duration = [yearStr, monthStr].filter(Boolean).join(", ");
    return duration || "Less than a month";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-950 border border-zinc-800 rounded-lg shadow-lg my-8">
      <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-500">
        Account Details
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p className="mb-1">
            <span className="font-medium">Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p className="mb-1">
            <span className="font-medium">Email:</span>{" "}
            {user.emailAddresses[0]?.emailAddress}
          </p>
          {/* Add more personal fields if needed */}
        </section>
        {/* Subscription & Membership */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Subscription</h2>
          <p className="mb-1">
            <span className="font-medium">Tier:</span> {tier}
          </p>
          <h2 className="text-xl font-semibold mt-4 mb-2">Membership</h2>
          <p className="mb-1">
            <span className="font-medium">Member for:</span>{" "}
            {getMembershipDuration()}
          </p>
        </section>
      </div>
      <div className="mt-8">
        <Link
          href="/account/settings"
          className="inline-block px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors duration-200"
        >
          Update Account Settings
        </Link>
      </div>
    </div>
  );
};

export default AccountPage;

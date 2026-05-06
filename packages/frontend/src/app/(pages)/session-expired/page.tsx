import { Metadata } from "next";
import { SessionExpiredContent } from "./content";

export const metadata: Metadata = {
  title: "Session Expired | SwitchYard Capital",
  description: "Your session has expired. Please log in again to continue.",
};

export default function SessionExpiredPage() {
  return <SessionExpiredContent />;
}

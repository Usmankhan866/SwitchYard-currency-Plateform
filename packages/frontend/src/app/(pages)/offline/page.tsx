import { Metadata } from "next";
import { OfflineContent } from "./content";

export const metadata: Metadata = {
  title: "Offline | SwitchYard Capital",
  description: "You've lost your internet connection. Check your network and try again.",
};

export default function OfflinePage() {
  return <OfflineContent />;
}

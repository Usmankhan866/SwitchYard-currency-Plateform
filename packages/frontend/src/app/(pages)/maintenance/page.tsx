import { Metadata } from "next";
import { MaintenanceContent } from "./content";

export const metadata: Metadata = {
  title: "Under Maintenance | SwitchYard Capital",
  description: "We're performing scheduled maintenance to improve your experience.",
};

export default function MaintenancePage() {
  return <MaintenanceContent />;
}

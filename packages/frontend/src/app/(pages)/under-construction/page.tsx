import { Metadata } from "next";
import { UnderConstructionContent } from "./content";

export const metadata: Metadata = {
  title: "Under Construction | SwitchYard Capital",
  description: "We're building something new. Check back soon for updates.",
};

export default function UnderConstructionPage() {
  return <UnderConstructionContent />;
}

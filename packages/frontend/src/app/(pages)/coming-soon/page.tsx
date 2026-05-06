import { Metadata } from "next";
import { ComingSoonContent } from "./content";

export const metadata: Metadata = {
  title: "Coming Soon | SwitchYard Capital",
  description: "We're working on something exciting. Stay tuned!",
};

export default function ComingSoonPage() {
  return <ComingSoonContent />;
}

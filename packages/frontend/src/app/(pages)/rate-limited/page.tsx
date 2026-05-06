import { Metadata } from "next";
import { RateLimitedContent } from "./content";

export const metadata: Metadata = {
  title: "Rate Limited | SwitchYard Capital",
  description: "You've made too many requests. Please wait before trying again.",
};

export default function RateLimitedPage() {
  return <RateLimitedContent />;
}

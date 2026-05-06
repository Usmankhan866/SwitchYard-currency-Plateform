import { Metadata } from "next";
import { Error404Content } from "./content";

export const metadata: Metadata = {
  title: "404 — Page Not Found | SwitchYard Capital",
  description: "The page you're looking for doesn't exist.",
};

export default function Error404Page() {
  return <Error404Content />;
}

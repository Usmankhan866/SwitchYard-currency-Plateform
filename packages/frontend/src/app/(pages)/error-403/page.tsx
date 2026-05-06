import { Metadata } from "next";
import { Error403Content } from "./content";

export const metadata: Metadata = {
  title: "403 — Access Denied | SwitchYard Capital",
  description: "You don't have permission to access this page.",
};

export default function Error403Page() {
  return <Error403Content />;
}

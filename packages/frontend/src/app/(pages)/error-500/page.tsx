import { Metadata } from "next";
import { Error500Content } from "./content";

export const metadata: Metadata = {
  title: "500 — Internal Server Error | SwitchYard Capital",
  description: "Something went wrong on our end.",
};

export default function Error500Page() {
  return <Error500Content />;
}

import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Hypsoul team. Questions, feedback, collaborations — we're listening.",
};

export default function ContactPage() {
  return <ContactClient />;
}

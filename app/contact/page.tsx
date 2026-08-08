import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { ContactForm } from "./contact-form";

export const metadata = publicMetadata({
  title: "Contact",
  description: "Contact Growth Central Events.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactForm />;
}

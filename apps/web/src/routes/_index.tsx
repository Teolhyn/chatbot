import type { Route } from "./+types/_index";
import Chatbox from "@/components/chatbox";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "chatbot" },
    { name: "description", content: "chatbot is a web application" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <Chatbox />
      </div>
    </div>
  );
}

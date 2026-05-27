import { AppShell } from "@/src/app-shell";

export default function HomeRoute() {
  return <AppShell session={{ status: "signed-out" }} />;
}

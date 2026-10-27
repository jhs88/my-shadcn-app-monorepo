import { redirect } from "react-router";

// Preserve the former example URL while retiring its missing database table.
export function loader() {
  return redirect("/projects");
}

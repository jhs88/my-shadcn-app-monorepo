import { Theme, useTheme } from "remix-themes";
import { useEffect } from "react";

export default function Index() {
  const [theme, setTheme, { definedBy }] = useTheme();

  useEffect(() => {
    console.log({ theme, definedBy });
  }, [definedBy, theme]);

  return (
    <main className="container mx-auto min-h-screen w-full overflow-hidden">
      <h1>Welcome to React Router</h1>
      <div className="mx-5 my-0">
        <label className="flex gap-1">
          Theme
          <select
            name="theme"
            value={definedBy === "SYSTEM" ? "" : (theme ?? "")}
            onChange={(e) => {
              const nextTheme = e.target.value;

              if (nextTheme === "") {
                setTheme(null);
              } else {
                setTheme(nextTheme as Theme);
              }
            }}
          >
            <option value="">System</option>
            <option value={Theme.LIGHT}>Light</option>
            <option value={Theme.DARK}>Dark</option>
          </select>
        </label>
      </div>
      <a href="/about">About</a>
    </main>
  );
}

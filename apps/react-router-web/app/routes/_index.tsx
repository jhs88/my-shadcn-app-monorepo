import { Button } from "@repo/ui/components/button";

export default function Index() {
  return (
    <main className="flex flex-col items-center justify-center gap-2 pt-16 pb-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Title
      </h1>
      <br />
      <Button>Test</Button>
      <p className="text-gray-600 dark:text-gray-200 mt-4">
        Built With <a href="https://turbo.build/repo">Turborepo</a>
        {" & "}
        <a href="https://reactrouter.com/home">React Router</a>
      </p>
    </main>
  );
}

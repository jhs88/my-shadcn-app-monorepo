import { Button } from "@repo/ui/components/button";

export default function Index() {
  return (
    <div className="container">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Title
      </h1>
      <br />
      <Button>Test</Button>
      <p className="description">
        Built With <a href="https://turbo.build/repo">Turborepo</a>
        {" & "}
        <a href="https://reactrouter.com/home">React Router</a>
      </p>
    </div>
  );
}

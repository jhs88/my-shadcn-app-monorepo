import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, Folder } from "lucide-react";
import { Link } from "react-router";

export default function Welcome() {
  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-10">
      <header className="flex items-center justify-between border-b pb-6">
        <Link to="/" className="flex items-center gap-2 font-medium">
          <Folder className="size-5" />
          Project starter
        </Link>
        <Link
          to="/login"
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          Sign in
        </Link>
      </header>
      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="text-muted-foreground mb-5 font-mono text-xs tracking-widest uppercase">
          A small place to start
        </p>
        <h1 className="max-w-3xl text-5xl leading-tight font-semibold tracking-tight sm:text-7xl">
          Give your next
          <br />
          idea a home.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-md text-lg leading-relaxed">
          Create a project, keep a few notes, and make it yours. Your workspace
          stays private.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            role="link"
            render={
              <Link to="/projects">
                Open your projects
                <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <Button
            variant="outline"
            nativeButton={false}
            role="link"
            render={<Link to="/sign-up">Create an account</Link>}
          />
        </div>
      </section>
      <footer className="text-muted-foreground flex gap-6 border-t py-6 text-sm">
        <Link to="/gallery" className="hover:text-foreground">
          Component gallery
        </Link>
        <Link to="/test" className="hover:text-foreground">
          Account example
        </Link>
      </footer>
    </main>
  );
}

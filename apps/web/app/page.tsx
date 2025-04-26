"use client";

import { Button } from "@repo/ui/components/button";
import { Typography } from "@repo/ui/components/typography";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setResponse(null);
    setError(undefined);
  }, [name]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetch(`${API_HOST}/message/${name}`);
      const response = await result.json();
      setResponse(response);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch response");
    }
  };

  const onReset = () => {
    setName("");
  };

  return (
    <main className="container mx-auto w-full overflow-hidden bg-background text-foreground px-4 py-8">
      <Typography variant="h1">Web</Typography>
      <form onSubmit={onSubmit} className="center w-full max-w-2xl py-4">
        <label htmlFor="name">Name </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onChange}
        ></input>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
      {error && (
        <div className="flex flex-col gap-y-2 max-w-min">
          <Typography variant="h3">Error</Typography>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div className="flex flex-col gap-y-2 max-w-min">
          <Typography variant="h3">Greeting</Typography>
          <p>{response.message}</p>
          <Button onClick={onReset}>Reset</Button>
        </div>
      )}
    </main>
  );
}

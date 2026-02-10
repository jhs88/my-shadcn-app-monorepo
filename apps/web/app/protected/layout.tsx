import Navbar from "@/components/navbar";

export default function Layout({ children }: LayoutProps<"/test">) {
  return (
    <main className="container mx-auto min-h-screen w-full">
      <Navbar />
      {children}
    </main>
  );
}

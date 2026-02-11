import Navbar from "@/components/navbar";

export default function Layout({ children }: LayoutProps<"/test">) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto w-full overflow-hidden py-4">
        {children}
      </main>
    </>
  );
}

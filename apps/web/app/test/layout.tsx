import PageContainer from "@/components/layout/page-container";
import Navbar from "@/components/navbar";

export default function Layout({ children }: LayoutProps<"/test">) {
  return (
    <PageContainer>
      <Navbar />
      {children}
    </PageContainer>
  );
}

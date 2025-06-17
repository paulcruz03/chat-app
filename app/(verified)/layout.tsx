import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"
import { Header } from "@/components/header";

export default function VerifiedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset"  />
      <SidebarInset>
      <Header />
      <main>
          {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
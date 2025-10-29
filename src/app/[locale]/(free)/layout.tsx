import Navbar from "@/components/layout/navbar/navbar";
import Footer from "@/components/layout/footer/footer";
import { Toaster } from "sonner";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      {children}
      <Footer locale={locale} />
      <Toaster richColors position="top-center" theme="light" duration={3000} />
    </div>
  );
}

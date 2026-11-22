import Header from "@/components/public/header/Header";
import Footer from "@/components/public/footer/Footer";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
};
export default PublicLayout;

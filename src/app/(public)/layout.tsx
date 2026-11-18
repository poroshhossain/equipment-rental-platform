import Header from "@/components/public/header/Header"

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      footer
    </>
  )
}
export default PublicLayout
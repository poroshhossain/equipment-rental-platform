import RoleGuard from "@/components/auth/RoleGuard";

/** Every page in the (admin) group requires the admin role. */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="admin">{children}</RoleGuard>;
};

export default AdminLayout;

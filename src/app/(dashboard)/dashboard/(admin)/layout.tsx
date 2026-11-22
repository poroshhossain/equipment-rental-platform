import RoleGuard from "@/components/auth/RoleGuard";

// RoleGuard hides {children} until the session resolves, so this guarded
// segment is opted out of instant-navigation validation.
export const instant = false;

/** Every page in the (admin) group requires the admin role. */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="admin">{children}</RoleGuard>;
};

export default AdminLayout;

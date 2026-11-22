import RoleGuard from "@/components/auth/RoleGuard";

// RoleGuard hides {children} until the session resolves, so this guarded
// segment is opted out of instant-navigation validation.
export const instant = false;

/** Every page in the (owner) group requires the owner role. */
const OwnerLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="owner">{children}</RoleGuard>;
};

export default OwnerLayout;

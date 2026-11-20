import RoleGuard from "@/components/auth/RoleGuard";

/** Every page in the (owner) group requires the owner role. */
const OwnerLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="owner">{children}</RoleGuard>;
};

export default OwnerLayout;

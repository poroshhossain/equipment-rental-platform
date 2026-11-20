import RoleGuard from "@/components/auth/RoleGuard";

/** Every page in the (customer) group requires the customer role. */
const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="customer">{children}</RoleGuard>;
};

export default CustomerLayout;

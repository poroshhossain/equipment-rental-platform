import RoleGuard from "@/components/auth/RoleGuard";

// RoleGuard is a client component that replaces {children} with a loading state
// until the session resolves, so this segment is intentionally kept out of
// instant-navigation validation (child pages are still validated).
export const instant = false;

/** Every page in the (customer) group requires the customer role. */
const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard role="customer">{children}</RoleGuard>;
};

export default CustomerLayout;

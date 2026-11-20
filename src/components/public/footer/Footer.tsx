import Link from "next/link";

import Logo from "@/components/public/header/Logo";

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Rent the equipment you need, from verified owners, at transparent
            prices — for a day, a week or a month.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/equipments" className="hover:text-foreground">All equipment</Link></li>
            <li><Link href="/#how-it-works" className="hover:text-foreground">How it works</Link></li>
            <li><Link href="/#why-choose-us" className="hover:text-foreground">Why choose us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Account</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Create an account</Link></li>
            <li><Link href="/dashboard/favorites" className="hover:text-foreground">My favorites</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © EquipRent. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

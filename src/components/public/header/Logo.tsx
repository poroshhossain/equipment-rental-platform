import { Boxes } from "lucide-react"
import Link from "next/link"

const Logo = () => {
    return (
        <>
            <Link href="/" className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
                    <Boxes className="size-5" />
                </span>
                <span className="font-heading text-lg font-bold">
                    Equip<span className="text-brand">Rent</span>
                </span>
            </Link>
        </>
    )
}
export default Logo
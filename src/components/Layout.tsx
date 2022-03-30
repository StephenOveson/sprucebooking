import Image from "next/image";
import Link from "next/link";
import logo from './logo/logo.svg'

export default function Header() {

    return <header className="flex flex-row bg-white h-12 w-100 px-2 py-1">
        <Link href="/" passHref={true}>
            <a className="flex hover:cursor-pointer">
                <Logo />
            </a>
        </Link>
    </header>
} 

export const Logo:React.FC<{ className?: string }> = ({ className }) => {
    return <Image src={logo} width="130" className={className} />
}
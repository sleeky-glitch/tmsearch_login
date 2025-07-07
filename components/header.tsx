import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left: DPIIT Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/images/dpiit-logo.png"
              alt="Department for Promotion of Industry and Internal Trade"
              width={180}
              height={80}
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Center: Title */}
          <div className="text-center mx-4 hidden md:block">
            <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700">
              AI Powered Trademark Search
            </Link>
          </div>

          {/* Right: Make in India and IP India Logos */}
          <div className="flex items-center gap-4">
            <Image
              src="/images/make-in-india-logo.png"
              alt="Make in India"
              width={100}
              height={40}
              className="h-12 w-auto object-contain"
            />
            <Image
              src="/images/ip-india-logo.png"
              alt="Intellectual Property India"
              width={150}
              height={60}
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        {/* Mobile title - only shown on small screens */}
        <div className="mt-2 text-center md:hidden">
          <Link href="/" className="text-lg font-bold text-primary-600 hover:text-primary-700">
            AI Powered Trademark Search
          </Link>
        </div>
      </div>
    </header>
  )
}

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] font-bold"
        >
          Andrie Wijaya
        </Link>
        <div className="flex gap-8">
          {[
            { name: "About", href: "/#ringkasan" },
            { name: "Projects", href: "/projects" },
            { name: "Writing", href: "/writing" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs uppercase tracking-widest font-semibold text-gray-600 hover:text-black transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

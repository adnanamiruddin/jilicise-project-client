import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex justify-between items-center bg-gray-900 py-3 px-7 overflow-x-hidden">
      <div className="flex gap-5 items-center md:gap-7">
        <Image
          src="/jili-welcome.png"
          alt="Jili"
          width={500}
          height={500}
          className="w-12 h-12"
        />

        <p className="text-gray-500 text-sm">Copyright © 2024 Jilicise.</p>
      </div>
    </div>
  );
}

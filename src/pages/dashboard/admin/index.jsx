import { useState } from "react";
import ProtectedPage from "@/components/utils/ProtectedPage";
import JiliciseRoomHome from "@/components/layouts/JiliciseRoomHome";
import JiliciseRoomHistory from "@/components/layouts/JiliciseRoomHistory";
import { FaRegListAlt, FaHistory } from "react-icons/fa";
import Image from "next/image";

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <ProtectedPage>
      <div className="mt-2 md:mx-16 md:mt-10">
        <h1 className="text-2xl font-bold flex">
          Aktivitas Bersama Jili
          <Image
            src="/jili-welcome.png"
            alt="Jili"
            width={500}
            height={500}
            className="w-10 ms-3"
          />
        </h1>

        <div className="mt-3 flex items-center">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-1/2 p-3 flex justify-center items-center gap-3 border-b-[3px] ${
              activeTab === "home" ? "border-sky-500" : ""
            }`}
          >
            Pertandingan <FaRegListAlt className="text-lg" />
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`w-1/2 p-3 flex justify-center items-center gap-3 border-b-[3px] ${
              activeTab === "history" ? "border-sky-500" : ""
            }`}
          >
            Riwayat <FaHistory className="text-lg" />
          </button>
        </div>

        <div className="mt-5 px-3">
          {activeTab === "home" ? (
            <JiliciseRoomHome />
          ) : (
            <JiliciseRoomHistory />
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}

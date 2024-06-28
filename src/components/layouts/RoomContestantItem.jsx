import Image from "next/image";

export default function RoomContestantItem({ contestant }) {
  return (
    <div className="bg-gradient-to-br from-sky-400 to-sky-700 px-1 py-1 border-2 border-sky-500 rounded-lg flex items-center">
      <Image
        src={contestant.avatarURL}
        alt={contestant.firstName}
        width={500}
        height={500}
        className="w-14"
      />

      <h3 className="font-serif font-semibold text-base ms-2 text-white overflow-hidden truncate">
        {contestant.firstName + " " + contestant.lastName}
      </h3>
    </div>
  );
}

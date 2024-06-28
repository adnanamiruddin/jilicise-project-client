import Image from "next/image";
import Input from "./functions/Input";

export default function HandPoseTypeItem({
  handPoseType,
  handleDurationChange,
  onRemoveHandPoseType,
  disableDurationInput,
}) {
  return (
    <div
      key={handPoseType.id}
      className="relative bg-white px-4 pt-2 pb-6 w-full rounded-lg border-2 border-blue-400"
    >
      <button
        type="button"
        onClick={onRemoveHandPoseType}
        className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0.5"
      >
        X
      </button>
      <h4 className="text-start text-lg font-bold">{handPoseType.name}</h4>
      <div className="flex items-center gap-4 flex-wrap my-2">
        {handPoseType.handPoses.map((pose) => (
          <div key={pose.id} className="border-2 border-teal-400 rounded-lg">
            <Image
              src={pose.imageURL}
              alt={pose.name}
              width={500}
              height={500}
              className="w-28 h-20 object-cover rounded"
            />
          </div>
        ))}
      </div>
      <Input
        label="Durasi dalam detik (minimal 60 detik)"
        disabled={disableDurationInput}
        name="duration"
        type="number"
        placeholder="Durasi pose tangan"
        onChange={(e) => handleDurationChange(handPoseType.id, e.target.value)}
        value={handPoseType.duration}
      />
    </div>
  );
}

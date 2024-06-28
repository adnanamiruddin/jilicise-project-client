import { useEffect, useState } from "react";
import handPosesApi from "@/api/modules/handPoses.api";
import { toast } from "react-toastify";
import { runPredictionOfHandGesture } from "@/js/predictionOfHandGesture";
import { config, initCamera, main } from "@/js/handDetection";
import Image from "next/image";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/router";
import Link from "next/link";

import "@tensorflow/tfjs-backend-webgl";

export default function TestingRoom() {
  const router = useRouter();
  const { id } = router.query;

  const [score, setScore] = useState(0);

  const [userHandGesture, setUserHandGesture] = useState({
    result1: "",
    result2: "",
  });
  const [userHandedness, setUserHandedness] = useState("");

  const [handPoses, setHandPoses] = useState([]);
  const [activeHandPose, setActiveHandPose] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get hand poses images
  useEffect(() => {
    const fetchHandPoses = async () => {
      const { response, error } = await handPosesApi.getHandPosesByRoomId({
        roomId: "EwHzY65snIpba8DLJiRW",
      });
      if (response) {
        const data = [...response[0].handPoses, response[0].handPoses[1]];
        setHandPoses(data);
        setActiveHandPose(data[0]);
      }
      if (error) toast.error(error.message);
    };

    const runVideo = async () => {
      const video = await initCamera(
        config.video.width,
        config.video.height,
        config.video.fps
      );
      video.play();
      video.addEventListener("loadeddata", (event) => {
        main(setUserHandedness);
      });

      const canvas = document.querySelector("#hand-pose-canvas");
      if (canvas) {
        canvas.width = config.video.width;
        canvas.height = config.video.height;
      }
    };

    fetchHandPoses();
    runVideo();
  }, []);

  // Run hand gesture prediction
  useEffect(() => {
    runPredictionOfHandGesture(setUserHandGesture);

    const runHandPosesValidation = () => {
      const left =
        userHandedness[0] === "Left" || userHandedness[1] === "Left"
          ? "Right"
          : "";
      const right =
        userHandedness[0] === "Right" || userHandedness[1] === "Right"
          ? "Left"
          : "";

      const result1 = `${left}_${userHandGesture.result1}`;
      const result2 = `${right}_${userHandGesture.result2}`;

      if (
        (activeHandPose.leftHand === result1 ||
          activeHandPose.leftHand === result2) &&
        (activeHandPose.rightHand === result1 ||
          activeHandPose.rightHand === result2)
      ) {
        // Increase user's score HERE
        setScore((prev) => prev + 1);
        const nextIndex = currentIndex + 1;
        if (nextIndex < handPoses.length) {
          setCurrentIndex(nextIndex);
          setActiveHandPose(handPoses[nextIndex]);
        } else {
          setCurrentIndex(0);
          setActiveHandPose(handPoses[0]);
        }
      }
    };

    if (activeHandPose && userHandedness.length > 1) runHandPosesValidation();
  }, [userHandedness]);

  return (
    <div className="relative">
      <Link
        href={`/room/${id}`}
        className="absolute top-0 left-0 btn btn-sm btn-info text-white"
      >
        <IoMdArrowRoundBack className="text-lg" />
      </Link>

      <h1 className="text-3xl text-center font-bold">Testing Room</h1>

      {activeHandPose ? (
        <Image
          src={activeHandPose?.imageURL}
          alt={activeHandPose?.name}
          width={500}
          height={500}
          className="mt-4 w-full rounded max-h-48 object-cover"
        />
      ) : null}

      <p className="mt-4 text-xl text-center font-semibold">Skor {score}</p>

      <div className="mt-4 w-full max-h-48">
        <video id="hand-pose-video" playsInline></video>
        <canvas id="hand-pose-canvas" className="hidden"></canvas>
        <div id="hand-pose-result-left" className="hidden"></div>
        <br />
        <div id="hand-pose-result-right" className="hidden"></div>
      </div>

      <div className="mt-20">
        <p className="text-center">Result: {userHandGesture.result1}</p>
        <p className="text-center">Result: {userHandGesture.result2}</p>
      </div>
    </div>
  );
}

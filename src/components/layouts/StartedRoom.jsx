import { useEffect, useState } from "react";
import handPosesApi from "@/api/modules/handPoses.api";
import { toast } from "react-toastify";
import { runPredictionOfHandGesture } from "@/js/predictionOfHandGesture";
import { config, initCamera, main } from "@/js/handDetection";
import Image from "next/image";
import ProtectedPage from "../utils/ProtectedPage";
import GlobalLoading from "./globals/GlobalLoading";
import roomsApi from "@/api/modules/rooms.api";
import CountdownTimer from "./CountdownTimer";

import "@tensorflow/tfjs-backend-webgl";

export default function StartedRoom({ id }) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isCameraLoaded, setIsCameraLoaded] = useState(false);

  const [room, setRoom] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [score, setScore] = useState(0);

  // User's hand gesture
  const [userHandGesture, setUserHandGesture] = useState({
    result1: "",
    result2: "",
  });
  const [userHandedness, setUserHandedness] = useState("");

  // Room's hand poses round
  const [roomTypeOfHandPoses, setRoomTypeOfHandPoses] = useState([]);
  const [round, setRound] = useState(null);
  const [activeHandPose, setActiveHandPose] = useState(null);
  const [currentIndexHandPose, setCurrentIndexHandPose] = useState(0);

  // Fetch room and hand poses data
  useEffect(() => {
    const fetchHandPoses = async () => {
      const { response, error } = await handPosesApi.getHandPosesByRoomId({
        roomId: id,
      });
      if (response) {
        setRoomTypeOfHandPoses(response);
        setRound(response[0]);
        setActiveHandPose(response[0].handPoses[0]);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error(error.message);
    };
    //
    const fetchRoom = async () => {
      const { response, error } = await roomsApi.getRoomById({ roomId: id });
      if (response) {
        setRoom(response);
        fetchHandPoses();
      }
      if (error) toast.error(error.message);
    };
    //
    if (id) fetchRoom();
  }, [id]);

  // Run video and hand detection
  useEffect(() => {
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
    //
    if (isDataLoaded) {
      setTimeout(() => {
        runVideo();
        setTimeout(() => {
          setIsCameraLoaded(true);
        }, 100);
      }, 1000);
    }
  }, [isDataLoaded]);

  // Run prediction of hand gesture
  useEffect(() => {
    if (isCameraLoaded) runPredictionOfHandGesture(setUserHandGesture);
  }, [userHandedness, isCameraLoaded]);

  // Run hand poses validation
  useEffect(() => {
    const runHandPosesValidation = () => {
      const left =
        userHandedness[0] === "Left" || userHandedness[1] === "Left"
          ? "Right"
          : "";
      const right =
        userHandedness[0] === "Right" || userHandedness[1] === "Right"
          ? "Left"
          : "";
      //
      const result1 = `${left}_${userHandGesture.result1}`;
      const result2 = `${right}_${userHandGesture.result2}`;
      //
      if (
        (activeHandPose.leftHand === result1 ||
          activeHandPose.leftHand === result2) &&
        (activeHandPose.rightHand === result1 ||
          activeHandPose.rightHand === result2)
      ) {
        // Increase contestant's score
        setTotalScore((prev) => prev + 1);
        setScore((prev) => prev + 1);
        const nextIndex = currentIndexHandPose + 1;
        if (nextIndex < round.handPoses.length) {
          setCurrentIndexHandPose(nextIndex);
          setActiveHandPose(round.handPoses[nextIndex]);
        } else {
          setCurrentIndexHandPose(0);
          setActiveHandPose(round.handPoses[0]);
        }
      }
    };
    //
    if (activeHandPose && userHandedness.length > 1) runHandPosesValidation();
  }, [userHandedness]);

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <>
          <div className="flex justify-center">
            <h1 className="py-3.5 px-10 bg-gradient-to-br from-sky-400 to-sky-700 text-white font-semibold text-lg rounded-lg shadow-lg border-[3px] border-sky-300 hover:bg-sky-400 hover:border-sky-100">
              {room.name}
            </h1>
          </div>
          <span className="divider my-1"></span>

          <div className="flex justify-between items-center px-3">
            <h2 className="w-1/2 font-bold text-3xl">
              Ronde {roomTypeOfHandPoses.indexOf(round) + 1}
            </h2>
            {/*  */}
            <div className="w-1/2 border-s-2 border-gray-400">
              <h3 className="py-1.5 text-2xl font-bold text-gray-700 text-center">
                <CountdownTimer initialSeconds={round.duration} />
              </h3>
              {/*  */}
              <h3 className="py-1.5 text-xl border-t-2 border-gray-400 text-center">
                Total Skor: {totalScore}
              </h3>
            </div>
          </div>

          <Image
            src={activeHandPose.imageURL}
            alt={activeHandPose.name}
            width={500}
            height={500}
            className="mt-4 w-full border-2 border-sky-400 rounded-lg object-cover"
          />

          <p className="my-2 text-xl text-center font-semibold">Skor {score}</p>

          <div>
            <video
              id="hand-pose-video"
              className="border-4 border-sky-400 rounded-lg"
              playsInline
            ></video>
            <canvas id="hand-pose-canvas" className="hidden"></canvas>
            <div id="hand-pose-result-left" className="hidden"></div>
            <br />
            <div id="hand-pose-result-right" className="hidden"></div>
          </div>

          <div className="mt-4">
            <h3 id="result">Results</h3>
            <div>
              <p>Hand 1:</p>
              <p id="result-1">{userHandGesture.result1}</p>
            </div>
            <div>
              <p>Hand 2:</p>
              <p id="result-2">{userHandGesture.result2}</p>
            </div>
          </div>
        </>
      ) : (
        <GlobalLoading />
      )}
    </ProtectedPage>
  );
}

import { gestures } from "./gestures.js";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as fp from "fingerpose";
import "@mediapipe/hands";

const config = {
  video: { width: 640, height: 480, fps: 30 },
};

const landmarkColors = {
  thumb: "red",
  index: "blue",
  middle: "yellow",
  ring: "green",
  pinky: "pink",
  wrist: "white",
};

const gestureStrings = {
  thumbs_up: "👍",
  victory: "✌🏻",
  rock: "✊️",
  paper: "🖐",
  scissors: "✌️",
  dont: "🙅",
};

const base = ["Horizontal ", "Diagonal Up "];
const dont = {
  left: [...base].map((i) => i.concat(`Right`)),
  right: [...base].map((i) => i.concat(`Left`)),
};

async function createDetector() {
  return handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe",
      modelType: "full",
      maxHands: 2,
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915`,
    }
  );
}

async function main(setUserHandedness) {
  const video = document.querySelector("#hand-pose-video");
  const canvas = document.querySelector("#hand-pose-canvas");
  const ctx = canvas.getContext("2d");

  const resultLayer = {
    right: document.querySelector("#hand-pose-result-right"),
    left: document.querySelector("#hand-pose-result-left"),
  };
  // configure gesture estimator
  // add "✌🏻" and "👍" as sample gestures
  const knownGestures = [
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
    ...gestures,
  ];
  const GE = new fp.GestureEstimator(knownGestures);
  // load handpose model
  const detector = await createDetector();
  const pair = new Set();

  function checkGestureCombination(chosenHand, poseData) {
    const addToPairIfCorrect = (chosenHand) => {
      const containsHand = poseData.some((finger) =>
        dont[chosenHand].includes(finger[2])
      );
      if (!containsHand) return;
      pair.add(chosenHand);
    };

    addToPairIfCorrect(chosenHand);
    if (pair.size !== 2) return;
    resultLayer.left.innerText = resultLayer.right.innerText =
      gestureStrings.dont;
    pair.clear();
  }
  // main estimation loop
  const estimateHands = async () => {
    // clear canvas overlay
    ctx.clearRect(0, 0, config.video.width, config.video.height);
    resultLayer.right.innerText = "";
    resultLayer.left.innerText = "";

    // get hand landmarks from video
    const hands = await detector.estimateHands(video, {
      flipHorizontal: true,
    });
    setUserHandedness(hands.map((hand) => hand.handedness));

    for (const hand of hands) {
      for (const keypoint of hand.keypoints) {
        const name = keypoint.name.split("_")[0].toString().toLowerCase();
        const color = landmarkColors[name];
        drawPoint(ctx, keypoint.x, keypoint.y, 3, color);
      }

      const keypoints3D = hand.keypoints3D.map((keypoint) => [
        keypoint.x,
        keypoint.y,
        keypoint.z,
      ]);
      const predictions = GE.estimate(keypoints3D, 9);

      if (predictions.gestures.length > 0) {
        const result = predictions.gestures.reduce((p, c) =>
          p.score > c.score ? p : c
        );
        const found = gestureStrings[result.name];
        // find gesture with highest match score
        const chosenHand = hand.handedness.toLowerCase();

        if (found !== gestureStrings.dont) {
          resultLayer[chosenHand].innerText = found;
          continue;
        }
        checkGestureCombination(chosenHand, predictions.poseData);
      }

      // Just return hands.hand.handeness
      // return hands.map((hand) => hand.handedness);
    }
    // ...and so on
    setTimeout(() => {
      estimateHands();
    }, 1000 / config.video.fps);
  };

  estimateHands();
}

async function initCamera(width, height, fps) {
  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
      width: width,
      height: height,
      frameRate: { max: fps },
    },
  };

  const video = document.querySelector("#hand-pose-video");
  video.width = width;
  video.height = height;

  // get video stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;

  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

export { config, initCamera, main };

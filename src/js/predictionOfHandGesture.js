export const runPredictionOfHandGesture = (setHandGesture) => {
  const video = document.getElementById("hand-pose-video");
  const canvas = document.getElementById("hand-pose-canvas");
  const ctx = canvas.getContext("2d");

  const apiUrl = process.env.NEXT_PUBLIC_COMPUTER_VISION_URL;

  video.addEventListener("play", () => {
    const sendFrame = () => {
      // Reset transform matrix to default
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Flip the image horizontally using scale
      ctx.scale(-1, 1);
      // Move the origin point to the left after flipping
      ctx.translate(-canvas.width, 0);
      // Draw the flipped image
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Reset transform matrix to default for future drawings
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const frameDataUrl = canvas.toDataURL("image/jpeg");
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ frameDataUrl }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update state with prediction results
          setHandGesture({
            result1: data[0]?.value || "",
            result2: data[1]?.value || "",
          });
        })
        .catch((error) => {})
        .finally(() => {
          requestAnimationFrame(sendFrame);
        });
    };

    sendFrame();
  });
};

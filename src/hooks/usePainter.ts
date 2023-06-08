import { useCallback, useRef, useState } from "react";

export const usePainter = () => {
  const canvas = useRef<HTMLCanvasElement>();
  const [isReady, setIsReady] = useState(false);

  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(20);

  const autoWidth = useRef(false);
  const selectedSaturation = useRef(100);
  const selectedLightness = useRef(50);
  const selectedColor = useRef("#000000");
  const selectedLineWidth = useRef(10);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const hue = useRef(0);
  const isDrawing = useRef(false);
  const direction = useRef(true);
  const isRegularPaintMode = useRef(true);
  const isEraserMode = useRef(false);

  const ctx = useRef(canvas?.current?.getContext("2d"));

  const drawOnCanvas = useCallback((event: any) => {
    if (!ctx || !ctx.current) {
      return;
    }
    ctx.current.beginPath();
    ctx.current.moveTo(lastX.current, lastY.current);
    ctx.current.lineTo(event.offsetX, event.offsetY);
    ctx.current.stroke();

    [lastX.current, lastY.current] = [event.offsetX, event.offsetY];
  }, []);

  const handleMouseDown = useCallback((e: any) => {
    isDrawing.current = true;
    [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
  }, []);

  const dynamicLineWidth = useCallback(() => {
    if (!ctx || !ctx.current) {
      return;
    }
    if (ctx.current.lineWidth > 90 || ctx.current.lineWidth < 10) {
      direction.current = !direction.current;
    }
    direction.current ? ctx.current.lineWidth++ : ctx.current.lineWidth--;
    setCurrentWidth(ctx.current.lineWidth);
  }, []);

  const drawNormal = useCallback(
    (e: any) => {
      if (!isDrawing.current || !ctx.current) return;

      if (isRegularPaintMode.current || isEraserMode.current) {
        ctx.current.strokeStyle = selectedColor.current;

        setCurrentColor(selectedColor.current);

        autoWidth.current && !isEraserMode.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);

        isEraserMode.current
          ? (ctx.current.globalCompositeOperation = "destination-out")
          : (ctx.current.globalCompositeOperation = "source-over");
      } else {
        setCurrentColor(
          `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`
        );
        ctx.current.strokeStyle = `hsl(${hue.current},${selectedSaturation.current}%,${selectedLightness.current}%)`;
        ctx.current.globalCompositeOperation = "source-over";

        hue.current++;

        if (hue.current >= 360) hue.current = 0;

        autoWidth.current
          ? dynamicLineWidth()
          : (ctx.current.lineWidth = selectedLineWidth.current);
      }
      drawOnCanvas(e);
    },
    [drawOnCanvas, dynamicLineWidth]
  );

  const stopDrawing = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const init = useCallback(() => {
    ctx.current = canvas?.current?.getContext("2d");
    if (canvas && canvas.current && ctx && ctx.current) {
      canvas.current.addEventListener("mousedown", handleMouseDown);
      canvas.current.addEventListener("mousemove", drawNormal);
      canvas.current.addEventListener("mouseup", stopDrawing);
      canvas.current.addEventListener("mouseout", stopDrawing);

      canvas.current.width = window.innerWidth - 196;
      canvas.current.height = window.innerHeight;

      ctx.current.strokeStyle = "#000";
      ctx.current.lineJoin = "round";
      ctx.current.lineCap = "round";
      ctx.current.lineWidth = 10;
      setIsReady(true);
    }
  }, [drawNormal, handleMouseDown, stopDrawing]);

  const handleClear = useCallback(() => {
    if (!ctx || !ctx.current || !canvas || !canvas.current) {
      return;
    }
    ctx.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }, []);

  return [
    {
      canvas,
      isReady,
      currentWidth,
      currentColor,
    },
    {
      init,
      handleClear,
    },
  ] as any;
};

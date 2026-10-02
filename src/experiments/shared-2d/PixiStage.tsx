import { useEffect, useRef } from "react";
import { Application } from "pixi.js";

export interface PixiSceneController<P> {
  update: (props: P) => void;
  resize?: (width: number, height: number) => void;
  destroy?: () => void;
}

interface PixiStageProps<P> {
  className?: string;
  ariaLabel: string;
  sceneProps: P;
  createScene: (app: Application, initialProps: P) => PixiSceneController<P>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export function PixiStage<P>({ className, ariaLabel, sceneProps, createScene, onKeyDown }: PixiStageProps<P>) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<PixiSceneController<P> | null>(null);
  const propsRef = useRef(sceneProps);
  propsRef.current = sceneProps;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let initialized = false;
    let destroyed = false;
    const app = new Application();
    let observer: ResizeObserver | undefined;
    const destroyApp = () => {
      if (!initialized || destroyed) return;
      destroyed = true;
      app.destroy(true, { children: true });
    };

    void app.init({
      resizeTo: host,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      backgroundAlpha: 0,
      preference: "webgl",
    }).then(() => {
      initialized = true;
      if (disposed) {
        destroyApp();
        return;
      }
      app.canvas.style.width = "100%";
      app.canvas.style.height = "100%";
      app.canvas.style.display = "block";
      app.canvas.style.touchAction = "none";
      host.appendChild(app.canvas);
      const controller = createScene(app, propsRef.current);
      controllerRef.current = controller;
      controller.update(propsRef.current);
      observer = new ResizeObserver(([entry]) => controller.resize?.(entry.contentRect.width, entry.contentRect.height));
      observer.observe(host);
    });

    return () => {
      disposed = true;
      observer?.disconnect();
      controllerRef.current?.destroy?.();
      controllerRef.current = null;
      destroyApp();
    };
  }, [createScene]);

  useEffect(() => controllerRef.current?.update(sceneProps), [sceneProps]);

  return <div ref={hostRef} className={className} role="application" tabIndex={0} aria-label={ariaLabel} onKeyDown={onKeyDown} />;
}

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0, 1); }
`;

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;

vec3 palette(float t) {
  vec3 a = vec3(0.04, 0.08, 0.16);
  vec3 b = vec3(0.04, 0.12, 0.20);
  vec3 c = vec3(0.02, 0.22, 0.35);
  vec3 d = vec3(0.00, 0.05, 0.12);
  return a + b * cos(6.28318 * (c * t + d));
}

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2  s = vec2(1.0);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p  = p * 2.0 + vec2(0.3, 0.7) * float(i);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  vec2 mouse = (u_mouse - 0.5 * u_res) / min(u_res.x, u_res.y);

  float t = u_time * 0.18;
  vec2 q = vec2(fbm(uv + t * 0.4), fbm(uv + vec2(1.7, 9.2)));
  vec2 r = vec2(
    fbm(uv + 1.0 * q + vec2(1.7, 9.2) + t * 0.15),
    fbm(uv + 1.0 * q + vec2(8.3, 2.8) + t * 0.126)
  );

  float f = fbm(uv + r);
  float d = distance(uv, mouse);
  f += 0.12 * exp(-d * 3.0);

  vec3 col = mix(
    palette(f * 0.6),
    vec3(0.0, 0.18, 0.28),
    clamp(f * f * 4.0, 0.0, 1.0)
  );

  col = mix(col, vec3(0.0, 0.22, 0.40), clamp(length(r - q), 0.0, 1.0));

  // Darken edges for vignette
  float vignette = 1.0 - smoothstep(0.4, 1.2, length(uv));
  col *= vignette * 0.85 + 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export function WebGLHero({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, createShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, createShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime  = gl.getUniformLocation(prog, "u_time");
    const uRes   = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width  = Math.round(w * Math.min(window.devicePixelRatio, 1.5));
      canvas.height = Math.round(h * Math.min(window.devicePixelRatio, 1.5));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: rect.height - (e.clientY - rect.top) };
    };
    canvas.addEventListener("mousemove", onMouse, { passive: true });

    const render = () => {
      const t = (performance.now() - startRef.current) / 1000;
      gl.uniform1f(uTime,  t);
      gl.uniform2f(uRes,   canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x * Math.min(window.devicePixelRatio, 1.5),
                           mouseRef.current.y * Math.min(window.devicePixelRatio, 1.5));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouse);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`webgl-hero-canvas ${className}`}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createNoise3D, createNoise4D } from "simplex-noise";
import gsap from "gsap";

const CONFIG = {
  particleCount: 12000,
  shapeSize: 14,
  swarmDistanceFactor: 1.5,
  swirlFactor: 4.0,
  noiseFrequency: 0.1,
  noiseTimeScale: 0.04,
  noiseMaxStrength: 2.8,
  colorScheme: "neon" as const,
  morphDuration: 3.5,
  particleSizeRange: [0.08, 0.22] as [number, number],
  starCount: 12000,
  bloomStrength: 1.4,
  bloomRadius: 0.5,
  bloomThreshold: 0.05,
  idleFlowStrength: 0.25,
  idleFlowSpeed: 0.08,
  morphSizeFactor: 0.5,
  morphBrightnessFactor: 0.6,
};

const COLOR_SCHEMES = {
  fire:    { startHue: 0,   endHue: 45,  saturation: 0.95, lightness: 0.6 },
  neon:    { startHue: 270, endHue: 180, saturation: 1.0,  lightness: 0.65 },
  nature:  { startHue: 90,  endHue: 160, saturation: 0.85, lightness: 0.55 },
  rainbow: { startHue: 0,   endHue: 360, saturation: 0.9,  lightness: 0.6 },
};

type ColorScheme = keyof typeof COLOR_SCHEMES;

function generateSphere(count: number, size: number) {
  const pts = new Float32Array(count * 3);
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts[i * 3]     = Math.cos(theta) * r * size;
    pts[i * 3 + 1] = y * size;
    pts[i * 3 + 2] = Math.sin(theta) * r * size;
  }
  return pts;
}
function generateTorus(count: number, size: number) {
  const pts = new Float32Array(count * 3);
  const R = size * 0.7, r = size * 0.3;
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.random() * Math.PI * 2;
    pts[i * 3]     = (R + r * Math.cos(phi)) * Math.cos(theta);
    pts[i * 3 + 1] = r * Math.sin(phi);
    pts[i * 3 + 2] = (R + r * Math.cos(phi)) * Math.sin(theta);
  }
  return pts;
}
function generateWave(count: number, size: number) {
  const pts = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1, v = Math.random() * 2 - 1;
    const dist = Math.sqrt(u * u + v * v);
    pts[i * 3]     = u * size;
    pts[i * 3 + 1] = Math.sin(dist * Math.PI * 3) * Math.cos(Math.atan2(v, u) * 2) * size * 0.4 * (1 - dist);
    pts[i * 3 + 2] = v * size;
  }
  return pts;
}
function generateCube(count: number, size: number) {
  const pts = new Float32Array(count * 3);
  const h = size / 2;
  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6);
    const u = Math.random() * size - h, v = Math.random() * size - h;
    const faces: [number,number,number][] = [[h,u,v],[-h,u,v],[u,h,v],[u,-h,v],[u,v,h],[u,v,-h]];
    [pts[i*3], pts[i*3+1], pts[i*3+2]] = faces[face];
  }
  return pts;
}
function generateOctahedron(count: number, size: number) {
  const pts = new Float32Array(count * 3);
  const vertices = [
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1]
  ];
  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 8);
    let v1 = vertices[Math.floor(Math.random() * 6)];
    let v2 = vertices[Math.floor(Math.random() * 6)];
    let v3 = vertices[Math.floor(Math.random() * 6)];
    
    const t1 = Math.random();
    const t2 = Math.random();
    const t3 = Math.random();
    const sum = t1 + t2 + t3;
    
    pts[i * 3]     = (v1[0] * t1 + v2[0] * t2 + v3[0] * t3) / sum * size;
    pts[i * 3 + 1] = (v1[1] * t1 + v2[1] * t2 + v3[1] * t3) / sum * size;
    pts[i * 3 + 2] = (v1[2] * t1 + v2[2] * t2 + v3[2] * t3) / sum * size;
  }
  return pts;
}

const SHAPES = [
  { name: "Sphere",  gen: generateSphere },
  { name: "Torus",   gen: generateTorus },
  { name: "Wave",    gen: generateWave },
  { name: "Cube",    gen: generateCube },
  { name: "Octahedron", gen: generateOctahedron },
];

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
  g.addColorStop(0,   "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.8)");
  g.addColorStop(0.5, "rgba(255,255,255,0.3)");
  g.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function HeroScene({ onShapeChange }: { onShapeChange?: (name: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000308, 0.025);
    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 8, 28);

    // ── Controls ──────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 70;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.enablePan = false;

    // ── Post-processing ───────────────────────────────────────────────────
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      CONFIG.bloomStrength,
      CONFIG.bloomRadius,
      CONFIG.bloomThreshold
    );
    composer.addPass(bloom);

    // ── Noise ─────────────────────────────────────────────────────────────
    const noise3D = createNoise3D();
    const noise4D = createNoise4D();

    // ── Starfield ─────────────────────────────────────────────────────────
    {
      const verts: number[] = [], cols: number[] = [], sizes: number[] = [];
      const tmp = new THREE.Vector3();
      for (let i = 0; i < CONFIG.starCount; i++) {
        tmp.set(THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400), THREE.MathUtils.randFloatSpread(400));
        if (tmp.length() < 100) tmp.setLength(100 + Math.random() * 300);
        verts.push(tmp.x, tmp.y, tmp.z);
        sizes.push(Math.random() * 0.15 + 0.05);
        const c = new THREE.Color();
        Math.random() < 0.1 ? c.setHSL(Math.random(), 0.7, 0.65) : c.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2);
        cols.push(c.r, c.g, c.b);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
      geo.setAttribute("color",    new THREE.Float32BufferAttribute(cols, 3));
      geo.setAttribute("size",     new THREE.Float32BufferAttribute(sizes, 1));
      const tex = createCircleTexture();
      const mat = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: tex } },
        vertexShader: `
          attribute float size; varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvp = modelViewMatrix * vec4(position,1.0);
            gl_PointSize = size * (400.0 / -mvp.z);
            gl_Position = projectionMatrix * mvp;
          }`,
        fragmentShader: `
          uniform sampler2D pointTexture; varying vec3 vColor;
          void main() {
            float a = texture2D(pointTexture, gl_PointCoord).a;
            if (a < 0.1) discard;
            gl_FragColor = vec4(vColor, a * 0.9);
          }`,
        blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, vertexColors: true,
      });
      scene.add(new THREE.Points(geo, mat));
    }

    // ── Particle system ───────────────────────────────────────────────────
    const N = CONFIG.particleCount;
    const allTargets = SHAPES.map(s => s.gen(N, CONFIG.shapeSize));
    let shapeIndex = 0;

    const geo = new THREE.BufferGeometry();
    const currentPos    = new Float32Array(allTargets[0]);
    const sourcePos     = new Float32Array(allTargets[0]);
    const swarmPos      = new Float32Array(N * 3);
    const sizes         = new Float32Array(N);
    const opacities     = new Float32Array(N);
    const effectStr     = new Float32Array(N);
    const colors        = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
      sizes[i]    = THREE.MathUtils.randFloat(CONFIG.particleSizeRange[0], CONFIG.particleSizeRange[1]);
      opacities[i] = 1;
    }

    const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();
    const tmpD = new THREE.Vector3(), tmpE = new THREE.Vector3();

    function buildColors(scheme: ColorScheme, positions: Float32Array) {
      const cs = COLOR_SCHEMES[scheme];
      const maxR = CONFIG.shapeSize * 1.1;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        tmpA.fromArray(positions, i3);
        const dist = tmpA.length();
        let hue: number;
        if (scheme === "rainbow") {
          hue = (((tmpA.x/maxR+1)/2*120) + ((tmpA.y/maxR+1)/2*120) + ((tmpA.z/maxR+1)/2*120)) % 360;
        } else {
          hue = THREE.MathUtils.mapLinear(dist, 0, maxR, cs.startHue, cs.endHue);
        }
        const nv = (noise3D(tmpA.x*0.2, tmpA.y*0.2, tmpA.z*0.2) + 1) * 0.5;
        const col = new THREE.Color().setHSL(
          hue / 360,
          THREE.MathUtils.clamp(cs.saturation * (0.9 + nv * 0.2), 0, 1),
          THREE.MathUtils.clamp(cs.lightness  * (0.85 + nv * 0.3), 0.1, 0.9)
        );
        col.toArray(colors, i3);
      }
      if (geo.attributes.color) geo.attributes.color.needsUpdate = true;
    }

    // fill colors array before setting attribute
    buildColors(CONFIG.colorScheme, currentPos);

    geo.setAttribute("position",      new THREE.BufferAttribute(currentPos, 3));
    geo.setAttribute("color",         new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size",          new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("opacity",       new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute("aEffectStr",    new THREE.BufferAttribute(effectStr, 1));

    const tex = createCircleTexture();
    const mat = new THREE.ShaderMaterial({
      uniforms: { pointTexture: { value: tex } },
      vertexShader: `
        attribute float size; attribute float opacity; attribute float aEffectStr;
        varying vec3 vColor; varying float vOpacity; varying float vES;
        void main() {
          vColor = color; vOpacity = opacity; vES = aEffectStr;
          vec4 mvp = modelViewMatrix * vec4(position, 1.0);
          float ss = 1.0 - vES * ${CONFIG.morphSizeFactor.toFixed(2)};
          gl_PointSize = size * ss * (400.0 / -mvp.z);
          gl_Position = projectionMatrix * mvp;
        }`,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor; varying float vOpacity; varying float vES;
        void main() {
          float a = texture2D(pointTexture, gl_PointCoord).a;
          if (a < 0.05) discard;
          vec3 c = vColor * (1.0 + vES * ${CONFIG.morphBrightnessFactor.toFixed(2)});
          gl_FragColor = vec4(c, a * vOpacity);
        }`,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, vertexColors: true,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Morph logic ───────────────────────────────────────────────────────
    let isMorphing = false;
    const morphState = { t: 0 };
    let morphTween: gsap.core.Tween | null = null;

    function triggerMorph() {
      if (isMorphing) return;
      isMorphing = true;
      controls.autoRotate = false;

      sourcePos.set(currentPos);
      shapeIndex = (shapeIndex + 1) % SHAPES.length;
      const nextTarget = allTargets[shapeIndex];

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        tmpA.fromArray(sourcePos, i3);
        tmpB.fromArray(nextTarget, i3);
        tmpC.lerpVectors(tmpA, tmpB, 0.5);
        const offsetDir = tmpD.set(
          noise3D(i * 0.05, 10, 10),
          noise3D(20, i * 0.05, 20),
          noise3D(30, 30, i * 0.05)
        ).normalize();
        const distFactor = tmpA.distanceTo(tmpB) * 0.1 + CONFIG.shapeSize * CONFIG.swarmDistanceFactor;
        tmpC.addScaledVector(offsetDir, distFactor * (0.5 + Math.random() * 0.8));
        swarmPos[i3]     = tmpC.x;
        swarmPos[i3 + 1] = tmpC.y;
        swarmPos[i3 + 2] = tmpC.z;
      }

      morphState.t = 0;
      if (morphTween) morphTween.kill();
      morphTween = gsap.to(morphState, {
        t: 1,
        duration: CONFIG.morphDuration,
        ease: "power2.inOut",
        onComplete: () => {
          currentPos.set(allTargets[shapeIndex]);
          geo.attributes.position.needsUpdate = true;
          sourcePos.set(allTargets[shapeIndex]);
          effectStr.fill(0);
          geo.attributes.aEffectStr.needsUpdate = true;
          buildColors(CONFIG.colorScheme, currentPos);
          isMorphing = false;
          controls.autoRotate = true;
          onShapeChange?.(SHAPES[shapeIndex].name);
        },
      });
    }

    // auto-morph every 6 seconds
    const autoMorphTimer = setInterval(triggerMorph, 16000);
    // click to morph
    mount.addEventListener("click", triggerMorph);

    // ── Animation loop ────────────────────────────────────────────────────
    const startTime = performance.now();
    let animId: number;
    let disposed = false;

    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;
      controls.update();

      const posAttr  = geo.attributes.position;
      const effAttr  = geo.attributes.aEffectStr;
      if (!posAttr || !effAttr) return;

      if (isMorphing) {
        const t = morphState.t;
        const target = allTargets[shapeIndex];
        const effect = Math.sin(t * Math.PI);
        const swirl  = effect * CONFIG.swirlFactor * 0.016;
        const noiseAmt = effect * CONFIG.noiseMaxStrength;
        const noiseT = elapsed * CONFIG.noiseTimeScale;

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          tmpA.fromArray(sourcePos, i3);
          tmpB.fromArray(swarmPos, i3);
          tmpC.fromArray(target, i3);

          const ti = 1 - t;
          tmpD.set(
            ti*ti*tmpA.x + 2*ti*t*tmpB.x + t*t*tmpC.x,
            ti*ti*tmpA.y + 2*ti*t*tmpB.y + t*t*tmpC.y,
            ti*ti*tmpA.z + 2*ti*t*tmpB.z + t*t*tmpC.z,
          );

          if (swirl > 0.01) {
            tmpE.set(
              noise3D(i*0.02, elapsed*0.1, 0),
              noise3D(0, i*0.02, elapsed*0.1+5),
              noise3D(elapsed*0.1+10, 0, i*0.02)
            ).normalize();
            tmpD.applyAxisAngle(tmpE, swirl * (0.5 + Math.random() * 0.5));
          }
          if (noiseAmt > 0.01) {
            tmpD.x += noise4D(tmpD.x*CONFIG.noiseFrequency, tmpD.y*CONFIG.noiseFrequency, tmpD.z*CONFIG.noiseFrequency, noiseT) * noiseAmt;
            tmpD.y += noise4D(tmpD.x*CONFIG.noiseFrequency+100, tmpD.y*CONFIG.noiseFrequency+100, tmpD.z*CONFIG.noiseFrequency+100, noiseT) * noiseAmt;
            tmpD.z += noise4D(tmpD.x*CONFIG.noiseFrequency+200, tmpD.y*CONFIG.noiseFrequency+200, tmpD.z*CONFIG.noiseFrequency+200, noiseT) * noiseAmt;
          }

          currentPos[i3]     = tmpD.x;
          currentPos[i3 + 1] = tmpD.y;
          currentPos[i3 + 2] = tmpD.z;
          effectStr[i] = effect;
        }
        posAttr.needsUpdate = true;
        effAttr.needsUpdate = true;
      } else {
        const breath = 1 + Math.sin(elapsed * 0.5) * 0.015;
        const timeS  = elapsed * CONFIG.idleFlowSpeed;
        const f = 0.1;
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          tmpA.fromArray(sourcePos, i3).multiplyScalar(breath);
          tmpB.set(
            noise4D(tmpA.x*f, tmpA.y*f, tmpA.z*f, timeS),
            noise4D(tmpA.x*f+10, tmpA.y*f+10, tmpA.z*f+10, timeS),
            noise4D(tmpA.x*f+20, tmpA.y*f+20, tmpA.z*f+20, timeS)
          );
          tmpA.addScaledVector(tmpB, CONFIG.idleFlowStrength);
          tmpC.fromArray(currentPos, i3).lerp(tmpA, 0.05);
          currentPos[i3]     = tmpC.x;
          currentPos[i3 + 1] = tmpC.y;
          currentPos[i3 + 2] = tmpC.z;
        }
        posAttr.needsUpdate = true;
      }

      composer.render();
    }
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    function onResize() {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      clearInterval(autoMorphTimer);
      morphTween?.kill();
      mount.removeEventListener("click", triggerMorph);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [onShapeChange]);

  return <div ref={mountRef} className="w-full h-full cursor-pointer" />;
}

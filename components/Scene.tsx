"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { moodStore, type Mood } from "@/lib/sceneBus";

/* ------------------------------------------------------------------ */
/*  Terrain maths (CPU)                                                */
/* ------------------------------------------------------------------ */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function vnoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}
function fbm(x: number, y: number, o: number) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < o; i++) { v += a * vnoise(x * f, y * f); f *= 2.03; a *= 0.5; }
  return v;
}
function ridged(x: number, y: number) {
  let v = 0, a = 0.55, f = 1, w = 1;
  for (let i = 0; i < 6; i++) {
    let n = 1 - Math.abs(vnoise(x * f, y * f) * 2 - 1);
    n *= n; v += n * a * w; w = Math.min(1, n * 1.6); f *= 2.1; a *= 0.5;
  }
  return v;
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const riverX = (z: number) => 26 * Math.sin(z * 0.011) + 12 * Math.sin(z * 0.027 + 1.3);

/** Mountain river that opens into a deep fjord downstream (z < -200). */
function height(x: number, z: number) {
  const fj = smooth(-190, -420, z);
  const wk = 1 + 1.6 * fj;
  const d = Math.abs(x - riverX(z));
  const base = 110 * Math.pow(smooth(45 * wk, 330, d), 1.4);
  const mount = ridged(x * 0.0055 + 3.1, z * 0.0055 - 1.7) * 165 * smooth(70 * wk, 250, d);
  const far = 1 + 1.3 * smooth(-350, -850, z);
  const back = 260 * Math.exp(-Math.pow((x - riverX(z) - 40) / 220, 2)) * smooth(-700, -980, z);
  const detail = (fbm(x * 0.04, z * 0.04, 4) - 0.5) * 7;
  let h = (base + mount) * far + back + detail;
  const dunes = (fbm(x * 0.025 + 5, z * 0.025, 3) - 0.5) * 10 * fj;
  const bed = -3.5 - 44 * fj + detail * 0.3 + dunes;
  h = bed + (h - bed) * smooth(16 * wk, 48 * wk, d);
  return h;
}

/* ------------------------------------------------------------------ */
/*  Lighting presets                                                   */
/* ------------------------------------------------------------------ */
type Preset = {
  sunDir: [number, number, number]; sunColor: [number, number, number];
  skyTop: [number, number, number]; horizon: [number, number, number];
  ground: [number, number, number]; deep: [number, number, number];
  ambient: number; fog: number; stars: number; exposure: number; mist: number;
};
const PRESETS: Record<Mood, Preset> = {
  golden: { sunDir: [0.42, 0.075, -0.9], sunColor: [1.7, 0.78, 0.34], skyTop: [0.06, 0.13, 0.32], horizon: [0.95, 0.5, 0.28], ground: [0.05, 0.035, 0.035], deep: [0.015, 0.075, 0.085], ambient: 0.42, fog: 0.0012, stars: 0, exposure: 0.85, mist: 0.3 },
  blue: { sunDir: [0.4, 0.02, -0.92], sunColor: [0.62, 0.38, 0.56], skyTop: [0.025, 0.055, 0.16], horizon: [0.36, 0.3, 0.5], ground: [0.025, 0.025, 0.045], deep: [0.012, 0.035, 0.08], ambient: 0.6, fog: 0.0015, stars: 0.35, exposure: 1.05, mist: 0.4 },
  night: { sunDir: [-0.45, 0.32, -0.83], sunColor: [0.22, 0.3, 0.46], skyTop: [0.004, 0.009, 0.026], horizon: [0.045, 0.06, 0.11], ground: [0.008, 0.01, 0.018], deep: [0.004, 0.014, 0.03], ambient: 0.55, fog: 0.0016, stars: 1, exposure: 1.5, mist: 0.5 },
};

/* ------------------------------------------------------------------ */
/*  Shared GLSL                                                        */
/* ------------------------------------------------------------------ */
const COMMON = /* glsl */ `
uniform float uTime; uniform vec3 uSunDir; uniform vec3 uSunColor; uniform vec3 uSkyTop; uniform vec3 uSkyHorizon;
uniform vec3 uGround; uniform vec3 uDeep; uniform float uAmbient; uniform float uFog; uniform float uStars;
uniform float uExposure; uniform float uMist; uniform float uUnder;
float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1,0)),f.x), mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x), f.y); }
vec3 skyColor(vec3 d){
  float y=d.y;
  vec3 col = mix(uSkyHorizon, uSkyTop, pow(clamp(y,0.,1.),.5));
  col = mix(col, uGround, smoothstep(0.,-.2,y));
  float s = max(dot(d,uSunDir),0.);
  col += uSunColor*(pow(s,5.)*.28 + pow(s,48.)*.55);
  col += uSunColor*smoothstep(.99955,.99975,s)*9.;
  col += uSunColor*.22*exp(-abs(y-.01)*14.)*pow(s,2.5);
  return col;
}
vec3 fogColor(vec3 d){ float s=max(dot(d,uSunDir),0.); return mix(uSkyHorizon*.95, uSunColor*1.05+uSkyHorizon*.35, pow(s,6.)*.75); }
vec3 airFog(vec3 col, float dist, vec3 dir, float h){
  float f = 1.-exp(-pow(dist*uFog,1.5));
  float mist = uMist*exp(-max(h,0.)*.045)*smoothstep(30.,380.,dist);
  mist *= .75 + .25*vn(vec2(dist*.01 + uTime*.03, h*.05));
  return mix(col, fogColor(dir), clamp(max(f,mist),0.,1.));
}
vec3 waterFog(vec3 col, float dist, vec3 dir, float h){
  float f = 1.-exp(-dist*.028);
  vec3 fc = uDeep*(.45 + 1.1*smoothstep(-70.,0.,h)) * (1. + .6*max(dir.y,0.));
  return mix(col, fc, f);
}
vec3 applyFog(vec3 col, float dist, vec3 dir, float h){
  return mix(airFog(col,dist,dir,h), waterFog(col,dist,dir,h), uUnder);
}
float caustic(vec2 p, float t){
  vec2 q = p*.16;
  q += vec2(vn(q*1.3+t*.25), vn(q*1.3-t*.2+7.))*1.7;
  float a = abs(sin(q.x*2.3 + t*.45) + sin(q.y*2.1 - t*.38));
  return pow(1. - clamp(a*.5,0.,1.), 5.);
}
vec3 finish(vec3 c){ c*=uExposure; c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14); return pow(clamp(c,0.,1.),vec3(1./2.2)); }
`;

type Anchors = number[];

export default function Scene({ fixed }: { fixed?: number } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch {
      return; // CSS gradient fallback stays visible
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PR = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(PR);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, 0.3, 4000);

    const U = {
      uTime: { value: 0 }, uSunDir: { value: new THREE.Vector3() }, uSunColor: { value: new THREE.Color() },
      uSkyTop: { value: new THREE.Color() }, uSkyHorizon: { value: new THREE.Color() }, uGround: { value: new THREE.Color() },
      uDeep: { value: new THREE.Color() }, uAmbient: { value: 0.5 }, uFog: { value: 0.0016 }, uStars: { value: 0 },
      uExposure: { value: 1 }, uMist: { value: 0.5 }, uUnder: { value: 0 }, uPR: { value: PR },
      uCam: { value: new THREE.Vector3() }, uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() },
    };

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => { disposables.push(o); return o; };

    /* ---------------- sky ---------------- */
    const sky = new THREE.Mesh(
      track(new THREE.SphereGeometry(3000, 48, 24)),
      track(new THREE.ShaderMaterial({
        uniforms: U, side: THREE.BackSide, depthWrite: false,
        vertexShader: `varying vec3 vD; void main(){ vD=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
        fragmentShader: COMMON + /* glsl */ `varying vec3 vD;
          void main(){ vec3 d=normalize(vD); vec3 col=skyColor(d);
            vec3 c=floor(d*320.); float h=fract(sin(dot(c,vec3(12.9898,78.233,37.719)))*43758.5453);
            float star=step(.9986,h)*smoothstep(.02,.25,d.y)*(.55+.45*sin(uTime*1.7+h*200.));
            col += vec3(.9,.95,1.)*star*uStars*1.4;
            float cl = vn(d.xz/(d.y+.15)*3. + vec2(uTime*.004,0.));
            cl = smoothstep(.55,.85,cl)*smoothstep(.02,.2,d.y)*(1.-smoothstep(.3,.7,d.y));
            vec3 cloudCol = mix(uSkyHorizon*.8, uSunColor*1.2, pow(max(dot(d,uSunDir),0.),3.)*.8+.2);
            col = mix(col, cloudCol, cl*.45);
            col = mix(col, uDeep*.6, uUnder);
            gl_FragColor=vec4(finish(col),1.); }`,
      }))
    );
    sky.renderOrder = -1;
    scene.add(sky);

    /* ---------------- terrain ---------------- */
    const W = 760, D = 1100, SX = 300, SZ = 440;
    const tg = track(new THREE.PlaneGeometry(W, D, SX, SZ));
    tg.rotateX(-Math.PI / 2);
    tg.translate(0, 0, -D / 2 + 90);
    const pos = tg.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
    tg.computeVertexNormals();
    scene.add(new THREE.Mesh(tg, track(new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: `varying vec3 vW; varying vec3 vN;
        void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=normal; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: COMMON + /* glsl */ `varying vec3 vW; varying vec3 vN;
        void main(){
          vec3 n=normalize(vN); float slope=1.-n.y;
          float nz = vn(vW.xz*.07)*.6 + vn(vW.xz*.35)*.4;
          vec3 forest = mix(vec3(.028,.05,.03), vec3(.06,.085,.04), nz);
          vec3 rock = mix(vec3(.13,.115,.1), vec3(.26,.22,.19), nz);
          vec3 sand = vec3(.24,.2,.15);
          vec3 snow = vec3(.82,.85,.9);
          float rockMix = smoothstep(.22,.48, slope + (nz-.5)*.25);
          rockMix = max(rockMix, smoothstep(70.,140.,vW.y));
          vec3 alb = mix(forest, rock, rockMix);
          alb = mix(sand, alb, smoothstep(.2,2.8,vW.y));
          float sl = 150. + nz*60.;
          alb = mix(alb, snow, smoothstep(sl, sl+25., vW.y)*(1.-smoothstep(.5,.78,slope)));
          float dif = max(dot(n,uSunDir),0.);
          float wrap = max(dot(n,uSunDir)*.5+.5,0.);
          vec3 amb = mix(uGround*1.5, uSkyTop*1.2 + uSkyHorizon*.25, n.y*.5+.5)*uAmbient;
          vec3 col = alb*(uSunColor*(dif*1.7 + wrap*.12) + amb);
          vec3 V=vW-cameraPosition; float dist=length(V); vec3 dir=V/dist;
          col += uSunColor*pow(1.-max(dot(-dir,n),0.),4.)*pow(max(dot(dir,uSunDir),0.),2.)*.35;

          // underwater surfaces: sandy bed, sunlight caustics fading with depth
          float wet = uUnder*step(vW.y,.2);
          vec3 albU = mix(vec3(.2,.19,.14), rock*.8, rockMix) * (.8+.4*nz);
          albU = mix(albU, vec3(.05,.09,.05), smoothstep(.55,.8,vn(vW.xz*.05))*.6);
          float depthK = smoothstep(-65.,-1.,vW.y);
          float cau = caustic(vW.xz, uTime)*depthK;
          vec3 lightU = uDeep*(2.2+2.5*depthK)*(n.y*.5+.5) + (uSunColor*.7+vec3(.3,.6,.6)*.4)*cau*1.3*max(n.y,0.);
          col = mix(col, albU*lightU, wet);

          col = applyFog(col, dist, dir, vW.y);
          gl_FragColor=vec4(finish(col),1.);
        }`,
    }))));

    /* ---------------- water surface (both sides) ---------------- */
    const wg = track(new THREE.PlaneGeometry(W, D, 1, 1));
    wg.rotateX(-Math.PI / 2);
    wg.translate(0, 0.2, -D / 2 + 90);
    scene.add(new THREE.Mesh(wg, track(new THREE.ShaderMaterial({
      uniforms: U, side: THREE.DoubleSide,
      vertexShader: `varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: COMMON + /* glsl */ `varying vec3 vW;
        void main(){
          vec2 p=vW.xz; float t=uTime;
          vec2 g = vec2(cos(p.x*.32+t*1.1), cos(p.y*.45-t*.9))*.05
                 + vec2(cos(p.x*1.3-p.y*.7+t*2.), cos(p.y*1.7+p.x*.4+t*1.6))*.025
                 + (vec2(vn(p*.5+vec2(0.,t*.6)), vn(p*.5+vec2(9.,t*.5)))-.5)*.16;
          vec3 V=vW-cameraPosition; float dist=length(V); vec3 dir=V/dist;
          vec3 col;
          if (cameraPosition.y < .2) {
            // looking up from below: Snell's window with ripples
            float up = dir.y + (g.x+g.y)*.35;
            float win = smoothstep(.6,.74,up);
            vec3 above = skyColor(normalize(vec3(dir.x*.5+g.x, 1., dir.z*.5+g.y)))*.9;
            vec3 below = uDeep*1.6 + uDeep*2.5*vn(p*.35+t*.2);
            col = mix(below, above, win);
            col += uSunColor*pow(max(dot(normalize(vec3(dir.x+g.x*2., dir.y, dir.z+g.y*2.)), uSunDir),0.),24.)*win*.8;
            col = waterFog(col, dist, dir, 0.);
          } else {
            vec3 n = normalize(vec3(g.x,1.,g.y));
            n = normalize(mix(n, vec3(0.,1.,0.), smoothstep(60.,600.,dist)*.85));
            vec3 r = reflect(dir,n); r.y=abs(r.y);
            float fres = .03 + .97*pow(1.-max(dot(-dir,n),0.),5.);
            vec3 deep = uDeep*.35;
            vec3 refl = skyColor(r);
            refl = mix(refl, deep*2.+uSkyHorizon*.12, .55*smoothstep(.2,.0,r.y)*(1.-pow(max(dot(r,uSunDir),0.),8.)));
            col = mix(deep, refl, fres);
            col += uSunColor*pow(max(dot(r,uSunDir),0.),280.)*7.;
            col = airFog(col, dist, dir, 0.);
          }
          gl_FragColor=vec4(finish(col),1.);
        }`,
    }))));

    /* ---------------- conifers ---------------- */
    const cone = track(new THREE.ConeGeometry(0.5, 1, 7, 1));
    cone.translate(0, 0.5, 0);
    const TREES = 5200;
    const trees = new THREE.InstancedMesh(cone, track(new THREE.ShaderMaterial({
      uniforms: U,
      vertexShader: `attribute float aTint; varying vec3 vW; varying vec3 vN; varying float vT; varying float vH;
        void main(){ vec4 w = modelMatrix*instanceMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(instanceMatrix)*normal); vT=aTint; vH=position.y;
          gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: COMMON + /* glsl */ `varying vec3 vW; varying vec3 vN; varying float vT; varying float vH;
        void main(){
          vec3 n=normalize(vN);
          vec3 alb = mix(vec3(.018,.04,.025), vec3(.045,.07,.035), vT) * (.55+.6*vH);
          float dif=max(dot(n,uSunDir),0.);
          vec3 amb = mix(uGround, uSkyTop+uSkyHorizon*.2, .6)*uAmbient;
          vec3 col = alb*(uSunColor*dif*2.2 + amb);
          vec3 V=vW-cameraPosition; float dist=length(V); vec3 dir=V/dist;
          col += uSunColor*pow(1.-max(dot(-dir,n),0.),3.)*pow(max(dot(dir,uSunDir),0.),3.)*.25*vH;
          col = applyFog(col, dist, dir, vW.y);
          gl_FragColor=vec4(finish(col),1.);
        }`,
    })), TREES);
    const tint = new Float32Array(TREES);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    let placed = 0, guard = 0;
    while (placed < TREES && guard < 200000) {
      guard++;
      const z = 60 - Math.random() * 620;
      const x = riverX(z) + (Math.random() * 2 - 1) * 260;
      const h = height(x, z);
      if (h < 1.2 || h > 110) continue;
      const slope = Math.abs(height(x + 2, z) - height(x - 2, z)) + Math.abs(height(x, z + 2) - height(x, z - 2));
      if (slope > 5.5) continue;
      if (fbm(x * 0.02, z * 0.02, 3) < 0.4 && Math.random() < 0.7) continue;
      if (Math.abs(z - 10) < 45 && Math.abs(x - riverX(z)) < 60 && Math.random() < 0.8) continue;
      const sc = 2.2 + Math.random() * 3.6;
      p.set(x, h - 0.4, z);
      s.set(sc * 0.32, sc * (1.9 + Math.random() * 0.6), sc * 0.32);
      q.setFromAxisAngle(up, Math.random() * 6.28);
      m.compose(p, q, s); trees.setMatrixAt(placed, m); tint[placed] = Math.random(); placed++;
    }
    trees.count = placed;
    cone.setAttribute("aTint", new THREE.InstancedBufferAttribute(tint, 1));
    trees.frustumCulled = false;
    scene.add(trees);

    /* ---------------- kelp forest on the fjord floor ---------------- */
    const kelpGeo = track(new THREE.PlaneGeometry(0.6, 1, 1, 10));
    kelpGeo.translate(0, 0.5, 0);
    const KELP = 900;
    const kelp = new THREE.InstancedMesh(kelpGeo, track(new THREE.ShaderMaterial({
      uniforms: U, side: THREE.DoubleSide,
      vertexShader: /* glsl */ `uniform float uTime; attribute float aSeed; varying vec3 vW; varying float vH; varying float vS;
        void main(){
          vec3 pos = position; float h = pos.y; pos.x *= 1. - h*.65;
          vec4 base = instanceMatrix*vec4(0.,0.,0.,1.);
          vec4 w = modelMatrix*instanceMatrix*vec4(pos,1.);
          float sway = sin(uTime*.7 + aSeed*20. + h*2.2)*h*h*2.2 + sin(uTime*1.3+aSeed*7.)*h*.8;
          w.x += sway; w.z += cos(uTime*.5 + aSeed*11. + h*1.7)*h*h*1.2;
          vW=w.xyz; vH=h; vS=aSeed;
          gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: COMMON + /* glsl */ `varying vec3 vW; varying float vH; varying float vS;
        void main(){
          vec3 alb = mix(vec3(.05,.08,.02), vec3(.14,.13,.04), vS) * (.5+.9*vH);
          float depthK = smoothstep(-65.,-1.,vW.y);
          vec3 col = alb*(uDeep*5.*(.5+depthK) + uSunColor*.35*depthK*vH);
          vec3 V=vW-cameraPosition; float dist=length(V);
          col = waterFog(col, dist, V/dist, vW.y);
          gl_FragColor=vec4(finish(col),1.);
        }`,
    })), KELP);
    const kSeed = new Float32Array(KELP);
    placed = 0; guard = 0;
    while (placed < KELP && guard < 100000) {
      guard++;
      const z = -225 - Math.random() * 330;
      const x = riverX(z) + (Math.random() * 2 - 1) * 90;
      const h = height(x, z);
      if (h > -7) continue;
      if (Math.abs(x - riverX(z)) < 14) continue;
      if (fbm(x * 0.03 + 2, z * 0.03, 3) < 0.45) continue;
      const tall = 7 + Math.random() * 16;
      p.set(x, h - 0.3, z);
      s.set(0.8 + Math.random() * 0.7, Math.min(tall, -h - 2), 1);
      q.setFromAxisAngle(up, Math.random() * 6.28);
      m.compose(p, q, s); kelp.setMatrixAt(placed, m); kSeed[placed] = Math.random(); placed++;
    }
    kelp.count = placed;
    kelpGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(kSeed, 1));
    kelp.frustumCulled = false;
    scene.add(kelp);

    /* ---------------- motes: pollen above, bubbles & marine snow below ---------------- */
    const NP = 900;
    const pp = new Float32Array(NP * 3), ps = new Float32Array(NP);
    for (let i = 0; i < NP; i++) {
      pp[i * 3] = (Math.random() * 2 - 1) * 60;
      pp[i * 3 + 1] = (Math.random() * 2 - 1) * 30;
      pp[i * 3 + 2] = (Math.random() * 2 - 1) * 80;
      ps[i] = Math.random();
    }
    const pg = track(new THREE.BufferGeometry());
    pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
    pg.setAttribute("aSeed", new THREE.BufferAttribute(ps, 1));
    const motes = new THREE.Points(pg, track(new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `uniform float uTime; uniform float uPR; uniform vec3 uCam; uniform float uUnder; attribute float aSeed;
        varying float vA; varying float vB;
        void main(){
          float t=uTime*(.15+aSeed*.2);
          vec3 q=position;
          q.x += sin(t+aSeed*40.)*4.; q.z += cos(t*.8+aSeed*9.)*4.;
          q.y += uTime*(.4+aSeed*1.6)*(.3+uUnder*1.2);
          vec3 box = vec3(120.,60.,160.);
          q = uCam + mod(q - uCam + box*.5, box) - box*.5;
          vec4 mv=viewMatrix*vec4(q,1.); gl_Position=projectionMatrix*mv;
          vB = step(aSeed,.35)*uUnder;                 // a third become bubbles underwater
          gl_PointSize = (18.+aSeed*28.)*(1.+vB*1.8)*uPR/max(-mv.z,1.);
          float side = mix(step(0.4,q.y), step(q.y,-0.4), step(.5,uUnder));
          vA = (.35+.65*(sin(uTime*(1.+aSeed*2.)+aSeed*30.)*.5+.5)) * smoothstep(80.,6.,-mv.z) * side;
        }`,
      fragmentShader: /* glsl */ `uniform vec3 uSunColor; uniform float uUnder; varying float vA; varying float vB;
        void main(){
          float d=length(gl_PointCoord-.5);
          float soft = smoothstep(.5,0.,d);
          float ring = smoothstep(.5,.38,d)*smoothstep(.22,.42,d) + smoothstep(.16,.0,length(gl_PointCoord-vec2(.35,.33)))*.8;
          float a = mix(soft, ring, vB);
          vec3 c = mix(sqrt(uSunColor)*.55, vec3(.55,.85,.95)*.45, uUnder);
          gl_FragColor=vec4(c*a*vA,1.);
        }`,
    })));
    motes.frustumCulled = false;
    scene.add(motes);

    /* ---------------- underwater light shafts (full-screen pass) ---------------- */
    const rays = new THREE.Mesh(track(new THREE.PlaneGeometry(2, 2)), track(new THREE.ShaderMaterial({
      uniforms: U, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
      fragmentShader: COMMON + /* glsl */ `uniform mat4 uInvProj; uniform mat4 uCamWorld; uniform vec3 uCam; varying vec2 vUv;
        void main(){
          if (uUnder < .01) { gl_FragColor=vec4(0.); return; }
          vec4 v = uInvProj*vec4(vUv*2.-1., 1., 1.); v/=v.w;
          vec3 dir = normalize((uCamWorld*vec4(v.xyz,0.)).xyz);
          vec2 sd = normalize(uSunDir.xz + vec2(.0001));
          float a = dot(dir.xz, vec2(-sd.y, sd.x))/(abs(dir.y)+.6) * 9. + uCam.x*.05;
          float r = pow(vn(vec2(a + uTime*.12, uTime*.05)), 3.) + pow(vn(vec2(a*2.3 - uTime*.08, 4.)), 4.)*.6;
          float fall = smoothstep(-.35,.7,dir.y) * smoothstep(-80.,-2.,uCam.y);
          vec3 c = (uSunColor*.35 + vec3(.25,.55,.6)*.25) * r * fall * .22 * uUnder;
          gl_FragColor=vec4(c,1.);
        }`,
    })));
    rays.frustumCulled = false;
    rays.renderOrder = 999;
    scene.add(rays);

    /* ---------------- moods ---------------- */
    type State = { sunDir: THREE.Vector3; sunColor: THREE.Color; skyTop: THREE.Color; horizon: THREE.Color; ground: THREE.Color; deep: THREE.Color; ambient: number; fog: number; stars: number; exposure: number; mist: number };
    const snap = (pr: Preset): State => ({
      sunDir: new THREE.Vector3(...pr.sunDir).normalize(), sunColor: new THREE.Color(...pr.sunColor),
      skyTop: new THREE.Color(...pr.skyTop), horizon: new THREE.Color(...pr.horizon), ground: new THREE.Color(...pr.ground),
      deep: new THREE.Color(...pr.deep), ambient: pr.ambient, fog: pr.fog, stars: pr.stars, exposure: pr.exposure, mist: pr.mist,
    });
    const current = (): State => ({
      sunDir: U.uSunDir.value.clone(), sunColor: U.uSunColor.value.clone(), skyTop: U.uSkyTop.value.clone(),
      horizon: U.uSkyHorizon.value.clone(), ground: U.uGround.value.clone(), deep: U.uDeep.value.clone(),
      ambient: U.uAmbient.value, fog: U.uFog.value, stars: U.uStars.value, exposure: U.uExposure.value, mist: U.uMist.value,
    });
    const apply = (a: State, b: State, k: number) => {
      U.uSunDir.value.copy(a.sunDir).lerp(b.sunDir, k).normalize();
      U.uSunColor.value.copy(a.sunColor).lerp(b.sunColor, k);
      U.uSkyTop.value.copy(a.skyTop).lerp(b.skyTop, k);
      U.uSkyHorizon.value.copy(a.horizon).lerp(b.horizon, k);
      U.uGround.value.copy(a.ground).lerp(b.ground, k);
      U.uDeep.value.copy(a.deep).lerp(b.deep, k);
      U.uAmbient.value = a.ambient + (b.ambient - a.ambient) * k;
      U.uFog.value = a.fog + (b.fog - a.fog) * k;
      U.uStars.value = a.stars + (b.stars - a.stars) * k;
      U.uExposure.value = a.exposure + (b.exposure - a.exposure) * k;
      U.uMist.value = a.mist + (b.mist - a.mist) * k;
    };
    const s0 = snap(PRESETS[moodStore.get()]);
    apply(s0, s0, 1);
    let from: State | null = null, to: State | null = null, tStart = 0;
    const unsubMood = moodStore.subscribe(() => {
      from = current(); to = snap(PRESETS[moodStore.get()]); tStart = performance.now();
    });

    /* ---------------- camera path, anchored to page sections ---------------- */
    // [camZ, camY, camXoff, lookZ, lookY, lookXoff]
    const KF: number[][] = [
      [30, 17, 4, -130, 13, 10],     // hero
      [-40, 10, 3, -200, 6, 6],      // about
      [-130, 5, 2, -290, 0, 4],      // experience
      [-205, 1.8, 1, -330, -6, 2],   // skimming the surface
      [-250, -5, 0, -360, -16, 0],   // just under: work begins
      [-310, -15, 0, -420, -26, 0],  // mid work
      [-380, -25, 0, -490, -38, 0],  // stack
      [-440, -32, 0, -560, -44, 0],  // contact, near the floor
    ];
    const posCurve = new THREE.CatmullRomCurve3(KF.map((k) => new THREE.Vector3(riverX(k[0]) + k[2], k[1], k[0])));
    const lookCurve = new THREE.CatmullRomCurve3(KF.map((k) => new THREE.Vector3(riverX(k[3]) + k[5], k[4], k[3])));

    let anchors: Anchors = [0, 1, 2, 3, 4, 5, 6, 7];
    const measure = () => {
      const top = (id: string) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      };
      const work = document.getElementById("work");
      const workTop = top("work");
      const workH = work ? work.offsetHeight : 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const raw = [0, top("about") - innerHeight * 0.3, top("experience") - innerHeight * 0.2,
        workTop - innerHeight * 0.7, workTop, workTop + workH * 0.5, top("stack") - innerHeight * 0.2, max];
      anchors = raw.map((v, i) => Math.min(max, Math.max(v, 0)));
      for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
    };
    const scrollToU = (y: number) => {
      const n = anchors.length - 1;
      if (y <= anchors[0]) return 0;
      for (let i = 0; i < n; i++) {
        if (y <= anchors[i + 1]) return (i + (y - anchors[i]) / (anchors[i + 1] - anchors[i])) / n;
      }
      return 1;
    };

    /* ---------------- input & sizing ---------------- */
    const mouse = { x: 0, y: 0 }, sm = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = (e.clientY / innerHeight) * 2 - 1; };
    addEventListener("pointermove", onMove, { passive: true });

    const resize = () => {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = camera.aspect < 0.8 ? 64 : 52;
      camera.updateProjectionMatrix();
      measure();
    };
    addEventListener("resize", resize);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    resize();

    /* ---------------- loop ---------------- */
    const readout = document.getElementById("depth-readout");
    const label = document.getElementById("depth-label");
    const look = new THREE.Vector3();
    const t0 = performance.now();
    let uS = fixed ?? scrollToU(scrollY), last = t0, raf = 0, lastText = "";
    let visible = !document.hidden;
    const onVis = () => { visible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const render = (now: number) => {
      const dt = Math.min(0.5, (now - last) / 1000); last = now;
      const t = (now - t0) / 1000;
      U.uTime.value = t;
      if (from && to) {
        let k = Math.min(1, (now - tStart) / 1800);
        k = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        apply(from, to, k);
        if (k >= 1) from = null;
      }
      const target = fixed ?? scrollToU(scrollY);
      uS += reduced ? target - uS : (target - uS) * (1 - Math.exp(-dt * 4));
      sm.x += (mouse.x - sm.x) * 0.035; sm.y += (mouse.y - sm.y) * 0.035;

      posCurve.getPoint(uS, camera.position);
      lookCurve.getPoint(uS, look);
      const drift = reduced ? 0 : t;
      const under = camera.position.y < 0;
      camera.position.x += sm.x * (under ? 3 : 7);
      camera.position.y += -sm.y * (under ? 1.5 : 3) + Math.sin(drift * 0.3) * (under ? 0.8 : 0.4);
      look.x += sm.x * 10 + Math.sin(drift * 0.11) * 3;
      look.y += -sm.y * 5;
      camera.lookAt(look);

      const cy = camera.position.y;
      U.uUnder.value = THREE.MathUtils.smoothstep(-cy, -0.6, 0.6);
      U.uCam.value.copy(camera.position);
      sky.position.copy(camera.position);
      camera.updateMatrixWorld();
      U.uInvProj.value.copy(camera.projectionMatrixInverse);
      U.uCamWorld.value.copy(camera.matrixWorld);

      if (readout && label) {
        const txt = (cy >= 0 ? "+" : "−") + Math.abs(cy).toFixed(1) + " m";
        if (txt !== lastText) {
          readout.textContent = txt;
          label.textContent = cy > 0.6 ? "Altitude" : cy < -0.6 ? "Depth" : "Surface";
          lastText = txt;
        }
      }
      renderer.render(scene, camera);
    };
    const loop = (now: number) => { if (visible) render(now); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      unsubMood();
      disposables.forEach((d) => d.dispose());
      trees.dispose(); kelp.dispose();
      renderer.dispose();
    };
  }, [fixed]);

  return <canvas ref={canvasRef} className="scene" aria-hidden="true" />;
}

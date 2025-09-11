// === File: GuidesCube.jsx ===
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import "./Guides.css";

/* ========================= Constants / Config ========================= */
const SIZE = 0.95;
const GAP  = 0.06;
const STEP = SIZE + GAP;

const TURN_MS = 210;           // programmatic quarter-turn
const DRAG_EASE_MS = 140;      // snap easing after drag
const LOCK_PX = 6;             // pixels before locking a layer
const SNAP_FRACTION = 0.32;    // if under 1/4 turn but beyond this fraction, snap
const MAX_PREVIEW = Math.PI;   // preview clamp

// Softer shadows (prevents acne/banding)
const SHADOW_BIAS = -0.0002;
const SHADOW_NORMAL_BIAS = 0.6;

const COLORS = {
  U: 0xffffff, D: 0xffeb3b,
  L: 0x1976d2, R: 0x43a047,
  F: 0xd32f2f, B: 0xff9800,
};

const FACE_NORMALS = {
  U: new THREE.Vector3(0, 1, 0),
  D: new THREE.Vector3(0,-1, 0),
  L: new THREE.Vector3(-1,0, 0),
  R: new THREE.Vector3(1, 0, 0),
  F: new THREE.Vector3(0, 0, 1),
  B: new THREE.Vector3(0, 0,-1),
};

/* ✅ Correct cycles for +90° turns (match rotatePosInt). */
const ORIENT_CYCLES = {
  X: ["U","F","D","B"],  // U → F → D → B
  Y: ["F","R","B","L"],  // F → R → B → L
  Z: ["U","L","D","R"],  // U → L → D → R
};

const AXIS_UNIT = {
  X: new THREE.Vector3(1,0,0),
  Y: new THREE.Vector3(0,1,0),
  Z: new THREE.Vector3(0,0,1),
};

const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const roundToLayer = (v)=>clamp(Math.round(v),-1,1);

/* ========================= Scene Helpers ========================= */
function SceneLights(){
  return <>
    <ambientLight intensity={0.5}/>
    <hemisphereLight args={["#a0d8ff","#142026",0.45]}/>
    {/* key */}
    <directionalLight
      position={[6,10,8]}
      intensity={1.05}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={SHADOW_BIAS}
      shadow-normalBias={SHADOW_NORMAL_BIAS}
    />
    {/* rim */}
    <directionalLight
      position={[-6,6,-8]}
      intensity={0.36}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
      shadow-bias={SHADOW_BIAS}
      shadow-normalBias={SHADOW_NORMAL_BIAS}
    />
  </>;
}

function FloorShadow(){
  const tex = useMemo(()=>{
    const c=document.createElement("canvas"); c.width=512; c.height=512;
    const g=c.getContext("2d");
    const grd=g.createRadialGradient(256,256,80,256,256,240);
    grd.addColorStop(0,"rgba(0,0,0,0.35)");
    grd.addColorStop(1,"rgba(0,0,0,0)");
    g.fillStyle=grd; g.fillRect(0,0,512,512);
    const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
  },[]);
  return (
    <mesh position={[0,-2.0,0]} rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[11,11]}/>
      <meshBasicMaterial map={tex} transparent opacity={0.78}/>
    </mesh>
  );
}

/* ========================= Model Utils ========================= */
function makeCubie(x,y,z){
  const faces={U:null,D:null,L:null,R:null,F:null,B:null};
  if(y=== 1) faces.U=COLORS.U;
  if(y===-1) faces.D=COLORS.D;
  if(x===-1) faces.L=COLORS.L;
  if(x=== 1) faces.R=COLORS.R;
  if(z=== 1) faces.F=COLORS.F;
  if(z===-1) faces.B=COLORS.B;
  return { pos:new THREE.Vector3(x,y,z), faces, group:null };
}

function initialCubies(){
  const out=[];
  for(let x=-1;x<=1;x++)
  for(let y=-1;y<=1;y++)
  for(let z=-1;z<=1;z++)
    if(!(x===0&&y===0&&z===0)) out.push(makeCubie(x,y,z));
  return out;
}

function rotateFaces(cubie, axisKey, quarterTurns){
  const turns=((quarterTurns%4)+4)%4; if(!turns) return;
  const cyc=ORIENT_CYCLES[axisKey]; const f=cubie.faces; const copy={...f};
  for(let t=0;t<turns;t++){
    f[cyc[1]]=copy[cyc[0]];
    f[cyc[2]]=copy[cyc[1]];
    f[cyc[3]]=copy[cyc[2]];
    f[cyc[0]]=copy[cyc[3]];
    Object.assign(copy,f);
  }
}

function rotatePosInt(v,axisKey,quarterTurns){
  const turns=((quarterTurns%4)+4)%4; if(!turns) return v.clone();
  let {x,y,z}=v;
  for(let i=0;i<turns;i++){
    if(axisKey==="X"){ const ny=-z, nz= y; y=ny; z=nz; }
    if(axisKey==="Y"){ const nx= z, nz=-x; x=nx; z=nz; }
    if(axisKey==="Z"){ const nx=-y, ny= x; x=nx; y=ny; }
  }
  return new THREE.Vector3(x,y,z);
}

function easeOutCubic(u){return 1-Math.pow(1-u,3);}
function animateQuaternionTo(group, targetQ, ms=TURN_MS){
  return new Promise(res=>{
    const start=performance.now(); const base=group.quaternion.clone();
    function tick(t){
      const raw=clamp((t-start)/ms,0,1);
      const u=easeOutCubic(raw);
      const step=new THREE.Quaternion().slerpQuaternions(base,targetQ,u);
      group.quaternion.copy(step);
      if(raw<1){ requestAnimationFrame(tick); }
      else { res(); }
    }
    requestAnimationFrame(tick);
  });
}

/* ========================= Stickers / Cubies ========================= */
function makeStickerTexture(hex){
  const c=document.createElement("canvas");
  c.width=512; c.height=512;
  const g=c.getContext("2d");
  g.fillStyle=`#${hex.toString(16).padStart(6,"0")}`;
  g.fillRect(0,0,c.width,c.height);
  const grd=g.createLinearGradient(0,0,0,c.height);
  grd.addColorStop(0.00,"rgba(255,255,255,0.28)");
  grd.addColorStop(0.14,"rgba(255,255,255,0.10)");
  grd.addColorStop(0.60,"rgba(255,255,255,0.02)");
  grd.addColorStop(1.00,"rgba(0,0,0,0.04)");
  g.fillStyle=grd; g.fillRect(0,0,c.width,c.height);
  g.strokeStyle="rgba(0,0,0,0.55)";
  g.lineWidth=16; g.strokeRect(10,10,c.width-20,c.height-20);

  const tex=new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

function Sticker({ face, colorHex }){
  const tex=useMemo(()=>makeStickerTexture(colorHex),[colorHex]);
  const n = FACE_NORMALS[face];

  // tiny separation from body; planes (not boxes) avoid back-face conflicts
  const offset = (SIZE/2) + 0.024;
  const pos=[n.x*offset,n.y*offset,n.z*offset];

  // Correct outward-facing normals for planes
  const rot=new THREE.Euler();
  if(face==="U") rot.set(-Math.PI/2, 0, 0);
  if(face==="D") rot.set( Math.PI/2, 0, 0);
  if(face==="L") rot.set(0, -Math.PI/2, 0);  // ← fixed (outward = -X)
  if(face==="R") rot.set(0,  Math.PI/2, 0);  // ← fixed (outward = +X)
  if(face==="B") rot.set(0,  Math.PI,   0);

  // Anti Z-fighting: keep depthTest, disable depthWrite, negative polygonOffset
  const mat = useMemo(()=>new THREE.MeshStandardMaterial({
    map: tex,
    color: 0xffffff,
    metalness: 0.06,
    roughness: 0.28,
    emissive: 0x0b0b0b,
    emissiveIntensity: 0.035,
    toneMapped: true,
    side: THREE.FrontSide,
    shadowSide: THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits:  -3,
    depthTest: true,
    depthWrite: false
  }),[tex]);

  return (
    <group position={pos} rotation={rot}>
      <mesh
        castShadow={false}
        receiveShadow={false}
        renderOrder={2}
        userData={{ isSticker: true, face }}
        name={`sticker-${face}`}
      >
        {/* plane vs. thin box avoids back volume conflicts */}
        <planeGeometry args={[SIZE-0.08,SIZE-0.08]} />
        <primitive object={mat} attach="material"/>
      </mesh>
    </group>
  );
}

function Cubie({ data, onBind }){
  const group=useRef();
  useEffect(()=>{ if(group.current) onBind(group.current); },[onBind]);

  const bodyMat = useMemo(()=>new THREE.MeshStandardMaterial({
    color: 0x141619, metalness: 0.18, roughness: 0.48
  }),[]);

  return (
    <group
      ref={group}
      name="cubie"
      userData={{ isCubie: true }}
      position={[data.pos.x*STEP, data.pos.y*STEP, data.pos.z*STEP]}
    >
      <mesh castShadow receiveShadow userData={{ isBody:true }} renderOrder={0}>
        <boxGeometry args={[SIZE,SIZE,SIZE]}/>
        <primitive object={bodyMat} attach="material"/>
      </mesh>
      {Object.entries(data.faces).map(([f,c]) =>
        c==null ? null : <Sticker key={f} face={f} colorHex={c}/>
      )}
    </group>
  );
}

/* ========================= Drag Helper Math ========================= */
function orthoBasisFromNormal(n){
  const up = Math.abs(n.y) > 0.9 ? new THREE.Vector3(0,0,1) : new THREE.Vector3(0,1,0);
  const t1 = new THREE.Vector3().crossVectors(up, n).normalize();
  const t2 = new THREE.Vector3().crossVectors(n, t1).normalize();
  return { t1, t2 };
}
function toAxisKey(v){
  const ax = new THREE.Vector3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
  if (ax.x >= ax.y && ax.x >= ax.z) return "X";
  if (ax.y >= ax.x && ax.y >= ax.z) return "Y";
  return "Z";
}
function axisVector(axisKey){ return AXIS_UNIT[axisKey].clone(); }
function gridCoordFromGroup(g){
  return new THREE.Vector3(
    roundToLayer(Math.round(g.position.x / STEP)),
    roundToLayer(Math.round(g.position.y / STEP)),
    roundToLayer(Math.round(g.position.z / STEP))
  );
}
function nearestQuarterTurns(angle){
  const q = Math.PI/2;
  let turns = Math.round(angle / q);
  return clamp(turns, -2, 2);
}

/* ========================= Cube Root (R3F) ========================= */
const CubeRoot = React.forwardRef(function CubeRoot({
  cubiesRef, setCubies, onBindCubieGroup
}, forwardedRef){
  const innerRef = useRef();
  const groupRef = forwardedRef ?? innerRef;
  const { camera, gl } = useThree();

  // orbit override via right mouse or Space
  const orbitOverride = useRef(false);

  // raycasting + drag state
  const raycaster = useMemo(()=>new THREE.Raycaster(),[]);
  const pointerNDC = useRef({x:0,y:0});

  // Plane-based dragging (world-space)
  const dragPlane = useRef(new THREE.Plane());
  const planeHitStart = useRef(new THREE.Vector3());
  const planeHitCurr  = useRef(new THREE.Vector3());

  const drag = useRef({
    isDown:false, orbit:false, picking:false, locked:false,
    startX:0, startY:0, lastX:0, lastY:0, button:0,
    faceNormalWorld: new THREE.Vector3(),
    faceNormalLocal: new THREE.Vector3(),
    t1: new THREE.Vector3(), t2: new THREE.Vector3(),
    t1World: new THREE.Vector3(), t2World: new THREE.Vector3(),
    axisKey:null, layerIndex:0, accum:0,
    layerG: new THREE.Group(), affectedIdx: [],
    pickedGroup:null
  });

  const rot = useRef(new THREE.Euler(-0.18, 0.32, 0));

  useEffect(()=>{
    const el = gl.domElement;
    if(!el || !groupRef.current) return;

    groupRef.current.rotation.copy(rot.current);

    // prevent context menu for right-button orbit
    const onContextMenu = (e)=> e.preventDefault();
    el.addEventListener("contextmenu", onContextMenu);

    // Space = orbit override toggle
    const onKeyDown = (e)=>{ if(e.code==="Space") orbitOverride.current = true; };
    const onKeyUp   = (e)=>{ if(e.code==="Space") orbitOverride.current = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function setPointer(e){
      const r = el.getBoundingClientRect();
      pointerNDC.current.x = ((e.clientX - r.left)/r.width)*2 - 1;
      pointerNDC.current.y = -((e.clientY - r.top)/r.height)*2 + 1;
      raycaster.setFromCamera(pointerNDC.current, camera);
    }

    function hitCube(e){
      setPointer(e);
      const hits = raycaster.intersectObjects(groupRef.current.children, true)
        .filter(h => h.object?.userData?.isSticker || h.object?.parent?.userData?.isCubie);
      if(!hits.length) return null;

      // ascend to cubie group
      let obj = hits[0].object;
      while(obj && obj.parent && obj.parent !== groupRef.current && obj.name !== "cubie"){
        obj = obj.parent;
      }

      // world normal -> local (cube space)
      const invWorld = new THREE.Matrix4().copy(groupRef.current.matrixWorld).invert();
      const worldN = hits[0].face?.normal?.clone() ?? new THREE.Vector3(0,0,1);
      worldN.transformDirection(hits[0].object.matrixWorld);
      const localN = worldN.clone()
        .applyMatrix3(new THREE.Matrix3().setFromMatrix4(invWorld))
        .normalize();

      const worldPoint = hits[0].point.clone();
      return { group: obj, localNormal: localN, worldNormal: worldN, worldPoint };
    }

    const cleanupDrag = ()=>{
      try {
        drag.current.layerG.quaternion.identity();
        drag.current.layerG.clear();
        groupRef.current.remove(drag.current.layerG);
      } catch(_) {}
      drag.current.isDown=false;
      drag.current.picking=false;
      drag.current.locked=false;
      drag.current.orbit=false;
      drag.current.accum=0;
      drag.current.pickedGroup=null;
    };

    function onPointerDown(e){
      drag.current.isDown = true;
      drag.current.startX = e.clientX;
      drag.current.startY = e.clientY;
      drag.current.lastX  = e.clientX;
      drag.current.lastY  = e.clientY;
      drag.current.button = e.button;
      drag.current.picking = true;
      drag.current.locked  = false;
      drag.current.accum   = 0;
      drag.current.axisKey = null;
      drag.current.layerIndex = 0;
      drag.current.affectedIdx = [];
      drag.current.pickedGroup = null;

      const forceOrbit = e.button === 2 || orbitOverride.current;
      el.setPointerCapture?.(e.pointerId);

      const hit = forceOrbit ? null : hitCube(e);
      if(!hit){
        drag.current.orbit = true;
        return;
      }
      drag.current.orbit = false;
      drag.current.pickedGroup = hit.group;

      drag.current.faceNormalLocal.copy(hit.localNormal).normalize();
      drag.current.faceNormalWorld.copy(hit.worldNormal).normalize();

      const { t1, t2 } = orthoBasisFromNormal(drag.current.faceNormalLocal);
      drag.current.t1.copy(t1); drag.current.t2.copy(t2);

      const worldM3 = new THREE.Matrix3().setFromMatrix4(groupRef.current.matrixWorld);
      drag.current.t1World.copy(t1).applyMatrix3(worldM3).normalize();
      drag.current.t2World.copy(t2).applyMatrix3(worldM3).normalize();

      dragPlane.current.setFromNormalAndCoplanarPoint(
        drag.current.faceNormalWorld, hit.worldPoint
      );
      planeHitStart.current.copy(hit.worldPoint);
    }

    function onPointerMove(e){
      if(!drag.current.isDown) return;

      const dx = e.clientX - drag.current.lastX;
      const dy = e.clientY - drag.current.lastY;
      drag.current.lastX = e.clientX;
      drag.current.lastY = e.clientY;

      if(drag.current.orbit){
        const sens = 1/220;
        rot.current.y -= dx * sens * 1.2;
        rot.current.x = clamp(rot.current.x - dy * sens, -Math.PI/2.15, Math.PI/2.15);
        groupRef.current.rotation.set(rot.current.x, rot.current.y, 0);
        return;
      }
      if(!drag.current.picking) return;

      // project to drag plane
      setPointer(e);
      const ray = raycaster.ray;
      const hitNow = ray.intersectPlane(dragPlane.current, planeHitCurr.current);
      if(!hitNow) return;

      const worldDelta = new THREE.Vector3().subVectors(
        planeHitCurr.current, planeHitStart.current
      );

      if(!drag.current.locked){
        const screenDist = Math.hypot(
          e.clientX - drag.current.startX,
          e.clientY - drag.current.startY
        );
        if(screenDist <= LOCK_PX) return;

        const proj1 = Math.abs(worldDelta.dot(drag.current.t1World));
        const proj2 = Math.abs(worldDelta.dot(drag.current.t2World));
        const chosenTWorld = (proj1 >= proj2) ? drag.current.t1World : drag.current.t2World;
        const chosenTLocal = (proj1 >= proj2) ? drag.current.t1     : drag.current.t2;

        const rotAxisLocal = new THREE.Vector3()
          .crossVectors(drag.current.faceNormalLocal, chosenTLocal).normalize();

        drag.current.axisKey = toAxisKey(rotAxisLocal);

        const gpos = gridCoordFromGroup(drag.current.pickedGroup);
        drag.current.layerIndex = (drag.current.axisKey==="X") ? gpos.x :
                                  (drag.current.axisKey==="Y") ? gpos.y : gpos.z;

        drag.current.layerG.quaternion.identity();
        drag.current.layerG.clear();
        groupRef.current.add(drag.current.layerG);

        const localCubies = cubiesRef.current;
        drag.current.affectedIdx = [];
        localCubies.forEach((c, idx)=>{
          const coord = (drag.current.axisKey==="X") ? c.pos.x :
                        (drag.current.axisKey==="Y") ? c.pos.y : c.pos.z;
          if(coord === drag.current.layerIndex){
            drag.current.layerG.attach(c.group);
            drag.current.affectedIdx.push(idx);
          }
        });

        drag.current.locked = true;
      }

      if(drag.current.locked){
        const projOnT1 = worldDelta.dot(drag.current.t1World);
        const projOnT2 = worldDelta.dot(drag.current.t2World);
        const useT1 = Math.abs(projOnT1) >= Math.abs(projOnT2);
        const deltaAlong = useT1 ? projOnT1 : projOnT2;

        const radPerUnit = (Math.PI/2) / (STEP*0.8);
        let dAngle = deltaAlong * radPerUnit;

        if(drag.current.axisKey==="Y"){
          dAngle *= (drag.current.faceNormalLocal.y >= 0 ? 1 : -1);
        } else if(drag.current.axisKey==="X"){
          dAngle *= (drag.current.faceNormalLocal.x >= 0 ? -1 : 1);
        } else {
          dAngle *= (drag.current.faceNormalLocal.z >= 0 ? 1 : -1);
        }

        drag.current.accum = clamp(drag.current.accum + dAngle, -MAX_PREVIEW, MAX_PREVIEW);
        const axis = axisVector(drag.current.axisKey);
        const q = new THREE.Quaternion().setFromAxisAngle(axis, drag.current.accum);
        drag.current.layerG.quaternion.copy(q);

        // keep matrices fresh
        groupRef.current.updateMatrixWorld(true);

        planeHitStart.current.copy(planeHitCurr.current);
      }
    }

    async function onPointerUp(e){
      if(!drag.current.isDown) return;
      el.releasePointerCapture?.(e.pointerId);

      if(drag.current.orbit || !drag.current.picking){
        cleanupDrag();
        return;
      }
      if(!drag.current.locked){
        cleanupDrag();
        return;
      }

      const axisKey = drag.current.axisKey;
      const axis = axisVector(axisKey);
      const qtr = Math.PI/2;

      let turns = nearestQuarterTurns(drag.current.accum);
      const frac = Math.abs(drag.current.accum % qtr) / qtr;
      if (turns === 0 && frac > SNAP_FRACTION) {
        turns = (drag.current.accum > 0) ? 1 : -1;
      }
      turns = clamp(turns, -2, 2);

      const targetQ = new THREE.Quaternion().setFromAxisAngle(axis, turns*qtr);
      await animateQuaternionTo(drag.current.layerG, targetQ, DRAG_EASE_MS);

      const localCubies = cubiesRef.current;
      const next = localCubies.map(c=>({...c,pos:c.pos.clone(),faces:{...c.faces},group:c.group}));
      for(const idx of drag.current.affectedIdx){
        const c = next[idx];
        c.pos = rotatePosInt(c.pos, axisKey, turns);
        rotateFaces(c, axisKey, turns);
        groupRef.current.attach(c.group);
        c.group.position.set(c.pos.x*STEP, c.pos.y*STEP, c.pos.z*STEP);
        c.group.rotation.set(0,0,0);
        c.group.quaternion.identity();
      }

      // final refresh after detach
      groupRef.current.updateMatrixWorld(true);

      drag.current.layerG.quaternion.identity();
      drag.current.layerG.clear();
      groupRef.current.remove(drag.current.layerG);

      setCubies(next);
      cleanupDrag();
    }

    function onPointerLeave(){
      if(drag.current.isDown){
        drag.current.layerG.quaternion.identity();
        drag.current.layerG.clear();
        groupRef.current.remove(drag.current.layerG);
        groupRef.current.updateMatrixWorld(true);
      }
      drag.current.isDown=false;
      drag.current.picking=false;
      drag.current.locked=false;
      drag.current.orbit=false;
      drag.current.accum=0;
      drag.current.pickedGroup=null;
    }

    function onBlur(){ onPointerLeave(); }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   onPointerUp);
    el.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onBlur);

    const onWheel = (e)=>{
      camera.position.z = clamp(camera.position.z + e.deltaY*0.002, 4.6, 10.8);
    };
    el.addEventListener("wheel", onWheel, {passive:true});

    return ()=>{
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   onPointerUp);
      el.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onBlur);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  },[camera, gl, groupRef, setCubies, cubiesRef]);

  return (
    // 🔧 important: apply the computed groupRef here
    <group ref={groupRef}>
      {/* core */}
      <mesh castShadow>
        <boxGeometry args={[2.9,2.9,2.9]}/>
        <meshStandardMaterial color={0x0d0f10} metalness={0.18} roughness={0.36}/>
      </mesh>

      {/* cubies */}
      {cubiesRef.current.map((c,i)=>(
        <Cubie key={i} data={c} onBind={g=>onBindCubieGroup(i,g)} />
      ))}
    </group>
  );
});

/* ========================= Hint Engine (simple LBL) ========================= */
function detectStep(cubies){
  const find = (x,y,z)=>cubies.find(c=>c.pos.x===x&&c.pos.y===y&&c.pos.z===z);
  const isWhiteTop = c=>c?.faces?.U === COLORS.U;

  const cross = isWhiteTop(find(-1,1,0)) && isWhiteTop(find(0,1,1)) &&
                isWhiteTop(find(1,1,0))  && isWhiteTop(find(0,1,-1));
  if(!cross) return { title:"Build the White Cross", tip:"Find a white edge and bring it to the top using: F R U R' U' ", alg:"F R U R' U'" };

  const topLayer = [-1,0,1].every(x => [-1,0,1].every(z => isWhiteTop(find(x,1,z))));
  if(!topLayer) return { title:"Insert White Corners", tip:"Use trigger R U R' U' until each white corner is placed.", alg:"R U R' U'" };

  return { title:"Second Layer Edges", tip:"Insert a top edge with U R U' R' U' F' U F.", alg:"U R U' R' U' F' U F" };
}

/* ========================= Main Component ========================= */
export default function GuidesCube({ width=1180, height=620, scramble=true }){
  const [cubies, setCubies] = useState(()=>initialCubies());
  const [hint, setHint] = useState(()=>detectStep(cubies));
  const cubeRef = useRef();

  const cubiesRef = useRef(cubies);
  useEffect(()=>{ cubiesRef.current = cubies; }, [cubies]);
  useEffect(()=>{ setHint(detectStep(cubies)); },[cubies]);

  const onBindCubieGroup = useCallback((i,g)=>{ cubiesRef.current[i].group = g; },[]);

  // programmatic queue (for buttons/keyboard)
  const layerGRef = useRef(new THREE.Group());
  const queueRef = useRef([]);
  const playingRef = useRef(false);

  const applyTurn = useCallback(async (axisKey, layerIndex, turns=1)=>{
    if(!cubeRef.current) return;
    const root = cubeRef.current;
    const layerG = layerGRef.current; layerG.clear(); root.add(layerG);

    const idxs = [];
    const localCubies = cubiesRef.current;
    localCubies.forEach((c, i)=>{
      const coord = axisKey==="X" ? c.pos.x : axisKey==="Y" ? c.pos.y : c.pos.z;
      if(coord === layerIndex){ layerG.attach(c.group); idxs.push(i); }
    });

    const axis = AXIS_UNIT[axisKey];
    const targetQ = new THREE.Quaternion().setFromAxisAngle(axis, turns * Math.PI/2);
    await animateQuaternionTo(layerG, targetQ, TURN_MS * Math.abs(turns));

    const next = localCubies.map(c=>({...c,pos:c.pos.clone(),faces:{...c.faces},group:c.group}));
    idxs.forEach(i=>{
      next[i].pos = rotatePosInt(next[i].pos, axisKey, turns);
      rotateFaces(next[i], axisKey, turns);
      root.attach(next[i].group);
      next[i].group.position.set(next[i].pos.x*STEP, next[i].pos.y*STEP, next[i].pos.z*STEP);
      next[i].group.rotation.set(0,0,0); next[i].group.quaternion.identity();
    });

    // refresh matrices after reparenting
    root.updateMatrixWorld(true);

    setCubies(next);
    layerG.quaternion.identity();
    layerG.clear();
    root.remove(layerG);
  },[setCubies]);

  const moveToTurn = (mv)=>{
    const m = mv.trim();
    if(!m) return null;
    const base = m[0].toUpperCase();
    const suf = m[1]==="'"?"'":(m[1]==="2"?"2":"");
    const t = suf==="2"?2:1;
    const s = suf==="'"?-1:1;
    if(base==="U") return {axis:"Y",layer:+1,turns: s*t};
    if(base==="D") return {axis:"Y",layer:-1,turns:-s*t};
    if(base==="R") return {axis:"X",layer:+1,turns: s*t};
    if(base==="L") return {axis:"X",layer:-1,turns:-s*t};
    if(base==="F") return {axis:"Z",layer:+1,turns: s*t};
    if(base==="B") return {axis:"Z",layer:-1,turns:-s*t};
    if(base==="M") return {axis:"X",layer:0, turns:-s*t};
    if(base==="E") return {axis:"Y",layer:0, turns:-s*t};
    if(base==="S") return {axis:"Z",layer:0, turns: s*t};
    return null;
  };

  const doMove = useCallback(async (mv)=>{
    const spec = moveToTurn(mv);
    if(!spec) return;
    await applyTurn(spec.axis, spec.layer, spec.turns);
  },[applyTurn]);

  const runQueue = useCallback(async ()=>{
    if(playingRef.current) return;
    playingRef.current = true;
    while(queueRef.current.length){
      // eslint-disable-next-line no-await-in-loop
      await doMove(queueRef.current.shift());
    }
    playingRef.current = false;
  },[doMove]);

  const enqueueMove = useCallback((m)=>{ queueRef.current.push(m); runQueue(); },[runQueue]);

  // keyboard controls
  useEffect(()=>{
    const onKey=(e)=>{
      const k=e.key.toUpperCase();
      if("UDLRFBMES".includes(k)){
        const suf = e.shiftKey ? "'" : (e.altKey||e.metaKey ? "2" : "");
        enqueueMove(k + suf);
      }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[enqueueMove]);

  // scramble on mount
  useEffect(()=>{
    if(!scramble) return;
    const faces=["U","D","L","R","F","B"];
    const suf=["","'","2"];
    const seq=[];
    for(let i=0;i<25;i++){
      let f = faces[(Math.random()*6)|0];
      if(i && f[0]===seq[i-1][0]) f = faces[(faces.indexOf(f)+1)%6];
      seq.push(f + suf[(Math.random()*3)|0]);
    }
    seq.forEach(enqueueMove);
  },[enqueueMove, scramble]);

  const handleAutoSolve = useCallback(()=>setCubies(initialCubies()),[]);
  const handleShuffle  = useCallback(()=>{
    const faces=["U","D","L","R","F","B"];
    const suf=["","'","2"];
    for(let i=0;i<25;i++){
      const f=faces[(Math.random()*6)|0];
      const s=suf[(Math.random()*3)|0];
      enqueueMove(f+s);
    }
  },[enqueueMove]);

  const runAlg = useCallback((alg)=>{
    if(!alg) return;
    alg.trim().split(/\s+/).forEach(enqueueMove);
  },[enqueueMove]);

  return (
    <div className="gc-wrapper" style={{ width:"100%", maxWidth: width, margin:"0 auto" }}>
      <Canvas
        dpr={[1,1.7]}
        gl={{ antialias:true, alpha:true, logarithmicDepthBuffer: true }}
        camera={{ position:[0,0.8,8.2], fov:48, near:0.5, far:80 }}
        onCreated={({ gl })=>{
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        style={{ width:"100%", height }}
      >
        <SceneLights/>
        <FloorShadow/>
        <CubeRoot
          ref={cubeRef}
          cubiesRef={cubiesRef}
          setCubies={setCubies}
          onBindCubieGroup={(i,g)=>{ cubiesRef.current[i].group = g; }}
        />
      </Canvas>

      <div className="gc-controls">
        <button className="gc-btn" onClick={handleAutoSolve}>Auto-Solve</button>
        <button className="gc-btn" onClick={()=>runAlg(detectStep(cubies).alg)}>Guide</button>
        <button className="gc-btn" onClick={handleShuffle}>Scramble</button>
      </div>

      <div className="gc-hint">
        <strong>{hint.title}</strong> — {hint.tip}
      </div>
    </div>
  );
}

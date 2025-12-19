
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Billboard, Html, ContactShadows, Sky } from '@react-three/drei';
import { 
  Backpack, 
  Sprout, 
  DollarSign,
  Shirt,
  X,
  Plane,
  ArrowRight,
  Droplets,
  ShoppingBag,
  Coins,
  LogOut,
  Building2,
  HandCoins,
  Map as MapIcon,
  House as HouseIcon,
  User,
  Navigation
} from 'lucide-react';
import { 
  GRID_SIZE, 
  INITIAL_ITEMS, 
  INITIAL_VILLAGERS,
  POTENTIAL_VILLAGERS,
  FISH_LIST,
  OUTFITS,
  ACCESSORIES,
  SEEDS,
  ITEM_PRICE
} from './constants';
import { 
  GameState, 
  Position, 
  Villager, 
  IslandItem,
  FishingState,
  Fish,
  InventoryItem
} from './types';
import { getVillagerDialogue } from './services/geminiService';

// Helper to convert grid coordinates (0 to GRID_SIZE) to world coordinates (centered at 0)
const toWorld = (p: number) => p - GRID_SIZE / 2;

// --- Specialized NPCs ---

const Blathers = ({ positionOverride, onClick }: { positionOverride: [number, number, number], onClick: () => void }) => {
  const color = "#451a03"; // Brown owl
  const bellyColor = "#fef3c7"; // Cream belly
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle bobbing/swaying
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <group position={positionOverride} ref={groupRef} onClick={onClick}>
      {/* Feet */}
      <mesh position={[-0.1, 0.05, 0]}><boxGeometry args={[0.08, 0.1, 0.12]} /><meshStandardMaterial color="#fbbf24" /></mesh>
      <mesh position={[0.1, 0.05, 0]}><boxGeometry args={[0.08, 0.1, 0.12]} /><meshStandardMaterial color="#fbbf24" /></mesh>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.38, 0.15]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={bellyColor} />
      </mesh>
      {/* Bowtie */}
      <mesh position={[0, 0.55, 0.25]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.32, 0.45, 0]} rotation={[0, 0, 0.2]}><capsuleGeometry args={[0.08, 0.3, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.32, 0.45, 0]} rotation={[0, 0, -0.2]}><capsuleGeometry args={[0.08, 0.3, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      {/* Head */}
      <group position={[0, 0.8, 0]}>
        <mesh castShadow><sphereGeometry args={[0.28, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
        {/* Eyes - Big owl eyes */}
        <mesh position={[-0.12, 0.05, 0.22]}><circleGeometry args={[0.08, 16]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[0.12, 0.05, 0.22]}><circleGeometry args={[0.08, 16]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[-0.12, 0.05, 0.23]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="black" /></mesh>
        <mesh position={[0.12, 0.05, 0.23]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="black" /></mesh>
        {/* Beak */}
        <mesh position={[0, -0.05, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.04, 0.1, 4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      </group>
      <Html position={[0, 1.4, 0]} center>
        <div className="bg-[#451a03] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl border-2 border-[#fbbf24]">Blathers</div>
      </Html>
    </group>
  );
};

const TomNook = ({ positionOverride, onClick }: { positionOverride: [number, number, number], onClick: () => void }) => {
  const color = "#92400e"; // Tanuki brown
  const vestColor = "#166534"; // Green vest
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
  });

  return (
    <group position={positionOverride} ref={groupRef} onClick={onClick}>
      <mesh position={[-0.12, 0.1, 0]}><capsuleGeometry args={[0.1, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.12, 0.1, 0]}><capsuleGeometry args={[0.1, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={vestColor} />
      </mesh>
      <mesh position={[0, 0.25, -0.3]} rotation={[Math.PI / 4, 0, 0]}>
        <capsuleGeometry args={[0.12, 0.35, 4, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-0.35, 0.45, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.07, 0.25, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.35, 0.45, 0]} rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.07, 0.25, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <group position={[0, 0.85, 0]}>
        <mesh castShadow><sphereGeometry args={[0.28, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[-0.2, 0.22, 0]} rotation={[0, 0, 0.3]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.2, 0.22, 0]} rotation={[0, 0, -0.3]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0, 0.2]}>
          <boxGeometry args={[0.45, 0.2, 0.1]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
        <mesh position={[-0.1, 0, 0.26]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[0.1, 0, 0.26]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[0, -0.05, 0.28]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="black" /></mesh>
      </group>
      <Html position={[0, 1.4, 0]} center>
        <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xl border-2 border-white">Tom Nook</div>
      </Html>
    </group>
  );
};

const Isabelle = ({ positionOverride, onClick }: { positionOverride: [number, number, number], onClick: () => void }) => {
  const color = "#fde047"; // Yellow fur
  const vestColor = "#f87171"; // Red/Orange vest
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group position={positionOverride} ref={groupRef} onClick={onClick}>
      <mesh position={[-0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={vestColor} />
      </mesh>
      <mesh position={[0, 0.2, -0.2]} rotation={[Math.PI / 6, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.28, 0.4, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.06, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.28, 0.4, 0]} rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.06, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <group position={[0, 0.75, 0]}>
        <mesh castShadow><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[-0.2, -0.1, 0]} rotation={[0, 0, 0.1]}><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.2, -0.1, 0]} rotation={[0, 0, -0.1]}><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.25, 0]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#ef4444" /></mesh>
        <mesh position={[-0.08, 0.05, 0.22]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="black" /></mesh>
        <mesh position={[0.08, 0.05, 0.22]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color="black" /></mesh>
        <mesh position={[0, 0, 0.25]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="black" /></mesh>
      </group>
      <Html position={[0, 1.3, 0]} center>
        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-xl border-2 border-white">Isabelle</div>
      </Html>
    </group>
  );
};

// --- Buildings ---

const MuseumExterior = ({ item }: { item: IslandItem }) => {
  return (
    <group position={[toWorld(item.position.x), 0, toWorld(item.position.y)]}>
      {/* Foundation/Stairs */}
      <mesh position={[0, 0.1, 1]} castShadow receiveShadow><boxGeometry args={[6.5, 0.2, 3]} /><meshStandardMaterial color="#94a3b8" /></mesh>
      <mesh position={[0, 0.2, 1.2]} castShadow receiveShadow><boxGeometry args={[5, 0.2, 2.5]} /><meshStandardMaterial color="#cbd5e1" /></mesh>
      
      {/* Main Structure */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>
      
      {/* Columns */}
      <mesh position={[-2.2, 1.5, 2.1]}><cylinderGeometry args={[0.2, 0.25, 3]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[2.2, 1.5, 2.1]}><cylinderGeometry args={[0.2, 0.25, 3]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[-0.8, 1.5, 2.1]}><cylinderGeometry args={[0.2, 0.25, 3]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      <mesh position={[0.8, 1.5, 2.1]}><cylinderGeometry args={[0.2, 0.25, 3]} /><meshStandardMaterial color="#e2e8f0" /></mesh>
      
      {/* Roof / Pediment */}
      <group position={[0, 3, 0]}>
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[5.5, 1.5, 4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Front Owl Emblem */}
        <group position={[0, 0.2, 2.01]}>
           <mesh rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.6, 32]} /><meshStandardMaterial color="#fbbf24" /></mesh>
           <Billboard position={[0, 0, 0.02]}><Text fontSize={0.4} color="#451a03">🦉</Text></Billboard>
        </group>
      </group>

      {/* Red Banners */}
      <mesh position={[-2, 1.5, 2.02]}><boxGeometry args={[0.8, 2, 0.05]} /><meshStandardMaterial color="#b91c1c" /></mesh>
      <mesh position={[2, 1.5, 2.02]}><boxGeometry args={[0.8, 2, 0.05]} /><meshStandardMaterial color="#b91c1c" /></mesh>
      
      <Html position={[0, 4.5, 0]} center distanceFactor={12}>
        <div className="bg-slate-800 text-white px-6 py-2 rounded-full shadow-2xl border-4 border-slate-300 whitespace-nowrap backdrop-blur-sm">
          <span className="font-display text-lg tracking-wide uppercase">The Island Museum</span>
        </div>
      </Html>
    </group>
  );
};

const MuseumInterior = ({ onBlathersClick }: { onBlathersClick: () => void }) => {
  return (
    <group>
      {/* Huge Grand Hall Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 6, -15]}><boxGeometry args={[30.5, 12, 0.5]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[-15, 6, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[30, 12, 0.5]} /><meshStandardMaterial color="#1e293b" /></mesh>
      <mesh position={[15, 6, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[30, 12, 0.5]} /><meshStandardMaterial color="#1e293b" /></mesh>
      
      {/* Central Stairs / Hub */}
      <group position={[0, 0, -8]}>
        {/* Central Display Platform */}
        <mesh position={[0, 0.5, 0]} receiveShadow><boxGeometry args={[6, 1, 6]} /><meshStandardMaterial color="#475569" /></mesh>
        <Blathers positionOverride={[0, 1, 0]} onClick={onBlathersClick} />
        
        {/* Fossils Wing Stairs (Down) */}
        <group position={[0, 0, 5]}>
           <mesh position={[0, 0.1, 0]}><boxGeometry args={[4, 0.2, 2]} /><meshStandardMaterial color="#64748b" /></mesh>
           <Billboard position={[0, 0.5, 1]}><Text fontSize={0.5} color="#fbbf24">FOSSILS 🦴</Text></Billboard>
        </group>
        
        {/* Fish/Bug Wings Stairs (Up) */}
        <group position={[-8, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
           <mesh><boxGeometry args={[4, 2, 1]} /><meshStandardMaterial color="#64748b" /></mesh>
           <Billboard position={[0, 2, 0.6]}><Text fontSize={0.5} color="#38bdf8">AQUARIUM 🐟</Text></Billboard>
        </group>
        <group position={[8, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
           <mesh><boxGeometry args={[4, 2, 1]} /><meshStandardMaterial color="#64748b" /></mesh>
           <Billboard position={[0, 2, 0.6]}><Text fontSize={0.5} color="#4ade80">BUG GARDEN 🦋</Text></Billboard>
        </group>
      </group>
      
      {/* Atmospheric Pillars */}
      {[...Array(6)].map((_, i) => (
        <group key={i} position={[i < 3 ? -12 : 12, 4, (i % 3) * 10 - 10]}>
          <mesh><cylinderGeometry args={[0.8, 1, 8]} /><meshStandardMaterial color="#475569" /></mesh>
          <pointLight intensity={0.5} color="#fbbf24" position={[0, 3, 0]} />
        </group>
      ))}

      <Billboard position={[0, 0.1, 12]}><Text fontSize={0.8} color="#f87171">EXIT TO ISLAND</Text></Billboard>
    </group>
  );
};

const TownHallExterior = ({ item }: { item: IslandItem }) => {
  return (
    <group position={[toWorld(item.position.x), 0, toWorld(item.position.y)]}>
      <mesh position={[0, 0.05, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 1, 3]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 0.5, 1.51]}>
        <boxGeometry args={[4, 0.8, 0.05]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <mesh position={[-1.2, 0.6, 1.3]}><cylinderGeometry args={[0.15, 0.15, 1.2]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <mesh position={[1.2, 0.6, 1.3]}><cylinderGeometry args={[0.15, 0.15, 1.2]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <mesh position={[0, 1.4, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.5, 1.2, 4]} />
        <meshStandardMaterial color="#4c1d95" />
      </mesh>
      <group position={[2.5, 0, 1.5]}>
        <mesh position={[0, 1, 0]}><cylinderGeometry args={[0.05, 0.05, 2]} /><meshStandardMaterial color="#94a3b8" /></mesh>
        <mesh position={[0.3, 1.7, 0]}><boxGeometry args={[0.6, 0.4, 0.05]} /><meshStandardMaterial color="#22c55e" /></mesh>
        <Billboard position={[0.3, 1.7, 0.03]}><Text fontSize={0.15} color="white">🍃</Text></Billboard>
      </group>
      <Html position={[0, 2.5, 0]} center distanceFactor={12}>
        <div className="bg-purple-900 text-white px-4 py-1.5 rounded-full shadow-md border-2 border-yellow-400 whitespace-nowrap backdrop-blur-sm">
          <span className="font-display text-sm">Resident Services</span>
        </div>
      </Html>
    </group>
  );
};

const TownHallInterior = ({ onTomNookClick, onIsabelleClick }: { onTomNookClick: () => void, onIsabelleClick: () => void }) => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 3, -7]}><boxGeometry args={[14.2, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[14, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <mesh position={[7, 3, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[14, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <group position={[0, 0.5, -2]}>
        <mesh castShadow><boxGeometry args={[10, 1, 1.5]} /><meshStandardMaterial color="#78350f" /></mesh>
        <group position={[-2.5, 0.5, 0]}>
           <TomNook positionOverride={[0, 0.5, 0]} onClick={onTomNookClick} />
        </group>
        <group position={[2.5, 0.5, 0]}>
           <Isabelle positionOverride={[0, 0.5, 0]} onClick={onIsabelleClick} />
        </group>
      </group>
      <group position={[5.5, 0.6, -6.5]}>
        <mesh castShadow><boxGeometry args={[1.2, 1.2, 0.8]} /><meshStandardMaterial color="#22c55e" /></mesh>
        <mesh position={[0, 0, 0.41]}><planeGeometry args={[0.8, 0.8]} /><meshStandardMaterial color="#bae6fd" /></mesh>
        <Billboard position={[0, 0.7, 0.4]}><Text fontSize={0.2} color="white">ABD</Text></Billboard>
      </group>
      <group position={[-5.5, 0.4, -6.5]}>
        <mesh castShadow><boxGeometry args={[1.2, 0.8, 1.2]} /><meshStandardMaterial color="#78350f" /></mesh>
        <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1, 1]} /><meshStandardMaterial color="#a16207" /></mesh>
        <Billboard position={[0, 0.6, 0]}><Text fontSize={0.3}>📦</Text></Billboard>
      </group>
      <Billboard position={[0, 0.1, 6]}>
        <Text fontSize={0.6} color="#b91c1c">EXIT TO PLAZA</Text>
      </Billboard>
    </group>
  );
};

const NooksCrannyExterior = ({ item }: { item: IslandItem }) => {
  return (
    <group position={[toWorld(item.position.x), 0, toWorld(item.position.y)]}>
      <mesh position={[0, 0.05, 0]}><boxGeometry args={[3, 0.1, 2]} /><meshStandardMaterial color="#78350f" /></mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[2.8, 1, 1.8]} /><meshStandardMaterial color="#fef08a" /></mesh>
      <group position={[0, 1, 0]}>
        <mesh position={[0, 0.1, 0]}><boxGeometry args={[3.2, 0.4, 2.2]} /><meshStandardMaterial color="#1d4ed8" /></mesh>
        <mesh position={[0, 0.35, 0]}><boxGeometry args={[1.5, 0.2, 1.2]} /><meshStandardMaterial color="#1d4ed8" /></mesh>
      </group>
      <group position={[0, 1.2, 0.95]}>
        <mesh><boxGeometry args={[1.8, 0.5, 0.1]} /><meshStandardMaterial color="white" /></mesh>
        <Billboard position={[0, 0, 0.06]}><Text fontSize={0.15} color="#1d4ed8">Nook's Cranny</Text></Billboard>
      </group>
      <group position={[0, 0.4, 0.91]}>
        <mesh><boxGeometry args={[0.8, 0.8, 0.05]} /><meshStandardMaterial color="#b91c1c" /></mesh>
        <Billboard position={[0, 0.3, 0.06]}><Text fontSize={0.3}>🍃</Text></Billboard>
      </group>
      <Html position={[0, 2.2, 0]} center distanceFactor={12}><div className="bg-white/90 px-4 py-1.5 rounded-full shadow-md border-2 border-yellow-400 whitespace-nowrap backdrop-blur-sm"><span className="font-display text-sm text-blue-800">Nook's Cranny Shop</span></div></Html>
    </group>
  );
};

const NooksCrannyInterior = ({ onNephewClick }: { onNephewClick: (name: string) => void }) => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#f8fafc" /></mesh>
      <mesh position={[0, 0.25, -3]}><boxGeometry args={[10, 0.5, 4]} /><meshStandardMaterial color="#2563eb" /></mesh>
      <mesh position={[0, 3, -6]}><boxGeometry args={[12.2, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <mesh position={[-6, 3, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[12, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <mesh position={[6, 3, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[12, 6, 0.2]} /><meshStandardMaterial color="#fefce8" /></mesh>
      <group position={[-4, 0.5, 3]}><mesh castShadow><boxGeometry args={[2.5, 1, 1.2]} /><meshStandardMaterial color="#fbbf24" /></mesh><NookNephew positionOverride={[0, 0.5, 0]} name="Timmy" onClick={() => onNephewClick("Timmy")} /></group>
      <group position={[4, 0.5, 3]}><mesh castShadow><boxGeometry args={[2.5, 1, 1.2]} /><meshStandardMaterial color="#fbbf24" /></mesh><NookNephew positionOverride={[0, 0.5, 0]} name="Tommy" onClick={() => onNephewClick("Tommy")} /></group>
      <Billboard position={[0, 0.1, 5]}><Text fontSize={0.5} color="#b91c1c">EXIT DOOR</Text></Billboard>
    </group>
  );
};

const NookNephew = ({ positionOverride, name, onClick }: { positionOverride: [number, number, number], name: string, onClick: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const color = "#92400e";
  useFrame((state) => { if (groupRef.current) { groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05; groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.05; } });
  return (
    <group position={positionOverride} ref={groupRef} onClick={onClick}>
      <mesh position={[-0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.35, 0]} castShadow><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.35, 0.2]}><planeGeometry args={[0.25, 0.3]} /><meshStandardMaterial color="#fef3c7" /></mesh>
      <Billboard position={[0, 0.35, 0.22]}><Text fontSize={0.1} color="#166534">🍃</Text></Billboard>
      <mesh position={[-0.3, 0.4, 0]} rotation={[0, 0, 0.5]}><capsuleGeometry args={[0.06, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, -0.5]}><capsuleGeometry args={[0.06, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.2, -0.25]} rotation={[Math.PI / 4, 0, 0]}><capsuleGeometry args={[0.1, 0.3, 4, 8]} /><meshStandardMaterial color="#451a03" /></mesh>
      <group position={[0, 0.7, 0]}><mesh castShadow><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color={color} /></mesh><mesh position={[-0.15, 0.18, 0]} rotation={[0, 0, 0.3]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={color} /></mesh><mesh position={[0.15, 0.18, 0]} rotation={[0, 0, -0.3]}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={color} /></mesh><mesh position={[0, 0, 0.15]}><boxGeometry args={[0.35, 0.15, 0.1]} /><meshStandardMaterial color="#3f3f46" /></mesh><mesh position={[-0.08, 0, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="white" /></mesh><mesh position={[0.08, 0, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="white" /></mesh><mesh position={[0, -0.05, 0.22]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="black" /></mesh><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 16]} /><meshStandardMaterial color="white" /></mesh><Billboard position={[0, 0.23, 0]}><Text fontSize={0.1} color="#b91c1c">Nook</Text></Billboard></group>
      <Html position={[0, 1.2, 0]} center><div className="bg-white/90 px-2 py-1 rounded-full shadow text-[10px] font-bold text-blue-800 border border-blue-200">{name}</div></Html>
    </group>
  );
};

const Mable = ({ positionOverride, onClick }: { positionOverride: [number, number, number], onClick: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const color = "#1e40af"; // Hedgehog blue
  useFrame((state) => { 
    if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05; 
  });
  return (
    <group position={positionOverride} ref={groupRef} onClick={onClick}>
      <mesh position={[-0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.1, 0.1, 0]}><capsuleGeometry args={[0.08, 0.15, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.4, 0]} castShadow><sphereGeometry args={[0.25, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 0.2, 0.4 + Math.cos(i) * 0.2, -0.1]} rotation={[0, 0, i]}><coneGeometry args={[0.05, 0.3, 4]} /><meshStandardMaterial color={color} /></mesh>
      ))}
      <group position={[0, 0.75, 0]}>
        <mesh castShadow><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0, 0.15]}><boxGeometry args={[0.3, 0.1, 0.1]} /><meshStandardMaterial color="#3f3f46" /></mesh>
        <mesh position={[-0.08, 0, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
        <mesh position={[0.08, 0, 0.2]}><sphereGeometry args={[0.03, 8, 8]} /><meshStandardMaterial color="white" /></mesh>
      </group>
      <Html position={[0, 1.2, 0]} center><div className="bg-blue-600 text-white px-2 py-0.5 rounded-full shadow text-[10px] font-bold border border-blue-200">Mable</div></Html>
    </group>
  );
};

const AbleSistersShop = ({ item }: { item: IslandItem }) => {
  return (
    <group position={[toWorld(item.position.x), 0, toWorld(item.position.y)]}>
      <mesh position={[0, 0.05, 0]}><boxGeometry args={[3, 0.1, 2.2]} /><meshStandardMaterial color="#78350f" /></mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[2.8, 1.2, 2]} /><meshStandardMaterial color="#fca5a5" /></mesh>
      <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[2.2, 1, 4]} /><meshStandardMaterial color="#166534" /></mesh>
      <group position={[0, 0.5, 1.01]}>
        <mesh><boxGeometry args={[0.8, 0.8, 0.05]} /><meshStandardMaterial color="#b91c1c" /></mesh>
        <Billboard position={[0, 0.2, 0.06]}><Text fontSize={0.3}>👕</Text></Billboard>
      </group>
      <Html position={[0, 2.5, 0]} center distanceFactor={12}><div className="bg-white/90 px-4 py-1.5 rounded-full shadow-md border-2 border-red-400 whitespace-nowrap backdrop-blur-sm"><span className="font-display text-sm text-red-800">Able Sisters Shop</span></div></Html>
    </group>
  );
};

const ShopInterior = ({ onShopkeeperClick }: { onShopkeeperClick: () => void }) => {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow><planeGeometry args={[14, 14]} /><meshStandardMaterial color="#fee2e2" /></mesh>
      <mesh position={[0, 3, -7]}><boxGeometry args={[14.2, 6, 0.2]} /><meshStandardMaterial color="#fff1f2" /></mesh>
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[14, 6, 0.2]} /><meshStandardMaterial color="#fff1f2" /></mesh>
      <mesh position={[7, 3, 0]} rotation={[0, -Math.PI / 2, 0]}><boxGeometry args={[14, 6, 0.2]} /><meshStandardMaterial color="#fff1f2" /></mesh>
      <group position={[-4, 0, -2]}>
        <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[4, 1, 1]} /><meshStandardMaterial color="#991b1b" /></mesh>
        <Billboard position={[-1.2, 1, 0]}><Text fontSize={0.8}>👗</Text></Billboard>
        <Billboard position={[0, 1, 0]}><Text fontSize={0.8}>👕</Text></Billboard>
        <Billboard position={[1.2, 1, 0]}><Text fontSize={0.8}>👔</Text></Billboard>
      </group>
      <group position={[4, 0, 2]}>
        <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[2, 1, 2]} /><meshStandardMaterial color="#991b1b" /></mesh>
        <Mable positionOverride={[0, 0.5, 0]} onClick={onShopkeeperClick} />
      </group>
      <Billboard position={[0, 0.1, 6]}><Text fontSize={0.6} color="#b91c1c">EXIT DOOR</Text></Billboard>
    </group>
  );
};

const House = ({ item }: { item: IslandItem }) => {
  const roofColor = item.color || "#ef4444";
  const wallColor = item.id.includes('player') ? "#ffffff" : (roofColor === '#3b82f6' ? '#e2e8f0' : (roofColor === '#f59e0b' ? '#fff7ed' : '#f3e8ff'));
  return (
    <group position={[toWorld(item.position.x), 0, toWorld(item.position.y)]}>
      <mesh position={[0, 0.05, 0]}><boxGeometry args={[1.4, 0.1, 1.2]} /><meshStandardMaterial color="#94a3b8" /></mesh>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 1.1, 1]} /><meshStandardMaterial color={wallColor} /></mesh>
      <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[1.2, 0.9, 4]} /><meshStandardMaterial color={roofColor} /></mesh>
      <group position={[0, 0.4, 0.51]}>
        <mesh><boxGeometry args={[0.4, 0.75, 0.05]} /><meshStandardMaterial color="#78350f" /></mesh>
        <mesh position={[0.12, -0.05, 0.04]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} /></mesh>
      </group>
      <group position={[-0.35, 0.7, 0.51]}><mesh><boxGeometry args={[0.25, 0.25, 0.04]} /><meshStandardMaterial color="#f8fafc" /></mesh><mesh position={[0, 0, 0.01]}><boxGeometry args={[0.2, 0.2, 0.02]} /><meshStandardMaterial color="#bae6fd" emissive="#bae6fd" emissiveIntensity={0.3} /></mesh></group>
      <group position={[0.35, 0.7, 0.51]}><mesh><boxGeometry args={[0.25, 0.25, 0.04]} /><meshStandardMaterial color="#f8fafc" /></mesh><mesh position={[0, 0, 0.01]}><boxGeometry args={[0.2, 0.2, 0.02]} /><meshStandardMaterial color="#bae6fd" emissive="#bae6fd" emissiveIntensity={0.3} /></mesh></group>
      <mesh position={[0.4, 1.3, -0.2]}><boxGeometry args={[0.25, 0.6, 0.25]} /><meshStandardMaterial color="#b91c1c" /></mesh>
      <group position={[-0.7, 0, 0.5]}><mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.03, 0.03, 0.4]} /><meshStandardMaterial color="#78350f" /></mesh><mesh position={[0, 0.45, 0]}><boxGeometry args={[0.15, 0.2, 0.3]} /><meshStandardMaterial color="#ef4444" /></mesh></group>
      <group position={[0.8, 0, 0.6]}><mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.02, 0.02, 0.6]} /><meshStandardMaterial color="#78350f" /></mesh><mesh position={[0, 0.5, 0]} rotation={[0, 0.2, 0]}><boxGeometry args={[0.4, 0.2, 0.05]} /><meshStandardMaterial color="#d6d3d1" /></mesh><Billboard position={[0, 0.5, 0.06]}><Text fontSize={0.15} color="#451a03">{item.name.split("'")[0]}</Text></Billboard></group>
      <Html position={[0, 1.8, 0]} center distanceFactor={12}><div className="bg-white/80 px-4 py-1.5 rounded-full shadow-md border-2 border-slate-200 whitespace-nowrap backdrop-blur-sm scale-75"><span className="font-display text-sm text-slate-700">{item.name}</span></div></Html>
    </group>
  );
};

const IslandCharacter = ({ 
  villager, 
  isPlayer = false, 
  onClick,
  isFishing = false,
  isWalking = false,
  isWatering = false,
  positionOverride
}: { 
  villager: Partial<Villager>, 
  isPlayer?: boolean, 
  onClick?: () => void,
  isFishing?: boolean,
  isWalking?: boolean,
  isWatering?: boolean,
  positionOverride?: [number, number, number]
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  const prevPos = useRef<Position>(villager.position || {x:0, y:0});
  const rotationY = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    if (villager.position && (Math.abs(villager.position.x - prevPos.current.x) > 0.01 || Math.abs(villager.position.y - prevPos.current.y) > 0.01)) {
      const dx = villager.position.x - prevPos.current.x;
      const dy = villager.position.y - prevPos.current.y;
      const targetRotation = Math.atan2(dx, dy);
      let diff = targetRotation - rotationY.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      rotationY.current += diff * 0.15;
      groupRef.current.rotation.y = rotationY.current;
      prevPos.current = { ...villager.position };
    }

    if (isWalking && !isFishing) {
      const t = state.clock.elapsedTime * 10;
      const swing = Math.sin(t) * 0.4;
      const bounce = Math.abs(Math.cos(t)) * 0.08;
      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.8;
      if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.8;
      if (bodyRef.current) { 
        bodyRef.current.position.y = bounce; 
        bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.05; 
      }
      if (headRef.current) headRef.current.position.y = 0.85 + bounce * 0.5;
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.2);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.2);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, (isFishing || isWatering) ? -0.8 : 0, 0.2);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, (isFishing || isWatering) ? 0.8 : -0.3, 0.2);
      if (bodyRef.current) bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0, 0.2);
    }
  });
  
  const getColor = () => {
    if (typeof villager.color === 'string' && villager.color.startsWith('#')) return villager.color;
    const species = villager.species?.toLowerCase();
    if (species === 'cat') return '#a78bfa';
    if (species === 'dog') return '#fbbf24';
    if (species === 'eagle') return '#374151';
    if (species === 'bear') return '#92400e';
    if (species === 'rabbit') return '#f472b6';
    if (species === 'hedgehog') return '#1e40af';
    if (species === 'mouse') return '#94a3b8';
    if (species === 'frog') return '#4ade80';
    if (species === 'duck') return '#1e3a8a';
    if (species === 'alligator') return '#166534';
    if (species === 'human') return '#fecaca';
    return '#f5f5f5';
  };

  const worldPos: [number, number, number] = positionOverride || [
    toWorld(villager.position?.x ?? 0), 
    0, 
    toWorld(villager.position?.y ?? 0)
  ];

  const species = villager.species?.toLowerCase();
  const color = getColor();

  return (
    <group position={worldPos} onClick={onClick} ref={groupRef}>
      <group ref={bodyRef}>
        <mesh position={[-0.15, 0.15, 0]} castShadow ref={leftLegRef}><capsuleGeometry args={[0.1, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.15, 0.15, 0]} castShadow ref={rightLegRef}><capsuleGeometry args={[0.1, 0.2, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.45, 0]} castShadow><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[-0.38, 0.45, 0]} rotation={[0, 0, (isFishing || isWatering) ? -0.8 : 0.3]} castShadow ref={leftArmRef}><capsuleGeometry args={[0.08, 0.25, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0.38, 0.45, 0]} rotation={[0, 0, (isFishing || isWatering) ? 0.8 : -0.3]} castShadow ref={rightArmRef}><capsuleGeometry args={[0.08, 0.25, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
        <mesh position={[0, 0.85, 0]} castShadow ref={headRef}><sphereGeometry args={[0.3, 16, 16]} /><meshStandardMaterial color={species === 'eagle' ? '#ffffff' : color} /></mesh>
        
        {/* Species specific features */}
        {species === 'cat' && (
          <group position={[0, 0.85, 0]}>
            <mesh position={[-0.2, 0.25, 0]} rotation={[0.2, 0, 0.2]}><coneGeometry args={[0.1, 0.25, 4]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0.2, 0.25, 0]} rotation={[0.2, 0, -0.2]}><coneGeometry args={[0.1, 0.25, 4]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
        {species === 'rabbit' && (
          <group position={[0, 0.85, 0]}>
            <mesh position={[-0.12, 0.4, 0]} rotation={[0.1, 0, 0]}><capsuleGeometry args={[0.08, 0.4, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0.12, 0.4, 0]} rotation={[0.1, 0, 0]}><capsuleGeometry args={[0.08, 0.4, 4, 8]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
        {species === 'mouse' && (
          <group position={[0, 0.85, 0]}>
            <mesh position={[-0.28, 0.25, 0]} rotation={[0, 0, 0.4]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0.28, 0.25, 0]} rotation={[0, 0, -0.4]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
        {species === 'bear' && (
          <group position={[0, 0.85, 0]}>
            <mesh position={[-0.2, 0.22, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0.2, 0.22, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
        {species === 'duck' && (
          <group position={[0, 0.75, 0.22]}>
            <mesh><boxGeometry args={[0.35, 0.1, 0.25]} /><meshStandardMaterial color="#fb923c" /></mesh>
          </group>
        )}
        {species === 'frog' && (
          <group position={[0, 0.85, 0]}>
            <mesh position={[-0.15, 0.2, 0.1]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[0.15, 0.2, 0.1]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color={color} /></mesh>
          </group>
        )}
        {species === 'alligator' && (
          <group position={[0, 0.78, 0.25]}>
            <mesh><boxGeometry args={[0.35, 0.2, 0.45]} /><meshStandardMaterial color={color} /></mesh>
            <mesh position={[-0.08, 0.1, 0.2]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#000" opacity={0.5} transparent /></mesh>
            <mesh position={[0.08, 0.1, 0.2]}><sphereGeometry args={[0.02, 8, 8]} /><meshStandardMaterial color="#000" opacity={0.5} transparent /></mesh>
          </group>
        )}

        <Billboard position={[0, 0.85, 0.31]}><Text fontSize={0.4} anchorX="center" anchorY="middle">{villager.icon}</Text></Billboard>
        {villager.outfit && <Billboard position={[0, 0.45, 0.36]}><Text fontSize={0.25}>{villager.outfit}</Text></Billboard>}
      </group>
      {!isPlayer && <Html position={[0, 1.6, 0]} center distanceFactor={10}><div className="bg-white/90 px-3 py-1 rounded-full shadow-lg border-2 border-orange-200 whitespace-nowrap"><span className="font-bold text-xs text-orange-800 uppercase tracking-tighter">{villager.name}</span></div></Html>}
    </group>
  );
};

// --- Main World ---

const World = ({ gameState, onVillagerClick, fishingState, isTransitioning, isWatering, onShopkeeperClick, onNephewClick, onTomNookClick, onIsabelleClick, onBlathersClick }: { gameState: GameState, onVillagerClick: (v: Villager) => void, fishingState: FishingState, isTransitioning: boolean, isWatering: boolean, onShopkeeperClick: () => void, onNephewClick: (name: string) => void, onTomNookClick: () => void, onIsabelleClick: () => void, onBlathersClick: () => void }) => {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[20, 30, 20]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
      <Sky sunPosition={[10, 5, 10]} />
      
      {isTransitioning && <group position={[0, 8, -10]} rotation={[0, 0, 0]}><mesh><boxGeometry args={[1, 0.5, 3]} /><meshStandardMaterial color="#fbbf24" /></mesh></group>}

      {gameState.location === 'shop' ? (
        <ShopInterior onShopkeeperClick={onShopkeeperClick} />
      ) : gameState.location === 'nook_cranny' ? (
        <NooksCrannyInterior onNephewClick={onNephewClick} />
      ) : gameState.location === 'resident_services' ? (
        <TownHallInterior onTomNookClick={onTomNookClick} onIsabelleClick={onIsabelleClick} />
      ) : gameState.location === 'museum' ? (
        <MuseumInterior onBlathersClick={onBlathersClick} />
      ) : (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
            <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
            <meshStandardMaterial color={gameState.location === 'main' ? "#81c784" : "#aed581"} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#4fc3f7" transparent opacity={0.6} />
          </mesh>
          {gameState.islandItems.map(item => {
            const pos: [number, number, number] = [toWorld(item.position.x), 0, toWorld(item.position.y)];
            if (item.type === 'tree') return <group key={item.id} position={pos}><mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.15, 0.2, 1, 8]} /><meshStandardMaterial color="#5d4037" /></mesh><mesh position={[0, 1.2, 0]}><sphereGeometry args={[0.6, 8, 8]} /><meshStandardMaterial color="#2e7d32" /></mesh></group>;
            if (item.type === 'house') return <House key={item.id} item={item} />;
            if (item.type === 'shop') return <AbleSistersShop key={item.id} item={item} />;
            if (item.type === 'general_store') return <NooksCrannyExterior key={item.id} item={item} />;
            if (item.type === 'town_hall') return <TownHallExterior key={item.id} item={item} />;
            if (item.type === 'museum') return <MuseumExterior key={item.id} item={item} />;
            return <group key={item.id} position={pos}><Billboard><Text fontSize={0.4} position={[0, 0.2, 0]}>{item.icon}</Text></Billboard></group>;
          })}
          {gameState.location === 'main' && gameState.villagers.map(v => (
            <IslandCharacter 
              key={v.id} 
              villager={v} 
              onClick={() => onVillagerClick(v)} 
              isWalking={v.targetPosition !== undefined}
            />
          ))}
        </>
      )}

      <IslandCharacter 
        villager={{ position: gameState.playerPos, icon: '🧑‍🌾', color: 'bg-white', species: 'Human', outfit: gameState.playerOutfit, accessory: gameState.playerAccessory }} 
        isPlayer isWalking={false} isWatering={isWatering}
      />
      <ContactShadows resolution={1024} scale={30} blur={2} opacity={0.3} far={1} color="#000000" />
    </>
  );
};

const CameraController = ({ target }: { target: Position }) => {
  const { camera } = useThree();
  useFrame(() => {
    const idealOffset = new THREE.Vector3(0, 10, 10);
    const targetPos = new THREE.Vector3(toWorld(target.x), 0, toWorld(target.y));
    const idealCameraPos = targetPos.clone().add(idealOffset);
    camera.position.lerp(idealCameraPos, 0.05);
    camera.lookAt(targetPos);
  });
  return null;
};

const VillagerController = ({ setGameState, location }: { setGameState: React.Dispatch<React.SetStateAction<GameState>>, location: string }) => {
  useFrame((state, delta) => {
    if (location !== 'main') return;
    
    setGameState(prev => {
      let changed = false;
      const newVillagers = prev.villagers.map(v => {
        if (v.targetPosition) {
          const dx = v.targetPosition.x - v.position.x;
          const dy = v.targetPosition.y - v.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const speed = delta * 1.5;

          if (dist < speed) {
            changed = true;
            return { ...v, position: { ...v.targetPosition }, targetPosition: undefined };
          } else {
            changed = true;
            return { 
              ...v, 
              position: { 
                x: v.position.x + (dx / dist) * speed, 
                y: v.position.y + (dy / dist) * speed 
              } 
            };
          }
        }
        
        if (!v.targetPosition && Math.random() < 0.005) {
          const randX = Math.max(2, Math.min(GRID_SIZE - 2, v.position.x + (Math.random() - 0.5) * 10));
          const randY = Math.max(2, Math.min(GRID_SIZE - 2, v.position.y + (Math.random() - 0.5) * 10));
          changed = true;
          return { ...v, targetPosition: { x: randX, y: randY } };
        }

        return v;
      });

      if (!changed) return prev;
      return { ...prev, villagers: newVillagers };
    });
  });
  return null;
};

// --- Map Component ---

const MapOverlay = ({ gameState, onClose }: { gameState: GameState, onClose: () => void }) => {
  const mapGridSize = 20; // Visual segments
  
  return (
    <div className="fixed inset-0 z-[150] bg-[#89d9d9]/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col items-center">
        
        {/* Top Header */}
        <div className="w-full flex justify-center mb-6">
          <div className="bg-[#fde047] px-12 py-3 rounded-full shadow-[0_4px_0_#ca8a04] border-4 border-white flex items-center gap-3">
            <span className="font-display text-4xl text-[#854d0e] tracking-tight">Horizonia</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex gap-6 overflow-hidden">
          
          {/* Left Side: Residents */}
          <div className="w-64 bg-white/40 rounded-[2.5rem] p-6 border-4 border-white flex flex-col shadow-inner">
            <h3 className="font-display text-2xl text-[#1e4e4e] text-center mb-4 pb-2 border-b-2 border-[#1e4e4e]/20">Residents</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                {/* Player */}
                <div className="flex flex-col items-center gap-1 group">
                   <div className="w-16 h-16 rounded-[1.2rem] bg-white border-4 border-[#fbbf24] shadow-md flex items-center justify-center text-4xl group-hover:scale-105 transition-transform cursor-pointer relative">
                    🧑‍🌾
                    <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full shadow"><Navigation size={12} className="text-blue-500 fill-blue-500" /></div>
                   </div>
                   <span className="text-xs font-bold text-[#1e4e4e] uppercase truncate w-full text-center">Me</span>
                </div>
                {/* Villagers */}
                {gameState.villagers.map(v => (
                  <div key={v.id} className="flex flex-col items-center gap-1 group">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-white border-4 border-slate-200 shadow-md flex items-center justify-center text-4xl group-hover:scale-105 transition-transform cursor-pointer">
                      {v.icon}
                    </div>
                    <span className="text-xs font-bold text-[#1e4e4e] uppercase truncate w-full text-center">{v.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Map Area */}
          <div className="flex-1 bg-[#86efac]/30 rounded-[3rem] border-8 border-white p-4 relative shadow-2xl overflow-hidden flex items-center justify-center">
             {/* Map Grid */}
             <div 
              className="relative aspect-square w-full h-full max-w-[600px] bg-[#dcfce7] rounded-3xl overflow-hidden shadow-inner border-2 border-[#166534]/10"
              style={{
                backgroundImage: `linear-gradient(#16653422 1px, transparent 1px), linear-gradient(90deg, #16653422 1px, transparent 1px)`,
                backgroundSize: `${100 / mapGridSize}% ${100 / mapGridSize}%`
              }}
             >
                {/* Coastal Rocks / Sand Trim */}
                <div className="absolute inset-0 border-[15px] border-[#fde68a]/50 pointer-events-none rounded-3xl"></div>
                
                {/* Island Items (Houses, Shops, Trees) */}
                {gameState.islandItems.map(item => {
                  const xPerc = (item.position.x / GRID_SIZE) * 100;
                  const yPerc = (item.position.y / GRID_SIZE) * 100;
                  return (
                    <div 
                      key={item.id} 
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-2xl drop-shadow-md z-10"
                      style={{ left: `${xPerc}%`, top: `${yPerc}%` }}
                    >
                      {item.type === 'house' ? '🏠' : 
                       item.type === 'shop' ? '👕' : 
                       item.type === 'general_store' ? '🍃' : 
                       item.type === 'town_hall' ? '🏛️' : 
                       item.type === 'museum' ? '🦉' :
                       item.type === 'tree' ? '🌳' : item.icon}
                    </div>
                  );
                })}

                {/* Villagers on Map */}
                {gameState.villagers.map(v => (
                   <div 
                    key={v.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-slate-400 rounded-full flex items-center justify-center text-lg z-20 shadow-lg animate-bounce"
                    style={{ left: `${(v.position.x / GRID_SIZE) * 100}%`, top: `${(v.position.y / GRID_SIZE) * 100}%` }}
                   >
                    {v.icon}
                   </div>
                ))}

                {/* Player on Map */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-[#fbbf24] rounded-full flex items-center justify-center text-2xl z-30 shadow-2xl ring-4 ring-white/50"
                  style={{ left: `${(gameState.playerPos.x / GRID_SIZE) * 100}%`, top: `${(gameState.playerPos.y / GRID_SIZE) * 100}%` }}
                >
                  🧑‍🌾
                </div>
             </div>

             {/* Map Labels / Legend Overlay */}
             <div className="absolute bottom-10 right-10 bg-white/80 p-3 rounded-2xl border-2 border-[#1e4e4e]/10 backdrop-blur">
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-blue-400 rounded-full"></div> <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4e4e]">Airfield</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div> <span className="text-[10px] font-bold uppercase tracking-widest text-[#1e4e4e]">Residential</span></div>
             </div>
          </div>

          {/* Right Side: Legend / Buildings */}
          <div className="w-64 flex flex-col gap-4">
             {[
               { icon: '🏛️', name: 'Town Hall', color: 'bg-purple-100' },
               { icon: '🍃', name: "Nook's Cranny", color: 'bg-yellow-100' },
               { icon: '🦉', name: 'Museum', color: 'bg-slate-100' },
               { icon: '👕', name: 'Able Sisters', color: 'bg-red-100' },
               { icon: '✈️', name: 'Dodo Airlines', color: 'bg-blue-100' }
             ].map(b => (
               <div key={b.name} className={`flex items-center gap-4 p-4 ${b.color} rounded-[2rem] border-4 border-white shadow-sm hover:scale-105 transition-transform cursor-help`}>
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm">{b.icon}</div>
                 <span className="font-display text-sm text-[#1e4e4e]">{b.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="mt-8 flex gap-4">
          <button className="bg-[#f8fafc] px-8 py-3 rounded-full shadow-[0_4px_0_#94a3b8] border-2 border-white flex items-center gap-2 hover:bg-white transition-colors">
            <Navigation size={20} className="text-[#1e4e4e]" />
            <span className="font-display text-[#1e4e4e]">Minimap</span>
          </button>
          <button onClick={onClose} className="bg-[#f8fafc] px-8 py-3 rounded-full shadow-[0_4px_0_#94a3b8] border-2 border-white flex items-center gap-2 hover:bg-white transition-colors">
            <X size={20} className="text-red-500" />
            <span className="font-display text-[#1e4e4e]">Close</span>
          </button>
        </div>

      </div>
    </div>
  );
};

// --- App Root ---

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    playerPos: { x: GRID_SIZE / 2, y: GRID_SIZE / 2 },
    islandItems: INITIAL_ITEMS,
    inventory: [
      { id: 'inv_shovel', name: 'Shovel', icon: '⛏️', count: 1, type: 'tool' },
      { id: 'inv_can', name: 'Watering Can', icon: '💧', count: 1, type: 'tool' },
      { id: 'inv_tomato_seed', name: 'Tomato Seeds', icon: '🍅', count: 5, type: 'seed' }
    ],
    villagers: INITIAL_VILLAGERS,
    dayTime: 'noon',
    bells: 5000,
    location: 'main',
    ownedOutfits: ['👕', '👗'],
    ownedAccessories: [],
    playerOutfit: '👕',
    playerAccessory: ''
  });

  const [activeVillager, setActiveVillager] = useState<Villager | null>(null);
  const [dialogue, setDialogue] = useState<{text: string, emotion: string} | null>(null);
  const [isDialogueLoading, setIsDialogueLoading] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showShopUI, setShowShopUI] = useState(false);
  const [isWatering, setIsWatering] = useState(false);
  const [fishingState] = useState<FishingState>({ status: 'idle' });

  const enterLocation = (loc: 'shop' | 'nook_cranny' | 'resident_services' | 'museum') => {
    setIsTransitioning(true);
    setTimeout(() => {
      let startPos = { x: 6, y: 11 };
      if (loc === 'museum') startPos = { x: 15, y: 25 }; // Main entrance of grand hall
      setGameState(prev => ({ ...prev, location: loc, playerPos: startPos }));
      setIsTransitioning(false);
    }, 1000);
  };

  const leaveLocation = () => {
    setIsTransitioning(true);
    const prevLocation = gameState.location;
    setTimeout(() => {
      let exitPos = { x: 15, y: 15 };
      if (prevLocation === 'shop') exitPos = { x: 22, y: 24 };
      if (prevLocation === 'nook_cranny') exitPos = { x: 8, y: 14 };
      if (prevLocation === 'resident_services') exitPos = { x: 15, y: 11 };
      if (prevLocation === 'museum') exitPos = { x: 24, y: 18 };
      setGameState(prev => ({ ...prev, location: 'main', playerPos: exitPos }));
      setIsTransitioning(false);
    }, 1000);
  };

  const interact = async () => {
    if (isTransitioning || isMenuOpen || showMap) return;
    const { playerPos, location, islandItems, villagers } = gameState;
    
    if (location !== 'main') {
      let exitCheck = false;
      if (location === 'museum') {
        const distToExit = Math.sqrt(Math.pow(15 - playerPos.x, 2) + Math.pow(30 - playerPos.y, 2));
        if (distToExit < 4) exitCheck = true;
      } else {
        const distToExit = Math.sqrt(Math.pow(6 - playerPos.x, 2) + Math.pow(12 - playerPos.y, 2));
        if (distToExit < 2.5) exitCheck = true;
      }
      
      if (exitCheck) { leaveLocation(); return; }

      if (location === 'resident_services') {
        const distToNook = Math.sqrt(Math.pow(3.5 - playerPos.x, 2) + Math.pow(8.5 - playerPos.y, 2));
        const distToIsabelle = Math.sqrt(Math.pow(8.5 - playerPos.x, 2) + Math.pow(8.5 - playerPos.y, 2));
        if (distToNook < 2) { alert("Tom Nook: Hello! Thinking about island infrastructure, yes yes?"); return; }
        if (distToIsabelle < 2) { alert("Isabelle: Hello there! I'm here to help with your island's rating!"); return; }
      }
      
      if (location === 'shop') {
        const distToMable = Math.sqrt(Math.pow(4 - playerPos.x, 2) + Math.pow(2 - playerPos.y, 2));
        if (distToMable < 2) { setShowShopUI(true); return; }
      }

      if (location === 'museum') {
        const distToBlathers = Math.sqrt(Math.pow(15 - playerPos.x, 2) + Math.pow(22 - playerPos.y, 2));
        if (distToBlathers < 2.5) { 
           setActiveVillager({ id: 'blathers', name: 'Blathers', species: 'Owl', personality: 'normal', position: {x: 15, y: 22}, icon: '🦉', color: '#451a03' });
           setIsDialogueLoading(true);
           getVillagerDialogue({ id: 'blathers', name: 'Blathers', species: 'Owl', personality: 'normal', position: {x: 15, y: 22}, icon: '🦉', color: '#451a03' }, "Tell me about the museum!").then(r => { setDialogue(r); setIsDialogueLoading(false); });
           return; 
        }
      }
    } else {
      const nearbyAble = islandItems.find(i => i.type === 'shop' && Math.sqrt(Math.pow(i.position.x - playerPos.x, 2) + Math.pow(i.position.y - playerPos.y, 2)) < 3);
      if (nearbyAble) { enterLocation('shop'); return; }

      const nearbyNook = islandItems.find(i => i.type === 'general_store' && Math.sqrt(Math.pow(i.position.x - playerPos.x, 2) + Math.pow(i.position.y - playerPos.y, 2)) < 3);
      if (nearbyNook) { enterLocation('nook_cranny'); return; }

      const nearbyTownHall = islandItems.find(i => i.type === 'town_hall' && Math.sqrt(Math.pow(i.position.x - playerPos.x, 2) + Math.pow(i.position.y - playerPos.y, 2)) < 4);
      if (nearbyTownHall) { enterLocation('resident_services'); return; }
      
      const nearbyMuseum = islandItems.find(i => i.type === 'museum' && Math.sqrt(Math.pow(i.position.x - playerPos.x, 2) + Math.pow(i.position.y - playerPos.y, 2)) < 5);
      if (nearbyMuseum) { enterLocation('museum'); return; }

      const nearbyVillager = villagers.find(v => Math.sqrt(Math.pow(v.position.x - playerPos.x, 2) + Math.pow(v.position.y - playerPos.y, 2)) < 1.5);
      if (nearbyVillager) { setActiveVillager(nearbyVillager); setIsDialogueLoading(true); getVillagerDialogue(nearbyVillager).then(r => { setDialogue(r); setIsDialogueLoading(false); }); return; }
    }
  };

  const movePlayer = (dx: number, dy: number) => {
    if (isMenuOpen || isTransitioning || showInventory || showWardrobe || showShopUI || showMap) return;
    setGameState(prev => {
      const nextX = prev.playerPos.x + dx * 0.7;
      const nextY = prev.playerPos.y + dy * 0.7;
      if (nextX < 0 || nextX > GRID_SIZE || nextY < 0 || nextY > GRID_SIZE) return prev;
      return { ...prev, playerPos: { x: nextX, y: nextY } };
    });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch(e.key.toLowerCase()) {
      case 'w': movePlayer(0, -1); break;
      case 's': movePlayer(0, 1); break;
      case 'a': movePlayer(-1, 0); break;
      case 'd': movePlayer(1, 0); break;
      case 'e': setShowInventory(p => !p); break;
      case 'm': setShowMap(p => !p); break;
      case 'f': interact(); break;
    }
  }, [gameState.playerPos, isTransitioning, isMenuOpen, showInventory, showWardrobe, showShopUI, showMap]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="w-full h-full relative bg-sky-200 overflow-hidden">
      <Canvas shadows camera={{ fov: 45, position: [0, 15, 20] }}>
        <World 
          gameState={gameState} 
          fishingState={fishingState} 
          isTransitioning={isTransitioning} 
          isWatering={isWatering} 
          onVillagerClick={(v) => { setActiveVillager(v); setIsDialogueLoading(true); getVillagerDialogue(v).then(r => { setDialogue(r); setIsDialogueLoading(false); }); }} 
          onShopkeeperClick={() => setShowShopUI(true)} 
          onNephewClick={(n) => alert(`${n}: Welcome, yes yes!`)}
          onTomNookClick={() => alert("Tom Nook: Ready to expand your home?")}
          onIsabelleClick={() => alert("Isabelle: How can I help you today?")}
          onBlathersClick={() => {
             setActiveVillager({ id: 'blathers', name: 'Blathers', species: 'Owl', personality: 'normal', position: {x: 15, y: 22}, icon: '🦉', color: '#451a03' });
             setIsDialogueLoading(true);
             getVillagerDialogue({ id: 'blathers', name: 'Blathers', species: 'Owl', personality: 'normal', position: {x: 15, y: 22}, icon: '🦉', color: '#451a03' }, "Tell me about the museum!").then(r => { setDialogue(r); setIsDialogueLoading(false); });
          }}
        />
        <VillagerController setGameState={setGameState} location={gameState.location} />
        {!isMenuOpen && <CameraController target={gameState.playerPos} />}
        {isMenuOpen && <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />}
      </Canvas>

      {isTransitioning && <div className="fixed inset-0 z-[200] bg-sky-400 flex flex-col items-center justify-center text-white animate-pulse"><Plane size={100} className="animate-bounce" /><h2 className="text-4xl font-display mt-8">Transitioning...</h2></div>}

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-sky-100/30 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}>
          <div className="text-center transform -rotate-2"><h1 className="text-8xl md:text-9xl font-display text-[#d97706] drop-shadow-[0_5px_0_white] filter saturate-150">ISLAND<br/>HORIZONS</h1><div className="text-3xl font-display text-green-600 mt-2">The Museum is open! Visit Blathers!</div></div>
          <div className="mt-12 flex items-center gap-4 bg-black/10 px-6 py-3 rounded-full animate-pulse text-white font-bold"><ArrowRight /> Click to Start</div>
        </div>
      )}

      {showMap && <MapOverlay gameState={gameState} onClose={() => setShowMap(false)} />}

      {!isMenuOpen && !isTransitioning && !showMap && (
        <>
          <div className="fixed top-6 left-6 flex flex-col gap-4">
            <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-3xl shadow-xl border-4 border-green-400/20 flex items-center gap-3"><DollarSign className="text-green-600" /><span className="font-display text-2xl text-green-800">{gameState.bells}</span></div>
          </div>

          <div className="fixed bottom-10 inset-x-0 flex justify-center">
            <div className="bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl flex items-center gap-6 border-4 border-white">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">WASD move • F act • M map</div>
              <button onClick={interact} className="bg-green-500 text-white px-6 py-2 rounded-full font-display hover:bg-green-600 transition-all active:scale-95 shadow-lg">Interact</button>
              <button onClick={() => setShowMap(true)} className="flex items-center gap-2 hover:text-teal-600"><MapIcon size={20} /> <span className="text-sm font-bold">Map</span></button>
              <button onClick={() => setShowInventory(true)} className="flex items-center gap-2 hover:text-green-600"><Backpack size={20} /> <span className="text-sm font-bold">Pack</span></button>
              <button onClick={() => setShowWardrobe(true)} className="flex items-center gap-2 text-orange-600"><Shirt size={20} /> <span className="text-sm font-bold">Style</span></button>
              {gameState.location !== 'main' && <button onClick={leaveLocation} className="bg-orange-500 text-white px-6 py-2 rounded-full font-display flex items-center gap-2 shadow-lg"><LogOut size={16} /> Exit</button>}
            </div>
          </div>

          {activeVillager && (
            <div className="fixed inset-0 z-50 flex items-end justify-center pb-20 p-6 bg-black/20 backdrop-blur-sm">
              <div className="max-w-2xl w-full bg-[#fdf6e3] rounded-[3rem] p-10 shadow-2xl border-b-[12px] border-orange-200 animate-in slide-in-from-bottom duration-500">
                <div className="absolute -top-12 left-10 flex items-center gap-4"><div className="w-24 h-24 rounded-full flex items-center justify-center text-6xl border-8 border-white shadow-2xl bg-white">{activeVillager.icon}</div><div className="bg-orange-500 text-white px-8 py-3 rounded-full font-display text-2xl shadow-xl border-4 border-white">{activeVillager.name}</div></div>
                <div className="mt-8 text-3xl text-slate-800 font-medium h-32 flex items-center leading-tight">{isDialogueLoading ? "..." : `"${dialogue?.text}"`}</div>
                <div className="mt-10 flex justify-end gap-4"><button onClick={() => setActiveVillager(null)} className="bg-orange-500 text-white px-10 py-4 rounded-3xl font-display text-xl">Bye!</button></div>
              </div>
            </div>
          )}
        </>
      )}

      {showInventory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-8"><h2 className="text-4xl text-slate-800 font-display">Backpack</h2><button onClick={() => setShowInventory(false)} className="p-2 hover:text-red-500"><X size={24} /></button></div>
            <div className="grid grid-cols-4 gap-4">{gameState.inventory.map(item => (<div key={item.id} className="aspect-square bg-slate-50 rounded-3xl flex items-center justify-center relative hover:bg-green-50 group"><span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span><span className="absolute bottom-2 right-3 text-xs font-bold text-slate-400">x{item.count}</span></div>))}</div>
          </div>
        </div>
      )}
      
      {showWardrobe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
          <div className="bg-orange-50 rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl border-8 border-orange-200">
             <div className="flex justify-between items-center mb-8"><h2 className="text-4xl text-orange-800 font-display">Wardrobe</h2><button onClick={() => setShowWardrobe(false)} className="p-2 hover:text-red-500"><X size={24} /></button></div>
             <div className="grid grid-cols-3 gap-4">{gameState.ownedOutfits.map(o => <button key={o} onClick={() => setGameState(g => ({...g, playerOutfit: o}))} className={`p-4 bg-white rounded-2xl text-4xl border-4 ${gameState.playerOutfit === o ? 'border-orange-500' : 'border-transparent'}`}>{o}</button>)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

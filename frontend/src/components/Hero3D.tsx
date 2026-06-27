import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, Ring } from '@react-three/drei'
import * as THREE from 'three'

function BoucleDore() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3
      ref.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })
  return (
    <Ring ref={ref} args={[1.2, 1.6, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.1} />
    </Ring>
  )
}

function SphereMagique() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3
    }
  })
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={ref} args={[1, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.1}
          distort={0.35}
          speed={2}
          emissive="#8B6914"
          emissiveIntensity={0.3}
        />
      </Sphere>
    </Float>
  )
}

function Orbite({ rayon, vitesse, couleur }: { rayon: number, vitesse: number, couleur: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = Math.cos(state.clock.elapsedTime * vitesse) * rayon
      ref.current.position.z = Math.sin(state.clock.elapsedTime * vitesse) * rayon
      ref.current.position.y = Math.sin(state.clock.elapsedTime * vitesse * 0.5) * 0.5
    }
  })
  return (
    <Sphere ref={ref} args={[0.12, 16, 16]}>
      <meshStandardMaterial color={couleur} metalness={1} roughness={0} emissive={couleur} emissiveIntensity={0.5} />
    </Sphere>
  )
}

export default function Hero3D() {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#D4AF37" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#C45C26" />
        <pointLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <SphereMagique />
        <BoucleDore />
        <Orbite rayon={2.5} vitesse={0.8} couleur="#D4AF37" />
        <Orbite rayon={2.5} vitesse={-0.6} couleur="#C45C26" />
        <Orbite rayon={2.5} vitesse={1.2} couleur="#2D6A4F" />
        <Orbite rayon={3.2} vitesse={0.4} couleur="#F0C040" />
        <Orbite rayon={3.2} vitesse={-0.9} couleur="#E07030" />
      </Canvas>
    </div>
  )
}

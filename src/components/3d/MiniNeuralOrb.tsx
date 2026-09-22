import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MiniNeuralOrbProps {
  className?: string;
  size?: number;
}

export const MiniNeuralOrb: React.FC<MiniNeuralOrbProps> = ({ className = '', size = 48 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.IcosahedronGeometry(1, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', geo.attributes.position);
    const nodesMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.15,
      transparent: true,
      opacity: 0.9,
    });
    const nodes = new THREE.Points(nodesGeo, nodesMat);
    group.add(nodes);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        group.rotation.y += 0.015;
        group.rotation.x += 0.008;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      geo.dispose();
      mat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size, prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className={`inline-block pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};

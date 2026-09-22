import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NeuralOrbProps {
  className?: string;
}

export const NeuralOrb: React.FC<NeuralOrbProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse parallax and rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Outer Neural Mesh (Icosahedron Wireframe)
    const icosahedronGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeMesh = new THREE.Mesh(icosahedronGeo, wireframeMat);
    mainGroup.add(wireframeMesh);

    // 2. Neural Nodes (Points on vertices)
    const vertices = icosahedronGeo.attributes.position.array;
    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.09,
      transparent: true,
      opacity: 0.9,
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    mainGroup.add(nodes);

    // 3. Inner Core Sphere (Translucent glowing core)
    const coreGeo = new THREE.SphereGeometry(0.75, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 4. Orbiting Particle Cloud (Neural pulses)
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const radius = 1.9;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius + (Math.random() - 0.5) * 0.4;

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particles);

    // 5. Ambient and Point Lights for subtle highlights
    const pointLight = new THREE.PointLight(0x3b82f6, 1.5, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 1.2, 10);
    cyanLight.position.set(-2, -2, 2);
    scene.add(cyanLight);

    // Mouse Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      targetX = ((clientX / innerWidth) * 2 - 1) * 0.4;
      targetY = (-(clientY / innerHeight) * 2 + 1) * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const speed = prefersReducedMotion ? 0 : 1;

      // Subtle slow rotation
      mainGroup.rotation.y += delta * 0.35 * speed;
      mainGroup.rotation.x += delta * 0.15 * speed;

      coreMesh.rotation.y -= delta * 0.2 * speed;
      coreMesh.rotation.z += delta * 0.1 * speed;

      particles.rotation.y += delta * 0.1 * speed;

      // Smooth mouse parallax lerp
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      mainGroup.position.x = currentX;
      mainGroup.position.y = currentY;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);

      icosahedronGeo.dispose();
      wireframeMat.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThreeScene, type ThreeContext } from '@/hooks/useThreeScene';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const LAYER_COUNT = 4;
const NODES_PER_LAYER = 10;
const LAYER_SPACING = 1.6;
const CYAN = new THREE.Color('#5EEBFF');
const VIOLET = new THREE.Color('#9D7CFF');

/** Build the node positions for a 4-layer lattice — each layer a ring that
 *  widens slightly as it rises, evoking floor plates of a structure. */
function buildLatticePositions() {
  const positions: THREE.Vector3[] = [];
  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const radius = 1.6 + layer * 0.35;
    const y = (layer - (LAYER_COUNT - 1) / 2) * LAYER_SPACING;
    for (let i = 0; i < NODES_PER_LAYER; i++) {
      const angle = (i / NODES_PER_LAYER) * Math.PI * 2 + layer * 0.35;
      positions.push(
        new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      );
    }
  }
  return positions;
}

/** Edges: ring connections within a layer + vertical struts between layers. */
function buildEdges() {
  const edges: [number, number][] = [];
  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const base = layer * NODES_PER_LAYER;
    for (let i = 0; i < NODES_PER_LAYER; i++) {
      edges.push([base + i, base + ((i + 1) % NODES_PER_LAYER)]);
    }
  }
  for (let layer = 0; layer < LAYER_COUNT - 1; layer++) {
    const base = layer * NODES_PER_LAYER;
    const nextBase = (layer + 1) * NODES_PER_LAYER;
    for (let i = 0; i < NODES_PER_LAYER; i += 2) {
      edges.push([base + i, nextBase + i]);
    }
  }
  return edges;
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollProgress = useRef(0);

  const containerRef = useThreeScene<HTMLDivElement>({
    alpha: true,
    maxPixelRatio: 2,
    setup: ({ scene, camera }: ThreeContext) => {
      const group = new THREE.Group();
      scene.add(group);

      const positions = buildLatticePositions();
      const edges = buildEdges();

      // --- Nodes: a single InstancedMesh keeps this one draw call instead
      // of one mesh per node, regardless of lattice density. ---
      const nodeGeometry = new THREE.SphereGeometry(0.045, 12, 12);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: '#5EEBFF',
        transparent: true,
        opacity: 0,
      });
      const nodes = new THREE.InstancedMesh(
        nodeGeometry,
        nodeMaterial,
        positions.length
      );
      const dummy = new THREE.Object3D();
      positions.forEach((pos, i) => {
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.001); // start collapsed for the build-in animation
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
        nodes.setColorAt(i, i % NODES_PER_LAYER === 0 ? VIOLET : CYAN);
      });
      group.add(nodes);

      // --- Edges: one LineSegments buffer for every strut in the lattice. ---
      const edgePositions = new Float32Array(edges.length * 6);
      edges.forEach(([a, b], i) => {
        edgePositions.set(
          [positions[a].x, positions[a].y, positions[a].z, positions[b].x, positions[b].y, positions[b].z],
          i * 6
        );
      });
      const edgeGeometry = new THREE.BufferGeometry();
      edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
      // drawRange starts at 0 so the entrance animation can reveal struts progressively.
      edgeGeometry.setDrawRange(0, 0);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: '#5EEBFF',
        transparent: true,
        opacity: 0.35,
      });
      const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      group.add(edgeLines);

      // Faint ambient point light gives the cyan nodes a slight glow falloff
      // on nearby geometry without the cost of real bloom post-processing.
      const light = new THREE.PointLight('#9D7CFF', 4, 12);
      light.position.set(2, 2, 4);
      scene.add(light);

      camera.position.set(0, 0.4, 8);

      // --- Build-in animation: struts draw in, nodes pop in with stagger ---
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(edgeGeometry.drawRange, {
        count: edges.length * 2,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => edgeGeometry.setDrawRange(0, Math.floor(edgeGeometry.drawRange.count)),
      })
        .to(edgeMaterial, { opacity: 0.35, duration: 1 }, 0)
        .to(nodeMaterial, { opacity: 0.9, duration: 0.8 }, 0.4)
        .to(
          { t: 0 },
          {
            t: 1,
            duration: 1.2,
            ease: 'back.out(1.7)',
            onUpdate: function () {
              const t = this.targets()[0].t as number;
              positions.forEach((pos, i) => {
                dummy.position.copy(pos);
                dummy.scale.setScalar(0.001 + t * 0.999);
                dummy.updateMatrix();
                nodes.setMatrixAt(i, dummy.matrix);
              });
              nodes.instanceMatrix.needsUpdate = true;
            },
          },
          0.3
        );

      // --- Scroll-driven camera drift, synced via GSAP ScrollTrigger ---
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current?.closest('section') ?? undefined,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      const onPointerMove = (event: PointerEvent) => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (!bounds) return;
        pointer.current.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.current.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      return () => {
        tl.kill();
        trigger.kill();
        window.removeEventListener('pointermove', onPointerMove);
        nodeGeometry.dispose();
        nodeMaterial.dispose();
        edgeGeometry.dispose();
        edgeMaterial.dispose();
      };
    },
    onFrame: ({ scene, camera }, elapsed) => {
      const group = scene.children.find((c) => c instanceof THREE.Group) as THREE.Group | undefined;
      if (!group) return;

      // Smoothly ease the lattice toward the pointer position (parallax).
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.04;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.04;

      group.rotation.y = elapsed * 0.08 + pointer.current.x * 0.4 + scrollProgress.current * 1.4;
      group.rotation.x = pointer.current.y * 0.15;
      group.position.y = -scrollProgress.current * 1.2;

      camera.lookAt(0, 0, 0);
    },
  });

  // Subtle fade of the whole canvas as the hero scrolls out, independent of
  // the internal 3D fade — keeps the transition to the next section clean.
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!wrapperRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current.closest('section') ?? wrapperRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(wrapperRef.current, { opacity: 1 - self.progress * 0.7 });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <div ref={containerRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}

import {
  AlertTriangle,
  BookOpen,
  Boxes,
  Brain,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileCheck2,
  Globe,
  HelpCircle,
  Key,
  Layers,
  Lock,
  Maximize2,
  RotateCw,
  Scale,
  Search,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface TechItem {
  alternativesRejected: string;
  category: 'AI' | 'ARCH' | 'LEGAL' | 'SECURITY' | 'UI';
  citation: string;
  codeSnippet: string;
  color: string;
  criticalProblemSolved: string;
  description: string;
  id: string;
  name: string;
  position3D: [number, number, number];
  role: string;
  version: string;
  whyWeUseThis: string;
}

const TECH_ITEMS: TechItem[] = [
  {
    alternativesRejected:
      'Manual PDF uploads or scanned self-attestations. Rejected because PDF metadata can be easily falsified with basic desktop editing tools, and manual phone/email verification takes 10 to 14 days per tender.',
    category: 'SECURITY',
    citation: 'Section 6A & Section 4, Information Technology Act, 2000',
    codeSnippet: `// Cryptographically pulls verified enterprise certificates
const res = await fetch('/api/v1/digilocker/oauth/token', {
  method: 'POST',
  body: JSON.stringify({ consent: true, aadhaar_last_four: '8921' })
});
// Validates root CCA certificate authority and SHA-256 hash`,
    color: '#2563eb',
    criticalProblemSolved:
      'Eliminates counterfeit MSME / Udyam exemption certificates and fraudulent tax clearance certificates submitted to evade earnest money deposits (EMD).',
    description:
      'Direct government electronic document locker with root CCA cryptographic signatures.',
    id: 'digilocker',
    name: 'DigiLocker Integration (OAuth 2.0)',
    position3D: [-2.2, 1.2, 0],
    role: 'Sovereign Identity & Root Electronic Certificate Authentication',
    version: 'Govt. of India e-Governance Gateway',
    whyWeUseThis:
      'Mandated under Section 6A of the IT Act, 2000. Provides instant, non-repudiable legal validity for digital credentials directly from the issuer (CBDT, MCA21, Ministry of MSME), guaranteeing zero document tampering.',
  },
  {
    alternativesRejected:
      'Shallow LLMs or simple keyword regex rules. Rejected because keyword rules trigger false positives on minor vendor address changes and cannot perform multi-step legal reasoning over interlocking GFR clauses.',
    category: 'AI',
    citation: 'GFR 2017 Rule 144(xi), Rule 149, Rule 151; CVC Circular 03/03/2021',
    codeSnippet: `// Server-side Gemini 3.1 Pro with High Thinking budget
const response = await ai.models.generateContent({
  model: 'gemini-3.1-pro-preview',
  contents: [prompt],
  config: {
    thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
  }
});`,
    color: '#6366f1',
    criticalProblemSolved:
      'Detects nuanced corporate veil circumventions, front/shell companies, and cartel bidding behavior that appear legitimate on superficial scrutiny.',
    description:
      'High-Thinking multi-step legal and vigilance reasoning engine.',
    id: 'gemini-pro',
    name: 'Google Gemini 3.1 Pro (High Thinking)',
    position3D: [2.2, 1.2, 0],
    role: 'Deep CVC Vigilance Reasoning & Integrity Audit',
    version: '@google/genai v2.4.0 (thinkingLevel: HIGH)',
    whyWeUseThis:
      'Public procurement requires strict statutory justification. Gemini 3.1 Pro provides deductive step-by-step reasoning that correlates discrepancies across tax, labor, and corporate registries with specific GFR 2017 rules.',
  },
  {
    alternativesRejected:
      'Static internal blacklist tables. Rejected because corrupt contractors frequently face debarment or vigilance notices in other PSUs or ministries within 24-48 hours that are not yet synchronized into static datasets.',
    category: 'AI',
    citation: 'CVC Guidelines on Debarment & GeM Incident Management Policy',
    codeSnippet: `// Real-time grounded search for active debarment notices
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: [\`Verify central debarment orders for \${bidderName}\`],
  config: {
    tools: [{ googleSearch: {} }]
  }
});
// Extracts grounded web citations from official gazettes`,
    color: '#06b6d4',
    criticalProblemSolved:
      'Prevents blacklisted or debarred contractors from winning critical refinery valve and fitting contracts by cross-checking live gazettes and court orders.',
    description:
      'Real-time web search grounding for central vigilance and debarment registries.',
    id: 'gemini-search',
    name: 'Gemini 3.5 Flash (Search Grounding)',
    position3D: [2.5, -1.0, 0],
    role: 'Real-Time Debarment & Judicial Notice Cross-Referencing',
    version: 'Gemini 3.5 Flash with googleSearch tool',
    whyWeUseThis:
      'Provides live, cited verification against central public procurement portals, judicial stay orders, and news releases, returning clickable web citations as incontrovertible proof for procurement officers.',
  },
  {
    alternativesRejected:
      'Standard relational database audit rows without hash chaining. Rejected because database administrators or unauthorized actors could retroactively modify decision records if a tender award is legally disputed.',
    category: 'SECURITY',
    citation: 'GFR 2017 Rule 173; Indian Evidence Act Section 65B',
    codeSnippet: `// Cryptographic block hash chaining
const blockHash = crypto.createHash('sha256')
  .update(prevHash + timestamp + officerId + action + parameterSummary)
  .digest('hex');
// Stored as immutable evidentiary proof for Tender Committee`,
    color: '#10b981',
    criticalProblemSolved:
      'Protects tender committee officers against false corruption allegations and guarantees that procurement decisions cannot be altered post-hoc.',
    description:
      'Cryptographic tamper-proof blockchain-style block chaining.',
    id: 'sha256-ledger',
    name: 'SHA-256 Immutable Audit Ledger',
    position3D: [-2.5, -1.0, 0],
    role: 'Tamper-Proof Evidentiary Chain of Custody',
    version: 'Node.js Crypto / SHA-256 Digest',
    whyWeUseThis:
      'In high-value PSU refinery tenders (such as CPCL Manali), unsuccessful bidders often file High Court writ petitions. A cryptographically chained ledger provides tamper-proof evidence admissible under Section 65B of the Indian Evidence Act.',
  },
  {
    alternativesRejected:
      'Client-side API requests or Next.js serverless functions with cold-starts. Rejected because client-side calls expose confidential Gemini API keys in the browser, and serverless cold starts cause timeout drops during committee meetings.',
    category: 'ARCH',
    citation: 'National Cyber Security Policy & OWASP API Top 10 Guidelines',
    codeSnippet: `// Server-side isolation in backend/server.ts
const app = express();
app.use('/api/v1', apiRouter);
// Vite embedded as middleware in development
// Gemini API keys remain strictly in process.env`,
    color: '#f59e0b',
    criticalProblemSolved:
      'Eliminates the catastrophic vulnerability of client-side secret exposure, preventing reverse-engineering of procurement scoring algorithms.',
    description:
      'Single-port unified full-stack architecture with strict backend proxy.',
    id: 'express-vite',
    name: 'Express.js & Vite Hybrid Architecture',
    position3D: [0, -2.2, 0],
    role: 'Server-Side Secret Custody & Production Gateway',
    version: 'Express v4 + Vite v6 (Single Container Port 3000)',
    whyWeUseThis:
      'Ensures that Gemini API keys, government API authentication tokens, and internal CVC rules are strictly shielded on the server side. Routes requests through a fast, single-process dev and production server.',
  },
  {
    alternativesRejected:
      'Traditional multi-page static forms or heavy UI component libraries that suffer from bundle bloat and sluggish re-renders on legacy refinery workstations.',
    category: 'UI',
    citation: 'Govt. of India Guidelines for Indian Government Websites (GIGW 3.0)',
    codeSnippet: `// Responsive, high-density government portal UI
<ComplianceScoreCard bid={activeBid} />
<DocumentMismatchTable parameters={activeBid.parameters} />
<RiskAnalyticsCharts bids={bids} />`,
    color: '#ec4899',
    criticalProblemSolved:
      'Prevents officer cognitive overload during rapid tender reviews by organizing dense statutory cross-checks into clean, color-coded visual matrices.',
    description:
      'High-performance reactive frontend with Tailwind CSS and Recharts.',
    id: 'react-tailwind',
    name: 'React 19, Tailwind CSS v4 & Recharts',
    position3D: [0, 2.2, 0],
    role: 'Executive Officer Cockpit & Dynamic Compliance Scoring UI',
    version: 'React 19.0 + Tailwind CSS 4.1 + Recharts 3.10',
    whyWeUseThis:
      'Provides instantaneous 60fps interaction for comparative bidder evaluations, dynamic compliance scoring gauges ($S_{comp}$), and responsive verification matrices that adhere to WCAG AA color accessibility.',
  },
  {
    alternativesRejected:
      'Flat 2D architecture diagrams or static PDF documentation. Rejected because modern technical committees and hackathon juries require intuitive, interactive spatial comprehension of distributed data pipelines.',
    category: 'UI',
    citation: 'Smart India Hackathon 2026 Interactive Deliverable Standards',
    codeSnippet: `// 3D holographic node orchestration in Three.js
const sphereGeo = new THREE.SphereGeometry(0.35, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: node.color,
  roughness: 0.2,
  metalness: 0.8
});`,
    color: '#8b5cf6',
    criticalProblemSolved:
      'Translates complex multi-registry government architectures into a tangible 3D interactive model that non-technical vigilance officers can easily inspect.',
    description:
      'Interactive 3D WebGL holographic system architecture visualizer.',
    id: 'threejs-3d',
    name: 'Three.js & WebGL 3D Interactive Visualizer',
    position3D: [0, 0, 0],
    role: 'Spatial Architectural Exploration & Interactive System Topology',
    version: 'Three.js r182 (WebGL Canvas with Orbit Controls)',
    whyWeUseThis:
      'Renders an interactive 3D holographic representation of the GeM-Verify architecture directly in the browser with zero external plugins, allowing users to physically navigate and explore the why-and-how of each tier.',
  },
];

export const ThreeDReadme: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedTech, setSelectedTech] = useState<TechItem>(TECH_ITEMS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'3d' | 'cards' | 'markdown'>('3d');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // Three.js Scene Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Filtered Tech Items
  const filteredItems = TECH_ITEMS.filter((item) => {
    const matchesCat =
      activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whyWeUseThis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Setup Three.js WebGL Scene
  useEffect(() => {
    if (!mountRef.current || viewMode !== '3d') return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 2.0);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 3.0, 15);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 5. Central Hub (Core Platform)
    const hubGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x312e81,
      emissive: 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.userData = { id: 'hub' };
    scene.add(hubMesh);

    // Hub wireframe cage
    const wireGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    // 6. Nodes Group
    const nodesGroup = new THREE.Group();
    nodesGroupRef.current = nodesGroup;
    scene.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];

    TECH_ITEMS.forEach((item) => {
      const [x, y, z] = item.position3D;
      const geo = new THREE.DodecahedronGeometry(0.38, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color),
        emissive: new THREE.Color(item.color).multiplyScalar(0.25),
        metalness: 0.6,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.userData = { id: item.id, item };
      nodesGroup.add(mesh);
      nodeMeshes.push(mesh);

      // Connecting holographic line to center
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(item.color),
        transparent: true,
        opacity: 0.35,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      nodesGroup.add(line);

      // Outer glow ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(item.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 7.5);
      nodesGroup.add(ring);
    });

    // 7. Particle Field (Constellation)
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // 8. Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.item) {
          setSelectedTech(hit.userData.item);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Mouse drag rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !nodesGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      nodesGroupRef.current.rotation.y += deltaX * 0.005;
      nodesGroupRef.current.rotation.x += deltaY * 0.005;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (camera && renderer && newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow idle rotation
      hubMesh.rotation.y += 0.004;
      hubMesh.rotation.x += 0.002;
      wireMesh.rotation.y -= 0.003;
      wireMesh.rotation.z += 0.002;

      if (nodesGroupRef.current && autoRotate && !isDragging) {
        nodesGroupRef.current.rotation.y += 0.0025;
      }

      // Gentle floating nodes
      nodeMeshes.forEach((mesh, index) => {
        mesh.rotation.y += 0.01;
        mesh.rotation.x += 0.008;
        const initialY = TECH_ITEMS[index].position3D[1];
        mesh.position.y = initialY + Math.sin(elapsedTime * 2 + index) * 0.08;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      hubGeo.dispose();
      hubMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, autoRotate]);

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div id="threed-readme-view" className="space-y-6">
      {/* Top Banner & Mode Selector */}
      <div className="bg-slate-900 rounded-2xl p-5 md:p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1">
                <Boxes className="w-3 h-3" />
                3D System Blueprint & Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">
                SIH 2026 Problem Statement #26100 • CPCL Manali Refinery
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Why We Use These Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Explore the engineering justifications, statutory mandates (GFR 2017 & CVC guidelines), and failure-prevention rationales behind every component in GeM-Verify.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700 shrink-0 text-xs font-semibold">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>3D Holographic Model</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3D Perspective Cards</span>
            </button>

            <button
              onClick={() => setViewMode('markdown')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Full README & Specs</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {['ALL', 'SECURITY', 'AI', 'ARCH', 'UI'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL'
                  ? 'All Components'
                  : cat === 'AI'
                  ? 'AI & Vigilance'
                  : cat === 'SECURITY'
                  ? 'Security & DigiLocker'
                  : cat === 'ARCH'
                  ? 'Architecture & API'
                  : 'UI & Analytics'}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search components or rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* MODE 1: Interactive 3D WebGL Hologram View */}
      {viewMode === '3d' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D WebGL Canvas Stage */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg relative flex flex-col">
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300">
                  WebGL 3D Interactive Topology
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition cursor-pointer ${
                    autoRotate
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{autoRotate ? 'Auto-Rotate ON' : 'Paused'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Mount */}
            <div
              ref={mountRef}
              className="w-full h-[460px] cursor-grab active:cursor-grabbing relative"
            >
              {/* Overlay Prompt */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] text-slate-300 pointer-events-none flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Click any 3D node to inspect "Why We Use This"</span>
              </div>

              {/* Instructions Pill */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs border border-slate-800 px-3 py-1 rounded-lg text-[10px] text-slate-400 pointer-events-none">
                Drag to orbit • Interactive WebGL
              </div>
            </div>

            {/* Quick Nodes Ribbon */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0">
                Nodes:
              </span>
              {TECH_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedTech(item)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    selectedTech.id === item.id
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Justification Card for Selected 3D Node */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: selectedTech.color }}
                  >
                    {selectedTech.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedTech.version}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedTech.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                  {selectedTech.role}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: selectedTech.color }}
              >
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* WHY WE USE THIS BLOCK */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Why Are We Using This? (The Primary Rationale)</span>
              </div>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                {selectedTech.whyWeUseThis}
              </p>
            </div>

            {/* CRITICAL PROBLEM SOLVED */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Critical Procurement Vulnerability Prevented</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                {selectedTech.criticalProblemSolved}
              </p>
            </div>

            {/* ALTERNATIVE REJECTED */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Alternatives Evaluated & Why Dismissed</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                {selectedTech.alternativesRejected}
              </p>
            </div>

            {/* STATUTORY CITATION */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Scale className="w-3.5 h-3.5" />
                  Statutory Citation & Mandate
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  GFR / CVC / IT Act
                </span>
              </div>
              <p className="text-slate-300 font-mono text-[11px]">
                {selectedTech.citation}
              </p>
            </div>

            {/* CODE SNIPPET */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  Implementation Architecture
                </span>
                <button
                  onClick={() => handleCopySnippet(selectedTech.codeSnippet)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSnippet ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                <code>{selectedTech.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: 3D Perspective Flip Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.version.split(' ')[0]}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">
                  {item.name}
                </h3>
                <p className="text-xs font-medium text-indigo-600 mt-0.5 mb-3">
                  {item.role}
                </p>

                {/* Primary WHY */}
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950 leading-relaxed mb-3">
                  <strong className="block text-indigo-900 mb-0.5">
                    Why We Use This:
                  </strong>
                  {item.whyWeUseThis}
                </div>

                {/* Vulnerability Prevented */}
                <div className="text-xs text-slate-600 leading-relaxed space-y-1 mb-3">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                    Vulnerability Prevented:
                  </span>
                  <p className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {item.criticalProblemSolved}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Scale className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{item.citation}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedTech(item);
                    setViewMode('3d');
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Inspect in 3D Model</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 3: Comprehensive Markdown & Whitepaper View */}
      {viewMode === 'markdown' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 leading-relaxed text-sm">
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
              Smart India Hackathon 2026 • Problem Statement #26100
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              GeM-Verify Technical Specification & Technology Justifications
            </h1>
            <p className="text-slate-600 mt-2 text-sm max-w-3xl">
              Chennai Petroleum Corporation Limited (CPCL) Manali Refinery • Ministry of Petroleum & Natural Gas
            </p>
          </div>

          {/* Quick Summary Table */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Technology Justification Matrix (Summary at a Glance)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-1/4">Technology</th>
                    <th className="py-3 px-4 w-1/3">Why We Use This</th>
                    <th className="py-3 px-4 w-1/4">Alternative Rejected</th>
                    <th className="py-3 px-4">Statutory Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {TECH_ITEMS.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.name}
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.version.split(' ')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed">
                        {item.whyWeUseThis}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.alternativesRejected}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-indigo-700 font-semibold">
                        {item.citation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic Scoring Math */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              Dynamic Procurement Scoring Formulation ($S_{'{comp}'}$)
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Every bidder is evaluated across a standardized mathematical index:
            </p>
            <div className="bg-white p-3 rounded-lg border border-slate-300 font-mono text-xs text-indigo-900 font-bold text-center">
              S_comp = Σ (W_i × C_i) - Δ_flags
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-600">
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W1 = 20%:</strong> Statutory Tax (GSTN & PAN)
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W2 = 20%:</strong> MSME / Udyam Classification
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W3 = 15%:</strong> DigiLocker Root PKI Proof
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W4 = 15%:</strong> Make in India Class-I/II Order
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W5 = 15%:</strong> Central Debarment Cleanliness
              </div>
              <div className="p-2.5 bg-white rounded border border-slate-200">
                <strong>W6 = 15%:</strong> Social Security (EPFO & ESIC)
              </div>
            </div>
          </div>

          {/* Legal Compliance Footer */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-900">
                Fully Compliant with GFR 2017, CVC Circulars & IT Act 2000
              </span>
              <p className="mt-0.5 leading-relaxed text-emerald-800">
                GeM-Verify maintains complete non-repudiation, ensures zero API key leakage through backend proxy isolation, and guarantees human-in-the-loop oversight before any tender disqualification notice is issued.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

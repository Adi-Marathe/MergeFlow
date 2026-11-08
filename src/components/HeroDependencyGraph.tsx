import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { ForceGraphMethods, GraphData, LinkObject, NodeObject } from "react-force-graph-2d";

type HeroGraphNode = {
  id: string;
  label: string;
  description: string;
  kind: "changed" | "direct" | "related";
};

type HeroGraphLink = {
  source: string;
  target: string;
  kind: "impact" | "dependency" | "shared";
};

type HeroGraphNodeObject = NodeObject<HeroGraphNode>;
type HeroGraphLinkObject = LinkObject<HeroGraphNode, HeroGraphLink>;

type HeroDependencyGraphProps = {
  active: boolean;
  onFocusChange: (label: string, connections: number) => void;
};

const centerId = "auth/token.ts";

const directNodes = [
  { id: "api/session.ts", label: "api/session.ts", description: "Reads and validates session tokens." },
  { id: "api/refresh.ts", label: "api/refresh.ts", description: "Refreshes expired access tokens." },
  { id: "middleware/auth.ts", label: "middleware/auth.ts", description: "Checks authentication before requests reach routes." },
  { id: "test/token.test.ts", label: "test/token.test.ts", description: "Covers token creation, expiry, and refresh behavior." },
  { id: "config/jwt.ts", label: "config/jwt.ts", description: "Defines signing and verification settings." },
  { id: "models/user.ts", label: "models/user.ts", description: "Provides user identity data used by the auth flow." },
];

const relatedNodes = [
  { id: "auth/session.ts", label: "auth/session.ts", description: "Builds a session from verified claims." },
  { id: "auth/claims.ts", label: "auth/claims.ts", description: "Maps token claims to application permissions." },
  { id: "auth/cookies.ts", label: "auth/cookies.ts", description: "Sets and clears session cookies." },
  { id: "services/session-store.ts", label: "services/session-store.ts", description: "Loads and revokes active sessions." },
  { id: "services/token-store.ts", label: "services/token-store.ts", description: "Stores token rotation metadata." },
  { id: "services/refresh-job.ts", label: "services/refresh-job.ts", description: "Schedules and retries token refresh work." },
  { id: "routes/login.ts", label: "routes/login.ts", description: "Starts the sign-in flow." },
  { id: "routes/refresh.ts", label: "routes/refresh.ts", description: "Exposes the refresh endpoint." },
  { id: "types/session.ts", label: "types/session.ts", description: "Shares session types between services." },
  { id: "test/session.test.ts", label: "test/session.test.ts", description: "Checks session parsing and expiry." },
  { id: "test/refresh.integration.ts", label: "test/refresh.integration.ts", description: "Exercises refresh through the API boundary." },
  { id: "test/authorization.test.ts", label: "test/authorization.test.ts", description: "Checks access decisions for protected routes." },
  { id: "config/secrets.ts", label: "config/secrets.ts", description: "Loads signing secrets from the runtime environment." },
  { id: "utils/jwt.ts", label: "utils/jwt.ts", description: "Wraps shared token encode and decode helpers." },
  { id: "middleware/permissions.ts", label: "middleware/permissions.ts", description: "Applies role checks after authentication." },
  { id: "models/account.ts", label: "models/account.ts", description: "Connects a user to account membership." },
  { id: "services/user.ts", label: "services/user.ts", description: "Resolves the current user profile." },
  { id: "lib/retry.ts", label: "lib/retry.ts", description: "Provides bounded retries for transient errors." },
  { id: "docs/auth-flow.md", label: "docs/auth-flow.md", description: "Documents sign-in and token renewal." },
  { id: "events/token-expired.ts", label: "events/token-expired.ts", description: "Signals consumers when a token expires." },
  { id: "worker/session-cleanup.ts", label: "worker/session-cleanup.ts", description: "Removes expired sessions in the background." },
];

const nodes: HeroGraphNode[] = [
  {
    id: centerId,
    label: centerId,
    description: "Changed file: the token refresh race starts here.",
    kind: "changed",
  },
  ...directNodes.map((node) => ({ ...node, kind: "direct" as const })),
  ...relatedNodes.map((node) => ({ ...node, kind: "related" as const })),
];

const links: HeroGraphLink[] = [
  ...directNodes.map((node) => ({ source: centerId, target: node.id, kind: "impact" as const })),
  { source: "api/session.ts", target: "auth/session.ts", kind: "dependency" },
  { source: "api/session.ts", target: "services/session-store.ts", kind: "dependency" },
  { source: "api/session.ts", target: "types/session.ts", kind: "dependency" },
  { source: "api/session.ts", target: "services/user.ts", kind: "dependency" },
  { source: "api/session.ts", target: "models/account.ts", kind: "dependency" },
  { source: "api/refresh.ts", target: "services/token-store.ts", kind: "dependency" },
  { source: "api/refresh.ts", target: "services/refresh-job.ts", kind: "dependency" },
  { source: "api/refresh.ts", target: "routes/refresh.ts", kind: "dependency" },
  { source: "api/refresh.ts", target: "lib/retry.ts", kind: "dependency" },
  { source: "api/refresh.ts", target: "events/token-expired.ts", kind: "dependency" },
  { source: "middleware/auth.ts", target: "auth/claims.ts", kind: "dependency" },
  { source: "middleware/auth.ts", target: "auth/cookies.ts", kind: "dependency" },
  { source: "middleware/auth.ts", target: "middleware/permissions.ts", kind: "dependency" },
  { source: "middleware/auth.ts", target: "routes/login.ts", kind: "dependency" },
  { source: "test/token.test.ts", target: "test/session.test.ts", kind: "dependency" },
  { source: "test/token.test.ts", target: "test/refresh.integration.ts", kind: "dependency" },
  { source: "test/token.test.ts", target: "test/authorization.test.ts", kind: "dependency" },
  { source: "config/jwt.ts", target: "config/secrets.ts", kind: "dependency" },
  { source: "config/jwt.ts", target: "utils/jwt.ts", kind: "dependency" },
  { source: "models/user.ts", target: "models/account.ts", kind: "dependency" },
  { source: "models/user.ts", target: "services/user.ts", kind: "dependency" },
  { source: "worker/session-cleanup.ts", target: "auth/session.ts", kind: "dependency" },
  { source: "docs/auth-flow.md", target: "routes/login.ts", kind: "dependency" },
  { source: "api/session.ts", target: "middleware/auth.ts", kind: "shared" },
  { source: "api/refresh.ts", target: "test/refresh.integration.ts", kind: "shared" },
  { source: "auth/claims.ts", target: "config/jwt.ts", kind: "shared" },
  { source: "services/session-store.ts", target: "worker/session-cleanup.ts", kind: "shared" },
];

const graphData: GraphData<HeroGraphNode, HeroGraphLink> = {
  nodes: [
    { ...nodes[0], x: 0, y: 0 },
    ...nodes.slice(1, 7).map((node, index) => {
      const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
      return { ...node, x: Math.cos(angle) * 76, y: Math.sin(angle) * 76 };
    }),
    ...nodes.slice(7).map((node, index) => {
      const angle = (index / (nodes.length - 7)) * Math.PI * 2 - Math.PI / 2;
      const radius = 142 + (index % 3) * 6;
      return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
    }),
  ],
  links,
};

function endpointId(endpoint: string | number | NodeObject<HeroGraphNode> | undefined): string {
  if (typeof endpoint === "object" && endpoint !== null) return String(endpoint.id ?? "");
  return String(endpoint ?? "");
}

function connectionCount(id: string): number {
  return graphData.links.reduce((count, link) => (
    endpointId(link.source) === id || endpointId(link.target) === id ? count + 1 : count
  ), 0);
}

function makeAdjacentIds(id: string): Set<string> {
  const adjacent = new Set<string>([id]);
  graphData.links.forEach((link) => {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    if (source === id) adjacent.add(target);
    if (target === id) adjacent.add(source);
  });
  return adjacent;
}

function useReducedMotionPreference() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}

export function HeroDependencyGraph({ active, onFocusChange }: HeroDependencyGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods<NodeObject<HeroGraphNode>, LinkObject<HeroGraphNode, HeroGraphLink>> | undefined>(undefined);
  const didFitRef = useRef(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(centerId);
  const reduceMotion = useReducedMotionPreference();
  const focusedId = hoveredId ?? selectedId;
  const adjacentIds = useMemo(() => makeAdjacentIds(focusedId), [focusedId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(0, Math.floor(bounds.width));
      const height = Math.max(0, Math.floor(bounds.height));
      setDimensions((current) => current.width === width && current.height === height ? current : { width, height });
    };

    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    if (active) graph.resumeAnimation();
    else graph.pauseAnimation();
  }, [active, dimensions.height, dimensions.width]);

  const drawNode = useCallback((node: HeroGraphNodeObject, context: CanvasRenderingContext2D, scale: number) => {
    const id = String(node.id ?? "");
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    const isRoot = node.kind === "changed";
    const isDirect = node.kind === "direct";
    const isFocused = id === focusedId;
    const isAdjacent = adjacentIds.has(id);
    const isDimmed = Boolean(focusedId) && !isFocused && !isAdjacent;
    const radius = isRoot ? 7.2 : isDirect ? 4.2 : 2.8;
    const pulse = isRoot && !reduceMotion ? (Math.sin(Date.now() / 640) + 1) / 2 : 0;

    context.save();
    context.globalAlpha = isDimmed ? 0.22 : 1;

    if (isRoot) {
      context.beginPath();
      context.arc(x, y, 13 + pulse * 4, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 107, 91, ${0.04 + pulse * 0.06})`;
      context.fill();
      context.beginPath();
      context.arc(x, y, 10 + pulse * 1.6, 0, Math.PI * 2);
      context.strokeStyle = `rgba(255, 107, 91, ${0.22 + pulse * 0.24})`;
      context.lineWidth = 1 / scale;
      context.stroke();
    }

    context.beginPath();
    context.arc(x, y, radius + (isFocused && !isRoot ? 1.2 : 0), 0, Math.PI * 2);
    context.fillStyle = isRoot ? "#ff6b5b" : isFocused ? "#ffb4a9" : isDirect ? "#f4ede0" : "#7890b2";
    context.shadowBlur = isFocused || isRoot ? 10 / scale : 0;
    context.shadowColor = "rgba(255, 107, 91, 0.82)";
    context.fill();
    context.shadowBlur = 0;

    if (isRoot || isDirect || isFocused) {
      const fontSize = (isRoot ? 8.2 : isDirect ? 7.2 : 7.5) / scale;
      context.font = `${isRoot ? 500 : 400} ${fontSize}px "IBM Plex Mono", monospace`;
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillStyle = isRoot ? "#f4ede0" : "rgba(244, 237, 224, 0.88)";
      context.fillText(node.label, x, y + radius + 5 / scale, 118 / scale);
    }

    context.restore();
  }, [adjacentIds, focusedId, reduceMotion]);

  const linkColor = useCallback((link: HeroGraphLinkObject) => {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    const isRelated = source === focusedId || target === focusedId || (adjacentIds.has(source) && adjacentIds.has(target));
    if (link.kind === "impact") return isRelated ? "rgba(255, 107, 91, 0.62)" : "rgba(255, 107, 91, 0.16)";
    return isRelated ? "rgba(244, 237, 224, 0.46)" : "rgba(139, 158, 190, 0.16)";
  }, [adjacentIds, focusedId]);

  const linkParticles = useCallback((link: HeroGraphLinkObject) => {
    if (reduceMotion) return 0;
    if (link.kind === "impact") return 1;
    const source = endpointId(link.source);
    return ["api/session.ts", "api/refresh.ts", "middleware/auth.ts", "config/jwt.ts"].includes(source) ? 1 : 0;
  }, [reduceMotion]);

  const paintPointerArea = useCallback((node: HeroGraphNodeObject, color: string, context: CanvasRenderingContext2D, scale: number) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(node.x ?? 0, node.y ?? 0, (node.kind === "changed" ? 12 : 9) / scale, 0, Math.PI * 2);
    context.fill();
  }, []);

  const handleNodeHover = useCallback((node: HeroGraphNodeObject | null) => {
    const id = node?.id == null ? null : String(node.id);
    setHoveredId(id);
    const focus = id ? nodes.find((item) => item.id === id) : nodes.find((item) => item.id === selectedId);
    if (focus) onFocusChange(focus.label, connectionCount(focus.id));
  }, [onFocusChange, selectedId]);

  const handleNodeClick = useCallback((node: HeroGraphNodeObject) => {
    const id = String(node.id ?? "");
    setSelectedId(id);
    setHoveredId(id);
    onFocusChange(node.label, connectionCount(id));
    if (typeof node.x === "number" && typeof node.y === "number") {
      graphRef.current?.centerAt(node.x, node.y, 420);
    }
  }, [onFocusChange]);

  const handleEngineStop = useCallback(() => {
    if (didFitRef.current) return;
    didFitRef.current = true;
    graphRef.current?.zoomToFit(520, 24);
  }, []);

  return (
    <div className="hero-network" ref={containerRef} role="img" aria-label="Interactive dependency graph with 28 source files and modules connected by 33 dependency links. Hover over or select a node to inspect its connections.">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph2D<HeroGraphNode, HeroGraphLink>
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          backgroundColor="rgba(0, 0, 0, 0)"
          nodeId="id"
          nodeLabel={(node) => `${node.label} — ${node.description}`}
          nodeCanvasObject={drawNode}
          nodeCanvasObjectMode={() => "replace"}
          nodePointerAreaPaint={paintPointerArea}
          nodeVal={(node) => node.kind === "changed" ? 6 : node.kind === "direct" ? 2.5 : 1}
          linkColor={linkColor}
          linkWidth={(link) => link.kind === "impact" ? 1 : link.kind === "shared" ? 0.65 : 0.8}
          linkDirectionalParticles={linkParticles}
          linkDirectionalParticleColor={(link) => link.kind === "impact" ? "#ff6b5b" : "#d8d4cb"}
          linkDirectionalParticleWidth={1.65}
          linkDirectionalParticleSpeed={0.0035}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onEngineStop={handleEngineStop}
          cooldownTicks={reduceMotion ? 72 : 180}
          warmupTicks={reduceMotion ? 0 : 36}
          d3AlphaDecay={reduceMotion ? 0.08 : 0.032}
          d3VelocityDecay={0.36}
          minZoom={0.7}
          maxZoom={3.2}
          autoPauseRedraw={reduceMotion}
          enableNodeDrag
          enableZoomInteraction
          enablePanInteraction
        />
      )}
      <span className="sr-only">The changed file auth/token.ts connects to six direct files, with related APIs, middleware, configuration, models, tests, and services shown around them.</span>
    </div>
  );
}

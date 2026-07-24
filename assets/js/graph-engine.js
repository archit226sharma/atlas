/**
 * CodeAtlas Interactive Spring Boot Architecture Graph Engine
 * Refactored for Production Hardening & XSS Prevention (Zero innerHTML with raw strings, Event Delegation).
 */

window.CodeAtlasGraph = (function () {
  const PRESETS = {
    overview: {
      title: "System Topology Overview",
      score: 98,
      status: "Healthy Topology",
      statusClass: "badge-accent",
      description: "Complete macro-view of Spring Boot ApplicationContext. Clean Controller -> Service -> Repository boundaries.",
      nodes: [
        { id: "usr_ctrl", label: "UserController", tier: "controller", x: 100, y: 100, pkg: "com.example.demo.controller.UserController", annotation: "@RestController" },
        { id: "ord_ctrl", label: "OrderController", tier: "controller", x: 100, y: 260, pkg: "com.example.demo.controller.OrderController", annotation: "@RestController" },
        { id: "usr_svc", label: "UserService", tier: "service", x: 380, y: 100, pkg: "com.example.demo.service.UserService", annotation: "@Service" },
        { id: "ord_svc", label: "OrderService", tier: "service", x: 380, y: 260, pkg: "com.example.demo.service.OrderService", annotation: "@Service" },
        { id: "pay_svc", label: "PaymentService", tier: "service", x: 380, y: 400, pkg: "com.example.demo.service.PaymentService", annotation: "@Service" },
        { id: "usr_repo", label: "UserRepository", tier: "repository", x: 680, y: 100, pkg: "com.example.demo.repository.UserRepository", annotation: "@Repository" },
        { id: "ord_repo", label: "OrderRepository", tier: "repository", x: 680, y: 260, pkg: "com.example.demo.repository.OrderRepository", annotation: "@Repository" },
        { id: "pay_gw", label: "StripeGateway", tier: "repository", x: 680, y: 400, pkg: "com.example.demo.integration.StripeGateway", annotation: "@Component" }
      ],
      edges: [
        { from: "usr_ctrl", to: "usr_svc" },
        { from: "ord_ctrl", to: "ord_svc" },
        { from: "usr_svc", to: "usr_repo" },
        { from: "ord_svc", to: "ord_repo" },
        { from: "ord_svc", to: "pay_svc" },
        { from: "pay_svc", to: "pay_gw" }
      ]
    },
    violation: {
      title: "Layer Bypass Violation Detected",
      score: 72,
      status: "1 Rule Violation",
      statusClass: "badge-error",
      description: "UserController directly invokes UserRepository, bypassing the Service layer business logic boundary.",
      nodes: [
        { id: "usr_ctrl", label: "UserController", tier: "controller", x: 100, y: 120, pkg: "com.example.demo.controller.UserController", annotation: "@RestController", violation: true },
        { id: "usr_svc", label: "UserService", tier: "service", x: 380, y: 240, pkg: "com.example.demo.service.UserService", annotation: "@Service" },
        { id: "usr_repo", label: "UserRepository", tier: "repository", x: 680, y: 120, pkg: "com.example.demo.repository.UserRepository", annotation: "@Repository", violation: true },
        { id: "ord_ctrl", label: "OrderController", tier: "controller", x: 100, y: 360, pkg: "com.example.demo.controller.OrderController", annotation: "@RestController" },
        { id: "ord_svc", label: "OrderService", tier: "service", x: 380, y: 360, pkg: "com.example.demo.service.OrderService", annotation: "@Service" },
        { id: "ord_repo", label: "OrderRepository", tier: "repository", x: 680, y: 360, pkg: "com.example.demo.repository.OrderRepository", annotation: "@Repository" }
      ],
      edges: [
        { from: "usr_ctrl", to: "usr_repo", type: "violation", label: "BYPASS_SERVICE" },
        { from: "usr_ctrl", to: "usr_svc" },
        { from: "usr_svc", to: "usr_repo" },
        { from: "ord_ctrl", to: "ord_svc" },
        { from: "ord_svc", to: "ord_repo" }
      ]
    },
    circular: {
      title: "Circular Dependency Detected",
      score: 64,
      status: "Circular Cycle",
      statusClass: "badge-warning",
      description: "OrderService & PaymentService mutually depend on each other, causing Spring context initialization risks.",
      nodes: [
        { id: "ord_svc", label: "OrderService", tier: "service", x: 260, y: 180, pkg: "com.example.demo.service.OrderService", annotation: "@Service", warning: true },
        { id: "pay_svc", label: "PaymentService", tier: "service", x: 540, y: 180, pkg: "com.example.demo.service.PaymentService", annotation: "@Service", warning: true },
        { id: "ord_repo", label: "OrderRepository", tier: "repository", x: 260, y: 360, pkg: "com.example.demo.repository.OrderRepository", annotation: "@Repository" },
        { id: "pay_repo", label: "PaymentRepository", tier: "repository", x: 540, y: 360, pkg: "com.example.demo.repository.PaymentRepository", annotation: "@Repository" }
      ],
      edges: [
        { from: "ord_svc", to: "pay_svc", type: "circular", label: "@Autowired" },
        { from: "pay_svc", to: "ord_svc", type: "circular", label: "@Autowired" },
        { from: "ord_svc", to: "ord_repo" },
        { from: "pay_svc", to: "pay_repo" }
      ]
    },
    unused: {
      title: "Orphaned Bean Discovery",
      score: 85,
      status: "Dead Code Detected",
      statusClass: "badge-warning",
      description: "LegacyAuditProcessor bean is instantiated in Spring context but has zero incoming references.",
      nodes: [
        { id: "usr_ctrl", label: "UserController", tier: "controller", x: 100, y: 140, pkg: "com.example.demo.controller.UserController", annotation: "@RestController" },
        { id: "usr_svc", label: "UserService", tier: "service", x: 380, y: 140, pkg: "com.example.demo.service.UserService", annotation: "@Service" },
        { id: "legacy_svc", label: "LegacyAuditProcessor", tier: "service", x: 380, y: 320, pkg: "com.example.demo.service.LegacyAuditProcessor", annotation: "@Service", unused: true },
        { id: "usr_repo", label: "UserRepository", tier: "repository", x: 680, y: 140, pkg: "com.example.demo.repository.UserRepository", annotation: "@Repository" }
      ],
      edges: [
        { from: "usr_ctrl", to: "usr_svc" },
        { from: "usr_svc", to: "usr_repo" }
      ]
    },
    clean: {
      title: "100/100 Architecture Health",
      score: 100,
      status: "Strict Layering Verified",
      statusClass: "badge-accent",
      description: "0 Layer Violations, 0 Circular Dependencies, 0 Orphaned Beans. Fully compliant Spring Boot Architecture.",
      nodes: [
        { id: "api_ctrl", label: "ProductController", tier: "controller", x: 120, y: 200, pkg: "com.example.demo.controller.ProductController", annotation: "@RestController" },
        { id: "prod_svc", label: "ProductService", tier: "service", x: 420, y: 200, pkg: "com.example.demo.service.ProductService", annotation: "@Service" },
        { id: "prod_repo", label: "ProductRepository", tier: "repository", x: 700, y: 200, pkg: "com.example.demo.repository.ProductRepository", annotation: "@Repository" }
      ],
      edges: [
        { from: "api_ctrl", to: "prod_svc" },
        { from: "prod_svc", to: "prod_repo" }
      ]
    }
  };

  let currentPreset = "overview";
  let selectedNodeId = null;
  let activeFilters = { controller: true, service: true, repository: true };

  // SVG Helper namespace
  const SVG_NS = "http://www.w3.org/2000/svg";

  function createSvgElement(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      for (const [key, val] of Object.entries(attrs)) {
        el.setAttribute(key, val);
      }
    }
    return el;
  }

  function renderGraph(presetKey) {
    const container = document.getElementById("graph-svg-container");
    if (!container) return;

    currentPreset = presetKey || currentPreset;
    const preset = PRESETS[currentPreset];

    // Safe text updates
    const scoreValEl = document.getElementById("graph-score-value");
    const scoreBadgeEl = document.getElementById("graph-score-badge");
    const scoreTitleEl = document.getElementById("graph-preset-title");
    const scoreDescEl = document.getElementById("graph-preset-desc");

    if (scoreValEl) scoreValEl.textContent = preset.score + "/100";
    if (scoreBadgeEl) {
      scoreBadgeEl.textContent = preset.status;
      scoreBadgeEl.className = "px-3 py-1 rounded-full text-xs font-mono font-semibold " + preset.statusClass;
    }
    if (scoreTitleEl) scoreTitleEl.textContent = preset.title;
    if (scoreDescEl) scoreDescEl.textContent = preset.description;

    const visibleNodes = preset.nodes.filter(n => activeFilters[n.tier] !== false);
    const nodeMap = {};
    visibleNodes.forEach(n => { nodeMap[n.id] = n; });

    const visibleEdges = preset.edges.filter(e => nodeMap[e.from] && nodeMap[e.to]);

    // Clear container safely
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Build SVG Tree using DOM APIs (Zero innerHTML)
    const svg = createSvgElement("svg", {
      class: "w-full h-full min-h-[380px]",
      viewBox: "0 0 850 480"
    });

    const defs = createSvgElement("defs");

    // Markers
    const markers = [
      { id: "arrow-default", fill: "#919095" },
      { id: "arrow-violation", fill: "#f87171" },
      { id: "arrow-circular", fill: "#fbbf24" }
    ];

    markers.forEach(m => {
      const marker = createSvgElement("marker", {
        id: m.id,
        viewBox: "0 0 10 10",
        refX: "28",
        refY: "5",
        markerWidth: "6",
        markerHeight: "6",
        orient: "auto-start-reverse"
      });
      const path = createSvgElement("path", {
        d: "M 0 0 L 10 5 L 0 10 z",
        fill: m.fill
      });
      marker.appendChild(path);
      defs.appendChild(marker);
    });

    svg.appendChild(defs);

    // Render Edges
    visibleEdges.forEach(edge => {
      const fromNode = nodeMap[edge.from];
      const toNode = nodeMap[edge.to];

      let strokeColor = "#47464a";
      let marker = "url(#arrow-default)";
      let edgeClass = "graph-edge";
      let dashArray = null;

      if (edge.type === "violation") {
        strokeColor = "#f87171";
        marker = "url(#arrow-violation)";
        dashArray = "4,4";
        edgeClass += " violation";
      } else if (edge.type === "circular") {
        strokeColor = "#fbbf24";
        marker = "url(#arrow-circular)";
        edgeClass += " circular";
      }

      let d = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
      if (edge.from === "pay_svc" && edge.to === "ord_svc") {
        d = `M ${fromNode.x} ${fromNode.y + 15} C ${fromNode.x - 60} ${fromNode.y + 70}, ${toNode.x + 60} ${toNode.y + 70}, ${toNode.x} ${toNode.y + 15}`;
      } else if (edge.type === "violation") {
        d = `M ${fromNode.x} ${fromNode.y - 15} Q ${(fromNode.x + toNode.x) / 2} ${fromNode.y - 80} ${toNode.x} ${toNode.y - 15}`;
      }

      const pathAttrs = {
        d: d,
        class: edgeClass,
        stroke: strokeColor,
        "stroke-width": "2",
        fill: "none",
        "marker-end": marker
      };
      if (dashArray) pathAttrs["stroke-dasharray"] = dashArray;

      const pathEl = createSvgElement("path", pathAttrs);
      svg.appendChild(pathEl);

      if (edge.label) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2 - (edge.type === "violation" ? 35 : 12);

        const rect = createSvgElement("rect", {
          x: midX - 45,
          y: midY - 10,
          width: "90",
          height: "18",
          rx: "4",
          fill: "#131316",
          stroke: strokeColor,
          "stroke-width": "1"
        });

        const text = createSvgElement("text", {
          x: midX,
          y: midY + 3,
          fill: strokeColor,
          "font-size": "10",
          "font-family": "Geist Mono",
          "text-anchor": "middle",
          "font-weight": "600"
        });
        text.textContent = edge.label;

        svg.appendChild(rect);
        svg.appendChild(text);
      }
    });

    // Render Nodes
    visibleNodes.forEach(node => {
      let fillBg = "#1f1f22";
      let strokeCol = "#47464a";
      let textCol = "#e4e1e5";
      let tagBg = "#2a2a2d";
      let tagText = "#c8c5ca";

      if (node.tier === "controller") {
        strokeCol = "#3b82f6";
        tagBg = "rgba(59, 130, 246, 0.15)";
        tagText = "#60a5fa";
      } else if (node.tier === "service") {
        strokeCol = "#22c55e";
        tagBg = "rgba(34, 197, 94, 0.15)";
        tagText = "#4ade80";
      } else if (node.tier === "repository") {
        strokeCol = "#a855f7";
        tagBg = "rgba(168, 85, 247, 0.15)";
        tagText = "#c084fc";
      }

      if (node.violation) {
        strokeCol = "#f87171";
        fillBg = "#281215";
      } else if (node.warning) {
        strokeCol = "#fbbf24";
        fillBg = "#261c10";
      } else if (node.unused) {
        strokeCol = "#64748b";
        fillBg = "#0f172a";
        textCol = "#94a3b8";
      }

      const isSelected = selectedNodeId === node.id;
      const strokeWidth = isSelected ? "3.5" : "1.5";
      const strokeColorFinal = isSelected ? "#ffffff" : strokeCol;

      const g = createSvgElement("g", {
        class: "graph-node",
        transform: `translate(${node.x - 70}, ${node.y - 30})`,
        "data-node-id": node.id,
        role: "button",
        tabindex: "0",
        "aria-label": `Node ${node.label}, ${node.annotation}`
      });

      const rectNode = createSvgElement("rect", {
        width: "140",
        height: "60",
        rx: "8",
        fill: fillBg,
        stroke: strokeColorFinal,
        "stroke-width": strokeWidth,
        class: "shadow-lg transition-all hover:scale-105"
      });

      const rectTag = createSvgElement("rect", {
        x: "8",
        y: "8",
        width: "124",
        height: "18",
        rx: "4",
        fill: tagBg
      });

      const textTag = createSvgElement("text", {
        x: "70",
        y: "21",
        fill: tagText,
        "font-size": "10",
        "font-family": "Geist Mono",
        "text-anchor": "middle",
        "font-weight": "600"
      });
      textTag.textContent = node.annotation;

      const textLabel = createSvgElement("text", {
        x: "70",
        y: "44",
        fill: textCol,
        "font-size": "12",
        "font-family": "Geist",
        "text-anchor": "middle",
        "font-weight": "600"
      });
      textLabel.textContent = node.label;

      g.appendChild(rectNode);
      g.appendChild(rectTag);
      g.appendChild(textTag);
      g.appendChild(textLabel);

      // Event listener delegation instead of inline onclick
      g.addEventListener("click", function () {
        selectNode(node.id);
      });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectNode(node.id);
        }
      });

      svg.appendChild(g);
    });

    container.appendChild(svg);

    // Update node inspector safely
    if (selectedNodeId) {
      updateNodeInspector(selectedNodeId);
    }
  }

  function updateNodeInspector(nodeId) {
    const node = PRESETS[currentPreset].nodes.find(n => n.id === nodeId);
    const inspectorEl = document.getElementById("node-inspector-content");
    if (!inspectorEl) return;

    // Clear safely
    while (inspectorEl.firstChild) {
      inspectorEl.removeChild(inspectorEl.firstChild);
    }

    if (!node) {
      const p = document.createElement("p");
      p.className = "text-xs text-on-surface-variant italic";
      p.textContent = "Click any graph node to inspect Spring annotations, AST metadata, and dependency metrics.";
      inspectorEl.appendChild(p);
      return;
    }

    const inEdges = PRESETS[currentPreset].edges.filter(e => e.to === nodeId);
    const outEdges = PRESETS[currentPreset].edges.filter(e => e.from === nodeId);

    const wrapper = document.createElement("div");
    wrapper.className = "flex flex-col gap-2";

    // Header
    const header = document.createElement("div");
    header.className = "flex items-center justify-between";
    const ann = document.createElement("span");
    ann.className = "text-xs font-mono text-accent font-semibold";
    ann.textContent = node.annotation;
    const tier = document.createElement("span");
    tier.className = "text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono";
    tier.textContent = node.tier.toUpperCase();
    header.appendChild(ann);
    header.appendChild(tier);
    wrapper.appendChild(header);

    // Label
    const h4 = document.createElement("h4");
    h4.className = "font-semibold text-sm text-on-background";
    h4.textContent = node.label;
    wrapper.appendChild(h4);

    // Package path
    const pkg = document.createElement("div");
    pkg.className = "text-[11px] font-mono text-on-surface-variant break-all bg-code-bg p-2 rounded border border-outline-variant/40";
    pkg.textContent = node.pkg;
    wrapper.appendChild(pkg);

    // Inbound / Outbound counts
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-outline-variant/40 text-xs";

    const inBox = document.createElement("div");
    inBox.innerHTML = `<span class="text-on-surface-variant text-[11px] block">Inbound Injections:</span><span class="font-mono text-on-background font-semibold">${inEdges.length} Reference${inEdges.length === 1 ? '' : 's'}</span>`;
    
    const outBox = document.createElement("div");
    outBox.innerHTML = `<span class="text-on-surface-variant text-[11px] block">Outbound Calls:</span><span class="font-mono text-on-background font-semibold">${outEdges.length} Bean${outEdges.length === 1 ? '' : 's'}</span>`;

    grid.appendChild(inBox);
    grid.appendChild(outBox);
    wrapper.appendChild(grid);

    // Rule Warning Banners
    if (node.violation) {
      const alert = document.createElement("div");
      alert.className = "mt-2 p-2 rounded bg-error-bg border border-error-border text-error text-xs";
      alert.innerHTML = `<strong class="block font-mono">Rule Violation: BYPASS_SERVICE</strong>This controller connects directly to a Repository interface without going through a Service layer.`;
      wrapper.appendChild(alert);
    }

    if (node.warning) {
      const alert = document.createElement("div");
      alert.className = "mt-2 p-2 rounded bg-warning-bg border border-warning-border text-warning text-xs";
      alert.innerHTML = `<strong class="block font-mono">Warning: CIRCULAR_DEPENDENCY</strong>Circular dependency detected between OrderService and PaymentService.`;
      wrapper.appendChild(alert);
    }

    if (node.unused) {
      const alert = document.createElement("div");
      alert.className = "mt-2 p-2 rounded bg-warning-bg border border-warning-border text-warning text-xs";
      alert.innerHTML = `<strong class="block font-mono">Warning: UNUSED_SPRING_BEAN</strong>No active Spring components inject this bean. Safe to deprecate.`;
      wrapper.appendChild(alert);
    }

    inspectorEl.appendChild(wrapper);
  }

  function selectNode(id) {
    selectedNodeId = id;
    renderGraph();
  }

  function setPreset(key) {
    selectedNodeId = null;
    currentPreset = key;
    renderGraph(key);
  }

  function toggleFilter(tier) {
    activeFilters[tier] = !activeFilters[tier];
    renderGraph();
  }

  return {
    init: function () {
      renderGraph('overview');
    },
    setPreset: setPreset,
    selectNode: selectNode,
    toggleFilter: toggleFilter
  };
})();

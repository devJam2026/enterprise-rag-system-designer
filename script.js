// ----------------------------------------------------
// Interactive RAG Architecture Diagram Stage Data
// ----------------------------------------------------
const stagesData = {
  documents: {
    title: "Raw Documents Ingestion",
    badge: "Ingestion Stage",
    badgeClass: "badge-primary",
    desc: "Ingesting diverse file types (PDFs, Markdown, Word, APIs, databases) at enterprise scale. Requires handling OCR, tables, and document layout parsing.",
    challenge: "Maintaining hierarchy and inline table relationships without breaking context.",
    learning: "Learn to build multi-format ingestion connectors with layout-aware parsers."
  },
  ingestion: {
    title: "Document Cleaning & Normalization",
    badge: "Ingestion Stage",
    badgeClass: "badge-primary",
    desc: "Pre-processing raw text: removing boilerplate code, header/footer text, HTML tags, duplicate pages, and normalizing encodings.",
    challenge: "Handling corrupted file outputs, odd characters, and removing navigational noise.",
    learning: "Building rule-based text normalizers and structured JSON schema transformers."
  },
  chunking: {
    title: "Smart Document Chunking",
    badge: "Processing Stage",
    badgeClass: "badge-cyan",
    desc: "Splitting normalized text into optimal segments. Compares fixed-size, recursive character splits, and semantic (embedding-based distance) chunking.",
    challenge: "Avoiding cutting off mid-sentence or dropping vital context across chunk splits.",
    learning: "Designing semantic chunking algorithms and testing sliding window token overlays."
  },
  metadata: {
    title: "Metadata Enrichment",
    badge: "Processing Stage",
    badgeClass: "badge-cyan",
    desc: "Attaching structural tags to chunks: creation dates, categories, authors, security access levels, and synthetic summary tags.",
    challenge: "Automatic classification latency and indexing metadata fields cleanly in Vector DB.",
    learning: "Integrating LLM summarizers for parent-child relationship tagging."
  },
  embeddings: {
    title: "Embedding Generation",
    badge: "Indexing Stage",
    badgeClass: "badge-purple",
    desc: "Transforming text chunks into high-dimensional vector representations using models (e.g., text-embedding-3-small, Cohere, local models).",
    challenge: "Adapting embeddings to specialized domain terminologies (medical, legal, financial).",
    learning: "Benchmarking dimensionality reduction and fine-tuning embeddings on domain terms."
  },
  vectordb: {
    title: "Vector Database Indexing",
    badge: "Indexing Stage",
    badgeClass: "badge-purple",
    desc: "Storing vectors in highly-scalable index structures (HNSW, IVF) inside DBs like Qdrant, Pinecone, or Weaviate.",
    challenge: "Balancing search recall accuracy vs index compilation speed and RAM utilization.",
    learning: "Configuring vector quantization and optimizing HNSW search parameter tradeoffs."
  },
  retrieval: {
    title: "Hybrid Retrieval Layer",
    badge: "Retrieval Stage",
    badgeClass: "badge-success",
    desc: "Merging Dense Vector search (semantic alignment) with Sparse BM25 keyword matching using Reciprocal Rank Fusion (RRF).",
    challenge: "Weighting vector similarity vs exact term search results for user search phrases.",
    learning: "Writing custom RRF search functions and tuning weights for dense vs sparse signals."
  },
  reranking: {
    title: "Cross-Encoder Reranking",
    badge: "Retrieval Stage",
    badgeClass: "badge-success",
    desc: "Feeding the top retrieval results into a heavier, highly accurate Cross-Encoder model to determine exact relevance scores.",
    challenge: "High inference latency addition to search pipelines (often adding 150-400ms).",
    learning: "Setting up lightweight local reranker models and implementing latency guardrails."
  },
  context: {
    title: "Dynamic Context Builder",
    badge: "Generation Stage",
    badgeClass: "badge-warning",
    desc: "Assembling reranked chunks into the LLM context window, utilizing token trimming, summarization, and prompt templates.",
    challenge: "Handling context window limits and avoiding the 'Lost in the Middle' effect.",
    learning: "Designing token counter pipelines and implementing parent document retriever context fills."
  },
  llm: {
    title: "LLM Generation Layer",
    badge: "Generation Stage",
    badgeClass: "badge-warning",
    desc: "Sending the prompt to LLM providers (Gemini, Claude, GPT) to synthesize a coherent natural language answer based on retrieved context.",
    challenge: "Preventing pre-trained knowledge leaks (hallucinations) from overwriting actual context facts.",
    learning: "Configuring system prompts to enforce strict ground-truth generation guidelines."
  },
  citations: {
    title: "Citation & Attribution Engine",
    badge: "Generation Stage",
    badgeClass: "badge-warning",
    desc: "Mapping specific claims in the generated response back to precise source chunks, generating page/paragraph index links.",
    challenge: "Enforcing sentence-level alignment verification to ensure citations are correct.",
    learning: "Writing post-processing regex parsing engines and semantic citation mappings."
  },
  eval: {
    title: "Real-time Evaluation Layer",
    badge: "Diagnostics Stage",
    badgeClass: "badge-danger",
    desc: "Continuously scoring generations on Faithfulness, Answer Relevance, Context Precision, and Recall using metrics models (Ragas/TruLens).",
    challenge: "High LLM API cost when running automated evaluations on every single user interaction.",
    learning: "Designing sampled evaluation test-harnesses and using smaller models for evaluation grading."
  },
  observability: {
    title: "Observability & Tracing",
    badge: "Diagnostics Stage",
    badgeClass: "badge-danger",
    desc: "Tracking spans, latencies, tokens, and prompt chains across every RAG pipeline step using OpenTelemetry, Phoenix, or LangSmith.",
    challenge: "Performance debugging across distributed microservices (ingestion workers vs vector lookup).",
    learning: "Instrumenting OpenTelemetry traces and monitoring cost/QPS dashboards."
  }
};

// Handle Stage Clicking
function selectStage(stageId) {
  const data = stagesData[stageId];
  if (!data) return;

  // Toggle active class in UI
  document.querySelectorAll('.diagram-node').forEach(node => {
    node.classList.remove('active');
  });
  
  const selectedNode = document.querySelector(`[data-stage="${stageId}"]`);
  if (selectedNode) selectedNode.classList.add('active');

  // Update Detail Panel
  document.getElementById('stage-title').innerText = data.title;
  document.getElementById('stage-badge').innerText = data.badge;
  document.getElementById('stage-badge').className = `stage-badge ${data.badgeClass}`;
  document.getElementById('stage-desc').innerText = data.desc;
  document.getElementById('stage-challenge').innerText = data.challenge;
  document.getElementById('stage-learning').innerText = data.learning;
}

// ----------------------------------------------------
// Architecture Simulator Calculator Logic
// ----------------------------------------------------
const config = {
  scale: '100K',
  retrieval: 'hybrid',
  reranking: 'on',
  citation: 'strict',
  evaluation: 'basic'
};

function selectOption(param, val, btnElement) {
  // Update state
  config[param] = val;

  // Update button visual styles
  const siblings = btnElement.parentElement.querySelectorAll('.selector-btn');
  siblings.forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  // Re-run calculations
  calculateMetrics();
}

function calculateMetrics() {
  // 1. Retrieval Precision
  let precision = 70;
  if (config.retrieval === 'vector') precision = 72;
  if (config.retrieval === 'bm25') precision = 52;
  if (config.retrieval === 'hybrid') precision = 84;

  if (config.reranking === 'on') precision += 11;
  if (config.evaluation === 'full') precision += 3;
  precision = Math.min(precision, 98);

  // 2. Latency (ms)
  let latency = 120;
  if (config.scale === '10K') latency = 100;
  if (config.scale === '100K') latency = 130;
  if (config.scale === '1M') latency = 210;
  if (config.scale === '10M') latency = 340;

  if (config.retrieval === 'hybrid') latency += 120;
  else if (config.retrieval === 'vector') latency += 60;
  else latency += 30;

  if (config.reranking === 'on') latency += 280;
  if (config.citation === 'strict') latency += 70;
  if (config.evaluation === 'full') latency += 150;

  // 3. Cost (Monthly simulated)
  let baseCost = 25;
  if (config.scale === '10K') baseCost = 15;
  if (config.scale === '100K') baseCost = 85;
  if (config.scale === '1M') baseCost = 420;
  if (config.scale === '10M') baseCost = 1850;

  if (config.reranking === 'on') baseCost += (baseCost * 0.15);
  if (config.evaluation === 'basic') baseCost += 50;
  if (config.evaluation === 'full') baseCost += 250;

  // 4. Hallucination Risk
  let risk = 45;
  if (config.retrieval === 'hybrid') risk -= 10;
  if (config.reranking === 'on') risk -= 15;
  if (config.citation === 'strict') risk -= 10;
  if (config.evaluation === 'basic') risk -= 5;
  if (config.evaluation === 'full') risk -= 12;
  risk = Math.max(5, risk);

  // 5. Confidence Score
  let confidence = (precision - (risk / 3)).toFixed(1);

  // Update UI Elements with smooth animations
  updateMetricBar('metric-precision', precision, '%');
  updateMetricBar('metric-latency', latency, ' ms');
  updateMetricBar('metric-cost', baseCost, '', true);
  updateMetricBar('metric-risk', risk, '%');
  updateMetricBar('metric-confidence', confidence, '%');

  // Trigger evaluation dashboard updates
  updateEvalDashboard(precision, risk);
}

function updateMetricBar(elementId, value, suffix, isCost = false) {
  const fill = document.getElementById(`${elementId}-fill`);
  const text = document.getElementById(`${elementId}-val`);
  
  if (!fill || !text) return;

  // Render text value
  if (isCost) {
    text.innerText = `$${value.toLocaleString()}`;
  } else {
    text.innerText = `${value}${suffix}`;
  }

  // Render progress bar percentage representation
  let percent = 50;
  if (elementId.includes('precision') || elementId.includes('confidence')) {
    percent = value;
  } else if (elementId.includes('latency')) {
    percent = Math.min(100, (value / 1000) * 100);
  } else if (elementId.includes('cost')) {
    percent = Math.min(100, (value / 2500) * 100);
  } else if (elementId.includes('risk')) {
    percent = value;
  }

  fill.style.width = `${percent}%`;
}

// ----------------------------------------------------
// RAG Evaluation Dashboard Update Logic
// ----------------------------------------------------
function updateEvalDashboard(precision, risk) {
  // Compute individual standard RAGAS metrics based on simulator inputs
  const faithfulness = Math.round(100 - risk * 0.95);
  const relevance = Math.round(precision * 0.96);
  const contextPrecision = Math.round(precision - 2);
  const contextRecall = Math.round(precision - 6);
  const groundedness = Math.round(100 - risk);
  const citationCoverage = config.citation === 'strict' ? 96 : 74;

  const evals = {
    faithfulness: faithfulness,
    relevance: relevance,
    precision: contextPrecision,
    recall: contextRecall,
    groundedness: groundedness,
    citation: citationCoverage
  };

  Object.keys(evals).forEach(key => {
    const val = evals[key];
    const ring = document.getElementById(`ring-fill-${key}`);
    const text = document.getElementById(`ring-text-${key}`);

    if (ring && text) {
      // StrokeDasharray is 283 (approx circumference of circle diameter=90)
      const offset = 283 - (283 * val) / 100;
      ring.style.strokeDashoffset = offset;
      text.innerText = `${val}%`;

      // Set coloring based on value threshold
      if (val >= 85) {
        ring.setAttribute('stroke', 'var(--color-emerald)');
      } else if (val >= 70) {
        ring.setAttribute('stroke', 'var(--color-amber)');
      } else {
        ring.setAttribute('stroke', 'var(--color-rose)');
      }
    }
  });
}

// Page Initialize
window.onload = () => {
  // Pre-select Document block on load
  selectStage('documents');
  
  // Compute initial simulator values
  calculateMetrics();
};

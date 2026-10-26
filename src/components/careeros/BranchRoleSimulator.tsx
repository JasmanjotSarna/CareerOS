'use client';

import React, { useState } from 'react';

interface MetricItem {
  name: string;
  current: number;
  target: number;
  category: string;
}

interface RoadmapPhase {
  title: string;
  duration: string;
  focus: string;
  outcome: string;
}

interface CalibrationData {
  roleTitle: string;
  readinessScore: number;
  matchTier: string;
  metrics: MetricItem[];
  roadmap: RoadmapPhase[];
  finding: string;
}

const BRANCHES = [
  { id: 'cse', name: 'Computer Science & Engineering', short: 'CSE' },
  { id: 'aids', name: 'AI & Data Science', short: 'AI & DS' },
  { id: 'ece', name: 'Electronics & Communication', short: 'ECE' },
  { id: 'it', name: 'Information Technology', short: 'IT' },
];

const ROLES = [
  { id: 'sde', name: 'SDE-1 (Full Stack & Systems)' },
  { id: 'cloud', name: 'Cloud Infrastructure Engineer' },
  { id: 'data', name: 'Data & Analytics Engineer' },
  { id: 'embedded', name: 'Core Embedded Systems Engineer' },
];

const SIMULATION_MATRIX: Record<string, Record<string, CalibrationData>> = {
  cse: {
    sde: {
      roleTitle: 'SDE-1 (Full Stack & Systems)',
      readinessScore: 84,
      matchTier: 'Day-1 High Readiness',
      metrics: [
        { name: 'CBT: Trees, Graphs & DP', current: 82, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Structured Technical Pacing', current: 90, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Distributed Systems & Caching', current: 74, target: 80, category: 'Domain Competency' },
        { name: 'Domain: API & Database Indexing', current: 86, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Graph Algorithms & Dynamic Programming', duration: 'Weeks 1–3', focus: 'Reinforce CBT competitive mock runs with daily LeetCode medium sequences', outcome: 'Target score: 88%' },
        { title: 'Phase B: Redis & Distributed Caching Architecture', duration: 'Weeks 4–7', focus: 'Implement distributed locking and cluster failover in portfolio repository', outcome: 'Resolves primary gap' },
        { title: 'Phase C: Live AI Technical & System Design Interviews', duration: 'Weeks 8–12', focus: 'Simulate high-concurrency architecture defense with line-by-line critique', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Distributed caching and lock contention. 6 hours of targeted design drills closes the delta.',
    },
    cloud: {
      roleTitle: 'Cloud Infrastructure Engineer',
      readinessScore: 78,
      matchTier: 'Targeted Gap Closing',
      metrics: [
        { name: 'CBT: Shell Scripting & Systems Aptitude', current: 85, target: 80, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Explanation & STAR Drills', current: 84, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Kubernetes & Container Orchestration', current: 68, target: 82, category: 'Domain Competency' },
        { name: 'Domain: CI/CD Pipelines & Terraform IaC', current: 75, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Kubernetes Networking & Ingress Controllers', duration: 'Weeks 1–4', focus: 'Cluster configuration, service meshes, and Helm chart packaging', outcome: 'Target score: 80%' },
        { title: 'Phase B: Infrastructure as Code with Terraform', duration: 'Weeks 5–8', focus: 'Multi-region AWS provisioning with state locking and secrets rotation', outcome: 'Resolves IaC gap' },
        { title: 'Phase C: Production Outage Postmortem Simulation', duration: 'Weeks 9–12', focus: 'Live incident triage and root-cause analysis presentation drills', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Kubernetes service mesh and ingress routing. 12 hands-on labs scheduled.',
    },
    data: {
      roleTitle: 'Data & Analytics Engineer',
      readinessScore: 81,
      matchTier: 'Strong Alignment',
      metrics: [
        { name: 'CBT: SQL Window Functions & Optimization', current: 88, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Data Storytelling & Stakeholder Briefs', current: 86, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: PySpark & Distributed Batch Pipelines', current: 72, target: 82, category: 'Domain Competency' },
        { name: 'Domain: Data Warehousing (Snowflake/BigQuery)', current: 78, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: PySpark Optimization & Memory Management', duration: 'Weeks 1–4', focus: 'Partitioning strategies, broadcast joins, and query plan diagnosis', outcome: 'Target score: 84%' },
        { title: 'Phase B: Dimensional Modeling & Modern Warehouse Architecture', duration: 'Weeks 5–8', focus: 'Star schemas, slowly changing dimensions, and dbt transformations', outcome: 'Resolves warehouse gap' },
        { title: 'Phase C: Live Mock Data Modeling Interviews', duration: 'Weeks 9–12', focus: 'High-throughput stream-and-batch architecture whiteboard sessions', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Spark broadcast joins and partition skew in high-volume workloads.',
    },
    embedded: {
      roleTitle: 'Core Embedded Systems Engineer',
      readinessScore: 69,
      matchTier: 'Foundational Bridge Required',
      metrics: [
        { name: 'CBT: Bit Manipulation & C Pointers', current: 75, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Hardware Architecture Clarification', current: 82, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: RTOS Task Scheduling & Interrupts', current: 58, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Low-Level Protocols (I2C, SPI, UART)', current: 62, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: FreeRTOS Kernel Primitives & Mutexes', duration: 'Weeks 1–4', focus: 'Priority inversion, semaphores, and memory management units in ARM Cortex', outcome: 'Target score: 76%' },
        { title: 'Phase B: Bare-Metal Driver Development & Oscilloscope Logic', duration: 'Weeks 5–8', focus: 'Register-level peripheral configuration and DMA transfers', outcome: 'Resolves protocol gap' },
        { title: 'Phase C: Embedded Firmware Technical Interview Defense', duration: 'Weeks 9–12', focus: 'Deterministic latency constraints and race condition debugging', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: FreeRTOS context switching and interrupt latency timing constraints.',
    },
  },
  aids: {
    sde: {
      roleTitle: 'SDE-1 (Full Stack & Systems)',
      readinessScore: 79,
      matchTier: 'Day-1 Readiness with Focus',
      metrics: [
        { name: 'CBT: Algorithm Complexity & Tree Traversal', current: 80, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Clear Architecture Articulation', current: 88, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Backend Concurrency & Thread Pools', current: 70, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Clean API Design & Contract Testing', current: 78, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Concurrent Programming & Deadlock Prevention', duration: 'Weeks 1–3', focus: 'Thread synchronization, async event loops, and worker queues', outcome: 'Target score: 82%' },
        { title: 'Phase B: Enterprise Backend Design & Redis Caching', duration: 'Weeks 4–7', focus: 'Production microservice architecture with contract testing', outcome: 'Resolves backend gap' },
        { title: 'Phase C: Live AI System Design Defense', duration: 'Weeks 8–12', focus: 'Scalable service mocking under high concurrent load', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Backend thread-pool management and async worker concurrency.',
    },
    cloud: {
      roleTitle: 'Cloud Infrastructure Engineer',
      readinessScore: 76,
      matchTier: 'Targeted Gap Closing',
      metrics: [
        { name: 'CBT: Linux Internals & Systems Aptitude', current: 80, target: 80, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Precision in STAR Format', current: 85, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Cloud ML Infrastructure & GPU Clusters', current: 75, target: 82, category: 'Domain Competency' },
        { name: 'Domain: Terraform & Container Orchestration', current: 65, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Multi-Node Kubernetes & GPU Operator Setup', duration: 'Weeks 1–4', focus: 'KubeRay, Triton Inference Server, and persistent volume autoscaling', outcome: 'Target score: 80%' },
        { title: 'Phase B: Terraform for Scalable Cloud Architectures', duration: 'Weeks 5–8', focus: 'Automated CI/CD deployment with state management and security auditing', outcome: 'Resolves IaC gap' },
        { title: 'Phase C: Production Cloud Reliability Interview Simulation', duration: 'Weeks 9–12', focus: 'SLA guarantees, failure domains, and cost optimization drills', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Kubernetes GPU scheduling and cluster state persistence.',
    },
    data: {
      roleTitle: 'Data & Analytics Engineer',
      readinessScore: 89,
      matchTier: 'Top Tier Readiness',
      metrics: [
        { name: 'CBT: SQL Window Functions & Analytical Math', current: 92, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Evidence-Based Executive Briefs', current: 90, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Distributed Spark & Feature Stores', current: 85, target: 82, category: 'Domain Competency' },
        { name: 'Domain: Modern Data Warehouse (dbt, Snowflake)', current: 88, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: High-Throughput Streaming with Kafka & Flink', duration: 'Weeks 1–4', focus: 'Event-driven ingestion, backpressure tuning, and schema registries', outcome: 'Target score: 92%' },
        { title: 'Phase B: Advanced Feature Pipeline Engineering', duration: 'Weeks 5–8', focus: 'Point-in-time correctness, data lineage, and automated regression tests', outcome: 'Advanced mastery' },
        { title: 'Phase C: Enterprise Data Architect Mock Reviews', duration: 'Weeks 9–12', focus: 'System architecture defense with tier-1 recruiters rubric', outcome: 'Placement ready pass' },
      ],
      finding: 'Strength: Exceptional SQL optimization and distributed pipeline fundamentals.',
    },
    embedded: {
      roleTitle: 'Core Embedded Systems Engineer',
      readinessScore: 64,
      matchTier: 'Foundational Bridge Required',
      metrics: [
        { name: 'CBT: Low-Level Memory Management', current: 68, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Problem Decomposition', current: 84, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Hardware Register Programming & C', current: 52, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Microcontroller Architecture (ARM/ESP32)', current: 54, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: C Programming & Direct Memory Addressing', duration: 'Weeks 1–4', focus: 'Pointers, memory alignment, bitwise operators, and linker scripts', outcome: 'Target score: 70%' },
        { title: 'Phase B: Embedded Microcontroller Peripheral Drivers', duration: 'Weeks 5–8', focus: 'Timers, UART communication, ADC sampling, and interrupt service routines', outcome: 'Resolves hardware gap' },
        { title: 'Phase C: Real-Time Operating Systems Fundamentals', duration: 'Weeks 9–12', focus: 'Task priorities, queue synchronization, and deadlocks in FreeRTOS', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Low-level bitwise operations and bare-metal microcontroller control.',
    },
  },
  ece: {
    sde: {
      roleTitle: 'SDE-1 (Full Stack & Systems)',
      readinessScore: 72,
      matchTier: 'Targeted Gap Closing',
      metrics: [
        { name: 'CBT: Data Structures & Dynamic Programming', current: 72, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Discussion & Pacing', current: 86, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Web Architecture & Database Systems', current: 64, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Object-Oriented Design Principles', current: 76, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Advanced Data Structures & Sorting Optimization', duration: 'Weeks 1–4', focus: 'Tree traversals, graph algorithms, and heap implementations', outcome: 'Target score: 80%' },
        { title: 'Phase B: Relational Database Schema Design & ACID', duration: 'Weeks 5–8', focus: 'Normalization, indexing, join execution plans, and transaction isolation', outcome: 'Resolves DB gap' },
        { title: 'Phase C: Full-Stack Project Defense in AI Technical Studio', duration: 'Weeks 9–12', focus: 'End-to-end API latency, caching tiers, and code review defense', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Non-linear data structures (trees/graphs) and database indexing.',
    },
    cloud: {
      roleTitle: 'Cloud Infrastructure Engineer',
      readinessScore: 75,
      matchTier: 'Targeted Gap Closing',
      metrics: [
        { name: 'CBT: Networking Fundamentals (TCP/IP, DNS)', current: 88, target: 80, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Structured Incident Narration', current: 84, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Linux Administration & Shell Automation', current: 74, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Cloud Virtualization & Security Groups', current: 65, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Linux System Administration & BASH Automation', duration: 'Weeks 1–4', focus: 'Process signals, storage management, and networking sockets', outcome: 'Target score: 82%' },
        { title: 'Phase B: Cloud VPC Architecture & Security Groups', duration: 'Weeks 5–8', focus: 'Subnet routing, NAT gateways, peering, and IAM policy enforcement', outcome: 'Resolves cloud gap' },
        { title: 'Phase C: Live SRE Incident Response Drill', duration: 'Weeks 9–12', focus: 'Root cause analysis and network latency troubleshooting interviews', outcome: 'Placement ready pass' },
      ],
      finding: 'Strength: Exceptional physical and transport layer networking comprehension.',
    },
    data: {
      roleTitle: 'Data & Analytics Engineer',
      readinessScore: 71,
      matchTier: 'Targeted Gap Closing',
      metrics: [
        { name: 'CBT: Applied Mathematics & Matrix Math', current: 86, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Communication in BET Drills', current: 85, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: SQL Queries & Relational Aggregations', current: 62, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Python Data Pipelines & Pandas', current: 66, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Comprehensive SQL Mastery & Query Tuning', duration: 'Weeks 1–4', focus: 'Aggregations, CTEs, window functions, and indexing strategies', outcome: 'Target score: 78%' },
        { title: 'Phase B: Production Python ETL Pipeline Architecture', duration: 'Weeks 5–8', focus: 'Airflow scheduling, error handling, data contracts, and schema validation', outcome: 'Resolves ETL gap' },
        { title: 'Phase C: Analytical Whiteboard Technical Rounds', duration: 'Weeks 9–12', focus: 'End-to-end data pipeline latency and throughput optimization', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Complex SQL joins and multi-step ETL orchestration.',
    },
    embedded: {
      roleTitle: 'Core Embedded Systems Engineer',
      readinessScore: 88,
      matchTier: 'Top Tier Readiness',
      metrics: [
        { name: 'CBT: Microcontroller Circuits & C Memory', current: 90, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Hardware Technical Defense & Clarity', current: 86, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Real-Time Operating Systems (FreeRTOS)', current: 84, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Bus Protocols (CAN, SPI, I2C, UART)', current: 92, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Real-Time Kernel Scheduling & Priority Inversion', duration: 'Weeks 1–4', focus: 'Task switching, ring buffers, and critical section protection', outcome: 'Target score: 92%' },
        { title: 'Phase B: Hardware-in-the-Loop Simulation & CAN Bus Testing', duration: 'Weeks 5–8', focus: 'Automotive and industrial protocol validation with zero frame loss', outcome: 'Advanced mastery' },
        { title: 'Phase C: Core Engineering Interview Defense', duration: 'Weeks 9–12', focus: 'Firmware memory constraints and ultra-low power state transitions', outcome: 'Placement ready pass' },
      ],
      finding: 'Strength: Outstanding mastery of microcontroller buses and protocol timing.',
    },
  },
  it: {
    sde: {
      roleTitle: 'SDE-1 (Full Stack & Systems)',
      readinessScore: 86,
      matchTier: 'Day-1 High Readiness',
      metrics: [
        { name: 'CBT: Trees, Graphs & Recursion', current: 84, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: STAR Behavioral & Leadership Tone', current: 92, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Web Services, REST & GraphQL', current: 88, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Database Optimization & Caching', current: 79, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: High-Concurrency Tree & Graph Traversal Drills', duration: 'Weeks 1–3', focus: 'CBT mock coding drills under strict 30-minute time limits', outcome: 'Target score: 89%' },
        { title: 'Phase B: Redis Cache Layer & Distributed Locking', duration: 'Weeks 4–7', focus: 'Database read replicas, write invalidation, and connection pooling', outcome: 'Resolves database gap' },
        { title: 'Phase C: Live Mock Technical & Cultural Fit Rounds', duration: 'Weeks 8–12', focus: 'Full system architecture defense with tier-1 interview rubrics', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Distributed locking and cache invalidation under burst traffic.',
    },
    cloud: {
      roleTitle: 'Cloud Infrastructure Engineer',
      readinessScore: 82,
      matchTier: 'Day-1 High Readiness',
      metrics: [
        { name: 'CBT: Linux CLI & Networking Protocols', current: 86, target: 80, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Technical Incident Postmortems', current: 88, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Docker, Containerization & CI/CD', current: 84, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Cloud IAM Security & Kubernetes', current: 72, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Kubernetes Pod Security & Service Meshes', duration: 'Weeks 1–4', focus: 'RBAC policies, network policies, and Istio traffic management', outcome: 'Target score: 82%' },
        { title: 'Phase B: Production Terraform & Multi-Region Setup', duration: 'Weeks 5–8', focus: 'Infrastructure state locking, automated canary deploys, and rollback', outcome: 'Resolves cloud gap' },
        { title: 'Phase C: SRE High-Availability Interview Simulation', duration: 'Weeks 9–12', focus: 'Simulated disaster recovery drills and latency budgeting', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Kubernetes RBAC and network segmentation policies.',
    },
    data: {
      roleTitle: 'Data & Analytics Engineer',
      readinessScore: 80,
      matchTier: 'Day-1 Readiness with Focus',
      metrics: [
        { name: 'CBT: SQL Window Functions & Aggregation', current: 86, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Data Storytelling & Presentation', current: 88, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: Data Pipelines with Airflow & Python', current: 76, target: 80, category: 'Domain Competency' },
        { name: 'Domain: Cloud Data Warehousing (BigQuery)', current: 74, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: High-Reliability Airflow DAG Orchestration', duration: 'Weeks 1–4', focus: 'Idempotency, retries, sensors, and task isolation', outcome: 'Target score: 82%' },
        { title: 'Phase B: Cloud Data Warehouse Query Partitioning', duration: 'Weeks 5–8', focus: 'Clustering, materialized views, and cost governance', outcome: 'Resolves warehouse gap' },
        { title: 'Phase C: Real-Time Analytical Whiteboard Rounds', duration: 'Weeks 9–12', focus: 'Stream processing latency and schema evolution interviews', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: BigQuery partitioning optimization and data pipeline idempotency.',
    },
    embedded: {
      roleTitle: 'Core Embedded Systems Engineer',
      readinessScore: 65,
      matchTier: 'Foundational Bridge Required',
      metrics: [
        { name: 'CBT: Bitwise Operations & Pointers', current: 68, target: 85, category: 'CBT (DSA/Aptitude)' },
        { name: 'BET: Engineering Clarity & Precision', current: 86, target: 80, category: 'BET (Communication)' },
        { name: 'Domain: C Programming for Microcontrollers', current: 56, target: 80, category: 'Domain Competency' },
        { name: 'Domain: RTOS & Low-Level Hardware Drivers', current: 52, target: 80, category: 'Domain Competency' },
      ],
      roadmap: [
        { title: 'Phase A: Embedded C & Memory Mapping Drills', duration: 'Weeks 1–4', focus: 'Pointers to registers, volatile keywords, and hardware interrupts', outcome: 'Target score: 72%' },
        { title: 'Phase B: Bare-Metal Driver Implementation (SPI/I2C)', duration: 'Weeks 5–8', focus: 'Sensor interfacing and DMA memory buffer transactions', outcome: 'Resolves driver gap' },
        { title: 'Phase C: Real-Time System Interview Defense', duration: 'Weeks 9–12', focus: 'Timing constraints and concurrency hazards in FreeRTOS', outcome: 'Placement ready pass' },
      ],
      finding: 'Primary gap: Volatile pointer access and real-time microcontroller drivers.',
    },
  },
};

export function BranchRoleSimulator() {
  const [selectedBranch, setSelectedBranch] = useState('cse');
  const [selectedRole, setSelectedRole] = useState('sde');

  const branchData = SIMULATION_MATRIX[selectedBranch] || SIMULATION_MATRIX.cse;
  const currentData = branchData[selectedRole] || branchData.sde;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-rise">
      {/* Selector Ribbon: Mobile thumb-friendly with min 44px touch targets */}
      <div className="space-y-6 bg-[#d3d2ce] dark:bg-[#24231f] p-6 md:p-8 rounded-2xl">
        {/* Step 1: Branch Picker */}
        <div>
          <label className="block text-sm font-semibold text-[#5f5d55] dark:text-[#a6a49c] mb-3">
            Select academic branch
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BRANCHES.map((b) => {
              const active = b.id === selectedBranch;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranch(b.id)}
                  className={`min-h-[48px] px-3.5 py-3 rounded-xl text-left transition-colors text-sm font-medium flex flex-col justify-center active:scale-[0.97] ${
                    active
                      ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                      : 'bg-[#cac9c4] text-[#26251e] hover:bg-[#bebcb5] dark:bg-[#2d2c27] dark:text-[#edece8] dark:hover:bg-[#383731]'
                  }`}
                >
                  <span className="font-bold text-base leading-tight">{b.short}</span>
                  <span className="truncate opacity-90 text-xs">{b.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Target Role Picker */}
        <div>
          <label className="block text-sm font-semibold text-[#5f5d55] dark:text-[#a6a49c] mb-3">
            Select target industry role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ROLES.map((r) => {
              const active = r.id === selectedRole;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`min-h-[48px] px-4 py-3 rounded-xl text-left transition-colors text-sm font-semibold flex items-center justify-between active:scale-[0.97] ${
                    active
                      ? 'bg-[#2456d6] text-white dark:bg-[#4a7cf6] dark:text-white'
                      : 'bg-[#cac9c4] text-[#26251e] hover:bg-[#bebcb5] dark:bg-[#2d2c27] dark:text-[#edece8] dark:hover:bg-[#383731]'
                  }`}
                >
                  <span className="leading-tight">{r.name}</span>
                  {active && (
                    <span className="ml-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Output: Skill-Gap Needle Meters & 90-Day Adaptive Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Overall Suitability & Skill Gaps */}
        <div className="lg:col-span-6 space-y-6 bg-[#d3d2ce] dark:bg-[#24231f] p-6 md:p-8 rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c] font-medium">
                Calibrated Suitability Index
              </p>
              <h4 className="text-2xl sm:text-3xl font-bold text-[#26251e] dark:text-[#edece8] mt-1">
                {currentData.roleTitle}
              </h4>
              <p className="text-sm text-[#2456d6] dark:text-[#4a7cf6] font-semibold mt-0.5">
                {currentData.matchTier}
              </p>
            </div>
            <div className="text-right">
              <span className="text-5xl font-extrabold text-[#26251e] dark:text-[#edece8] tracking-tight">
                {currentData.readinessScore}%
              </span>
              <p className="text-xs text-[#5f5d55] dark:text-[#a6a49c]">Gate: 78%</p>
            </div>
          </div>

          {/* Granular Pillar Meters */}
          <div className="space-y-4 pt-2">
            <p className="text-sm font-semibold text-[#5f5d55] dark:text-[#a6a49c]">
              Four-pillar gap breakdown
            </p>
            {currentData.metrics.map((m) => {
              const delta = m.target - m.current;
              const isPassing = m.current >= m.target;
              return (
                <div key={m.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#26251e] dark:text-[#edece8]">{m.name}</span>
                    <span className="text-[#5f5d55] dark:text-[#a6a49c]">
                      {m.current}% / <span className="opacity-75">Target {m.target}%</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#bebcb5] dark:bg-[#383731] overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-[width] duration-300 ${
                        isPassing ? 'bg-[#2456d6] dark:bg-[#4a7cf6]' : 'bg-[#e07a2a]'
                      }`}
                      style={{ width: `${Math.min(100, m.current)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[#5f5d55] dark:text-[#a6a49c]">
                    <span>{m.category}</span>
                    <span className={isPassing ? 'text-[#2456d6] dark:text-[#4a7cf6] font-semibold' : 'text-[#e07a2a] font-semibold'}>
                      {isPassing ? 'Gate Satisfied' : `Gap: -${delta}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stated Finding */}
          <div className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] text-sm text-[#26251e] dark:text-[#edece8]">
            <p className="font-semibold text-[#2456d6] dark:text-[#4a7cf6] mb-1">
              Automated diagnostic finding
            </p>
            <p className="leading-relaxed">{currentData.finding}</p>
          </div>
        </div>

        {/* Right Column: 90-Day Adaptive Sprint Roadmap */}
        <div className="lg:col-span-6 space-y-6 bg-[#d3d2ce] dark:bg-[#24231f] p-6 md:p-8 rounded-2xl">
          <div>
            <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c] font-medium">
              Autonomous Progression Sprint
            </p>
            <h4 className="text-2xl sm:text-3xl font-bold text-[#26251e] dark:text-[#edece8] mt-1">
              90-Day Adaptive Roadmap
            </h4>
            <p className="text-sm text-[#5f5d55] dark:text-[#a6a49c] mt-0.5">
              Sequenced to eliminate largest competency deltas first
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {currentData.roadmap.map((phase) => (
              <div
                key={phase.title}
                className="p-4 rounded-xl bg-[#cac9c4] dark:bg-[#2d2c27] space-y-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#26251e] dark:text-[#edece8]">
                    {phase.title}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#bebcb5] dark:bg-[#383731] font-semibold text-[#2456d6] dark:text-[#4a7cf6] text-xs">
                    {phase.duration}
                  </span>
                </div>
                <p className="text-[#5f5d55] dark:text-[#a6a49c] leading-relaxed">
                  {phase.focus}
                </p>
                <p className="font-medium text-[#2456d6] dark:text-[#4a7cf6]">
                  Key Milestone: {phase.outcome}
                </p>
              </div>
            ))}
          </div>

          <div className="text-xs text-[#5f5d55] dark:text-[#a6a49c] pt-2">
            Calibrated on JECRC University BET and CBT syllabus requirements. Illustrative data.
          </div>
        </div>
      </div>
    </div>
  );
}

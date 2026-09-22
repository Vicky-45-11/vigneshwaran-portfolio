import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Rocket, Network, FolderGit2 } from 'lucide-react';

interface NodeData {
  id: string;
  label: string;
  type: 'Student' | 'Idea' | 'Project' | 'Team';
  x: number;
  y: number;
  info: string;
}

export const CampusConnectShowcase: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const nodes: NodeData[] = [
    { id: '1', label: 'Student Co-Founder', type: 'Student', x: 22, y: 30, info: 'Looking for full-stack developer with AI interest' },
    { id: '2', label: 'AI Campus Idea', type: 'Idea', x: 48, y: 20, info: 'Intelligent campus notes and collaboration tool' },
    { id: '3', label: 'Project Team Alpha', type: 'Team', x: 78, y: 35, info: 'Cross-functional engineering & product group' },
    { id: '4', label: 'Hackathon Project', type: 'Project', x: 35, y: 68, info: 'Building a student resource sharing hub' },
    { id: '5', label: 'Peer Collaborator', type: 'Student', x: 68, y: 72, info: 'Backend engineering & database architecture' },
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 3, to: 4 },
    { from: 1, to: 4 },
    { from: 2, to: 4 },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0B0B0B] border border-white/[0.1] p-5 sm:p-6 overflow-hidden relative shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4 text-[11px] font-mono text-[#71717A]">
        <div className="flex items-center gap-2">
          <Network size={14} className="text-cyan-400" />
          <span className="text-white font-semibold">CAMPUS COLLABORATION GRAPH</span>
        </div>
        <span className="text-cyan-400">Interactive Network</span>
      </div>

      {/* Interactive Node Graph Canvas / SVG */}
      <div className="relative w-full h-64 sm:h-72 bg-[#121212] rounded-xl border border-white/[0.06] overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        {/* SVG connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const start = nodes[conn.from];
            const end = nodes[conn.to];
            return (
              <line
                key={idx}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                stroke="rgba(59, 130, 246, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          return (
            <motion.div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              onMouseEnter={() => setSelectedNode(node)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.12 }}
              className="absolute z-10 cursor-pointer"
            >
              <div
                className={`p-2.5 rounded-full border transition-all duration-200 shadow-md ${
                  isSelected
                    ? 'bg-blue-600 border-white text-white shadow-blue-500/50 scale-110'
                    : 'bg-[#1a1a1a] border-white/20 text-[#A1A1AA] hover:border-blue-400 hover:text-white'
                }`}
              >
                {node.type === 'Student' && <Users size={16} />}
                {node.type === 'Idea' && <Lightbulb size={16} className="text-amber-400" />}
                {node.type === 'Team' && <Rocket size={16} className="text-cyan-400" />}
                {node.type === 'Project' && <FolderGit2 size={16} className="text-indigo-400" />}
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-mono text-[#A1A1AA] whitespace-nowrap bg-black/80 px-1.5 py-0.5 rounded border border-white/5">
                {node.label}
              </span>
            </motion.div>
          );
        })}

        {/* Selected Node Details Popup */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-lg bg-[#050505]/90 backdrop-blur-md border border-white/10 shadow-lg text-xs font-mono">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-400 font-bold uppercase">
              {selectedNode ? selectedNode.type : 'Select any node'}
            </span>
            <span className="text-[10px] text-[#71717A]">
              {selectedNode ? selectedNode.label : 'Network Graph'}
            </span>
          </div>
          <p className="text-[#A1A1AA] text-[11px] leading-tight">
            {selectedNode
              ? selectedNode.info
              : 'Click or hover over students, ideas, or projects to explore peer connections.'}
          </p>
        </div>
      </div>
    </div>
  );
};

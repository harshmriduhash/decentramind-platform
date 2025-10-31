'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CanvasNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  x: number;
  y: number;
  title: string;
  description: string;
}

const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: '1',
      type: 'start',
      x: 50,
      y: 100,
      title: 'Start',
      description: 'Workflow begins'
    },
    {
      id: '2',
      type: 'process',
      x: 200,
      y: 100,
      title: 'Process Data',
      description: 'Analyze input data'
    },
    {
      id: '3',
      type: 'decision',
      x: 350,
      y: 100,
      title: 'Decision Point',
      description: 'Check conditions'
    },
    {
      id: '4',
      type: 'end',
      x: 500,
      y: 100,
      title: 'End',
      description: 'Workflow complete'
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'process':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'decision':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'end':
        return 'bg-red-500/20 border-red-500 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  const getNodeShape = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return 'rounded-full';
      case 'decision':
        return 'rotate-45';
      default:
        return 'rounded-lg';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow Canvas</h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
          >
            Save Workflow
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
          >
            Export
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-900/50 rounded-lg border border-slate-700/30 h-96 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="canvas-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#canvas-grid)" className="text-slate-600"/>
          </svg>
        </div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none">
          {nodes.slice(0, -1).map((node, index) => {
            const nextNode = nodes[index + 1];
            if (!nextNode) return null;

            return (
              <motion.line
                key={`connection-${node.id}`}
                x1={node.x + 50}
                y1={node.y + 25}
                x2={nextNode.x}
                y2={nextNode.y + 25}
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-24 h-12 border-2 ${getNodeStyle(node.type)} ${getNodeShape(node.type)} cursor-pointer transition-all duration-300 ${
              selectedNode === node.id ? 'ring-2 ring-purple-500' : ''
            }`}
            style={{ left: node.x, top: node.y }}
            onClick={() => setSelectedNode(node.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            drag
            dragMomentum={false}
            onDragEnd={(event, info) => {
              setNodes(nodes.map(n => 
                n.id === node.id 
                  ? { ...n, x: node.x + info.offset.x, y: node.y + info.offset.y }
                  : n
              ));
            }}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-xs font-medium text-center px-2">{node.title}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Node Properties */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-slate-700/30 rounded-lg"
        >
          <h4 className="font-semibold text-white mb-2">Node Properties</h4>
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-400">Title</label>
              <input
                type="text"
                className="w-full p-2 bg-slate-600/50 border border-slate-600 rounded text-white text-sm"
                defaultValue={nodes.find(n => n.id === selectedNode)?.title}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                className="w-full p-2 bg-slate-600/50 border border-slate-600 rounded text-white text-sm"
                rows={2}
                defaultValue={nodes.find(n => n.id === selectedNode)?.description}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WorkflowCanvas;

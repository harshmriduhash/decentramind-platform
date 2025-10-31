'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  title: string;
  description: string;
  icon: string;
  x: number;
  y: number;
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
}

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'trigger',
      title: 'Wallet Connected',
      description: 'Trigger when wallet connects',
      icon: '🔗',
      x: 100,
      y: 100
    },
    {
      id: '2',
      type: 'action',
      title: 'Check Agent Status',
      description: 'Verify agent is minted',
      icon: '🤖',
      x: 300,
      y: 100
    },
    {
      id: '3',
      type: 'condition',
      title: 'Agent Active?',
      description: 'Check if agent is active',
      icon: '❓',
      x: 500,
      y: 100
    },
    {
      id: '4',
      type: 'output',
      title: 'Execute Task',
      description: 'Run agent task',
      icon: '⚡',
      x: 700,
      y: 100
    }
  ]);

  const [connections, setConnections] = useState<WorkflowConnection[]>([
    { id: 'c1', from: '1', to: '2' },
    { id: 'c2', from: '2', to: '3' },
    { id: 'c3', from: '3', to: '4' }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodeTypes = [
    { type: 'trigger', title: 'Trigger', icon: '🔗', color: 'emerald' },
    { type: 'action', title: 'Action', icon: '⚡', color: 'blue' },
    { type: 'condition', title: 'Condition', icon: '❓', color: 'yellow' },
    { type: 'output', title: 'Output', icon: '📤', color: 'purple' }
  ];

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: type as any,
      title: `New ${type}`,
      description: `Add description for ${type}`,
      icon: nodeTypes.find(n => n.type === type)?.icon || '📦',
      x: Math.random() * 400 + 100,
      y: Math.random() * 200 + 100
    };
    setNodes([...nodes, newNode]);
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(n => n.type === type);
    return nodeType?.color || 'gray';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow Builder</h3>
        <div className="flex space-x-2">
          {nodeTypes.map((nodeType) => (
            <motion.button
              key={nodeType.type}
              onClick={() => addNode(nodeType.type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-${nodeType.color}-500/20 text-${nodeType.color}-400 hover:bg-${nodeType.color}-500/30`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{nodeType.icon}</span>
              Add {nodeType.title}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="relative bg-slate-900/50 rounded-lg border border-slate-700/30 h-96 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-600"/>
          </svg>
        </div>

        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map((connection) => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            if (!fromNode || !toNode) return null;

            return (
              <motion.line
                key={connection.id}
                x1={fromNode.x + 50}
                y1={fromNode.y + 25}
                x2={toNode.x}
                y2={toNode.y + 25}
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-400"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className={`absolute w-48 p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
              selectedNode === node.id
                ? 'border-purple-500 bg-purple-500/10'
                : `border-${getNodeColor(node.type)}-500/50 bg-${getNodeColor(node.type)}-500/10 hover:border-${getNodeColor(node.type)}-500`
            }`}
            style={{ left: node.x, top: node.y }}
            onClick={() => setSelectedNode(node.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xl">{node.icon}</span>
              <h4 className="font-semibold text-white">{node.title}</h4>
            </div>
            <p className="text-sm text-gray-400">{node.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Node Details */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-slate-700/30 rounded-lg"
          >
            <h4 className="font-semibold text-white mb-2">Node Configuration</h4>
            <p className="text-sm text-gray-400">
              Configure the selected node properties and behavior.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowBuilder;

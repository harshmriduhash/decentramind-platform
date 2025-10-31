"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface LaunchpadProposal {
  title: string;
  description: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  initialPrice: string;
  fundingGoal: string;
  projectWebsite: string;
  whitepaper: string;
  teamMembers: string;
  roadmap: string;
}

interface LaunchpadProposalFormProps {
  onSubmit: (proposal: LaunchpadProposal) => void;
  onPreview: (proposal: LaunchpadProposal) => void;
}

export default function LaunchpadProposalForm({ onSubmit, onPreview }: LaunchpadProposalFormProps) {
  const [formData, setFormData] = useState<LaunchpadProposal>({
    title: '',
    description: '',
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    initialPrice: '',
    fundingGoal: '',
    projectWebsite: '',
    whitepaper: '',
    teamMembers: '',
    roadmap: ''
  });

  const handleInputChange = (field: keyof LaunchpadProposal, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePreview = () => {
    onPreview(formData);
  };

  return (
    <Card className="bg-zinc-900/50 border border-cyan-400/20">
      <CardHeader>
        <CardTitle className="text-cyan-300">Launchpad Proposal Form</CardTitle>
        <CardDescription className="text-gray-400">
          Fill out the form below to submit your token project proposal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Project Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-zinc-800 border-gray-600 text-white"
                placeholder="Enter project title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tokenName" className="text-white">Token Name</Label>
              <Input
                id="tokenName"
                value={formData.tokenName}
                onChange={(e) => handleInputChange('tokenName', e.target.value)}
                className="bg-zinc-800 border-gray-600 text-white"
                placeholder="Enter token name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-zinc-800 border-gray-600 text-white"
              placeholder="Describe your project in detail"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tokenSymbol" className="text-white">Token Symbol</Label>
              <Input
                id="tokenSymbol"
                value={formData.tokenSymbol}
                onChange={(e) => handleInputChange('tokenSymbol', e.target.value)}
                className="bg-zinc-800 border-gray-600 text-white"
                placeholder="e.g., DMT"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalSupply" className="text-white">Total Supply</Label>
              <Input
                id="totalSupply"
                value={formData.totalSupply}
                onChange={(e) => handleInputChange('totalSupply', e.target.value)}
                className="bg-zinc-800 border-gray-600 text-white"
                placeholder="1000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialPrice" className="text-white">Initial Price (SOL)</Label>
              <Input
                id="initialPrice"
                value={formData.initialPrice}
                onChange={(e) => handleInputChange('initialPrice', e.target.value)}
                className="bg-zinc-800 border-gray-600 text-white"
                placeholder="0.01"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
            >
              Preview
            </Button>
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Submit Proposal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
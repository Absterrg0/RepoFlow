'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  language: string
}

interface GitHubRepoSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  githubRepos: GitHubRepo[]
  selectedRepos: GitHubRepo[]
  setSelectedRepos: (repos: GitHubRepo[]) => void
  onAddSelectedRepos: () => void
}

export default function GitHubRepoSelectionModal({
  isOpen,
  onClose,
  githubRepos,
  selectedRepos,
  setSelectedRepos,
  onAddSelectedRepos,
}: GitHubRepoSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const toggleRepoSelection = (repo: GitHubRepo) => {
    if (selectedRepos.some(r => r.id === repo.id)) {
      setSelectedRepos(selectedRepos.filter(r => r.id !== repo.id))
    } else {
      setSelectedRepos([...selectedRepos, repo])
    }
  }

  const filteredRepos = githubRepos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-zinc-900 text-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Select GitHub Repositories</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <ScrollArea className="h-[400px] rounded-md border border-gray-700 bg-gray-850 p-4 overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="flex items-start space-x-3 rounded-lg border border-zinc-700 p-3 transition-colors hover:bg-gray-600 bg-zinc-700"
                >
                  <Checkbox
                    id={`repo-${repo.id}`}
                    checked={selectedRepos.some(r => r.id === repo.id)}
                    onCheckedChange={() => toggleRepoSelection(repo)}
                    className="mt-1 accent-white" // Change checkbox color
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={`repo-${repo.id}`}
                      className="text-sm font-medium leading-none text-white"
                    >
                      {repo.name}
                    </label>
                    <p className="text-xs text-gray-400">{repo.description}</p>
                    {repo.language && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {selectedRepos.length} repositories selected
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} className="text-white border-white hover:bg-white hover:text-black">
              Cancel
            </Button>
            <Button onClick={onAddSelectedRepos} disabled={selectedRepos.length === 0} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
              Add {selectedRepos.length} {selectedRepos.length === 1 ? 'Repository' : 'Repositories'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

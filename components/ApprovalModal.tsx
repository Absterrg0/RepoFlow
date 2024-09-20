'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

// types.ts
export interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  techStack: string[];
  isApproved: boolean;
}

interface ApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  awaitingApprovalRepos: Repository[]
}

export default function ApprovalModal({ isOpen, onClose, awaitingApprovalRepos }: ApprovalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Repository Approval Status</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          {awaitingApprovalRepos.length === 0 ? (
            <p className="text-center text-gray-400">No repositories to display.</p>
          ) : (
            <ul className="space-y-4">
              {awaitingApprovalRepos.map((repo) => (
                <li key={repo.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{repo.name}</h3>
                    <Badge 
                      variant={repo.isApproved ? 'default' : 'secondary'}
                      className={repo.isApproved ? 'bg-green-600' : 'bg-yellow-600'}
                    >
                      {repo.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
                  <div className="flex flex-wrap space-x-2">
                    {repo.techStack.map((stack) => (
                      <Badge key={stack} className="bg-blue-600">
                        {stack}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} className="w-full mt-4">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

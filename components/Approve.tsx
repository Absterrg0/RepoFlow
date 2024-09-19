'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'
import { Repository } from '@/validate/types'

export default function Approval() {
  const { data: session, status } = useSession()
  const [awaitingApprovalRepos, setAwaitingApprovalRepos] = useState<Repository[]>([])
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAwaitingApprovalRepos = async () => {
    try {
      const response = await axios.get<Repository[]>('/api/admin')
      setAwaitingApprovalRepos(response.data)
    } catch (error) {
      console.error('Error fetching awaiting approval repositories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (repoId: number) => {
    try {
      await axios.post('/api/admin', { repoId })
      setIsApprovalModalOpen(false)
      await fetchAwaitingApprovalRepos()
    } catch (error) {
      console.error('Error approving repository:', error)
    }
  }

  const handleReject = async (repoId: number) => {
    try {
      await axios.delete(`/api/admin/repositories?repoId=${repoId}`)
      setIsRejectionModalOpen(false)
      await fetchAwaitingApprovalRepos()
    } catch (error) {
      console.error('Error rejecting repository:', error)
    }
  }

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetchAwaitingApprovalRepos()
    } else if (status !== 'loading') {
      setIsLoading(false)
    }
  }, [session, status])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-xl text-gray-400">You are not authorized to access this page.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Awaiting Approval</h1>
      {awaitingApprovalRepos.length === 0 ? (
        <div className="text-center text-2xl text-gray-400">No repositories awaiting approval.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awaitingApprovalRepos.map((repo) => (
            <Card key={repo.id} className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-200 mb-2">{repo.name}</CardTitle>
                <CardDescription className="text-base text-gray-400 mb-4">{repo.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {repo.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-500 text-white">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    View Repository
                  </a>
                  <div className="space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedRepoId(repo.id)
                        setIsApprovalModalOpen(true)
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedRepoId(repo.id)
                        setIsRejectionModalOpen(true)
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Approve Repository</DialogTitle>
            <DialogDescription>Are you sure you want to approve this repository?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => handleApprove(selectedRepoId!)} className="bg-green-500 hover:bg-green-600">
              Confirm
            </Button>
            <Button onClick={() => setIsApprovalModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectionModalOpen} onOpenChange={setIsRejectionModalOpen}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Reject Repository</DialogTitle>
            <DialogDescription>Are you sure you want to reject this repository? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => handleReject(selectedRepoId!)} className="bg-red-500 hover:bg-red-600">
              Confirm
            </Button>
            <Button onClick={() => setIsRejectionModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
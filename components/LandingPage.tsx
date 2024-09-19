'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Search, Plus, LogOut, Github, Trash2, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Repository } from '@/validate/types';
import { toast, Toaster } from 'react-hot-toast';

const techStackOptions: string[] = ["React", "Node.js", "Express", "TypeScript", "MongoDB", "Docker", "GoLang", "Rust", "NextJs", "Backend", "Frontend","New","Intermediate","Experienced","Postgres","Web3","Python","AI"];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const cardVariants = {
  initial: { scale: 0.96, y: 30, opacity: 0 },
  enter: { scale: 1, y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.48, 0.15, 0.25, 0.96] } },
  exit: { scale: 0.6, y: 100, opacity: 0, transition: { duration: 0.2, ease: [0.48, 0.15, 0.25, 0.96] } }
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    url: '',
    techStack: [] as string[]
  });
  const [awaitingApprovalRepos, setAwaitingApprovalRepos] = useState<Repository[]>([]);
  const [filterType, setFilterType] = useState('All');

  const fetchRepositories = async () => {
    try {
      const response = await axios.get<Repository[]>('/api/repos');
      setRepositories(response.data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories. Please try again.');
    }
  };

  const fetchAwaitingApprovalRepos = async () => {
    if (session) {
      try {
        const response = await axios.get<Repository[]>('/api/repos/awaiting-approval');
        setAwaitingApprovalRepos(response.data);
      } catch (error) {
        console.error('Error fetching awaiting approval repositories:', error);
        toast.error('Failed to fetch awaiting approval repositories. Please try again.');
      }
    }
  };

  const handleAddRepo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/repos', newRepo);
      setNewRepo({ name: '', description: '', url: '', techStack: [] });
      setIsAddRepoModalOpen(false);
      await fetchRepositories();
      toast.success('Repository added successfully!');
    } catch (error) {
      console.error('Error adding repository:', error);
      toast.error('Repository already exists');
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filterRepos = () => {
        let filtered = repositories;
        
        if (searchTerm) {
          filtered = filtered.filter(repo =>
            repo.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (filterType !== 'All') {
          filtered = filtered.filter(repo => repo.techStack.includes(filterType));
        }
        setFilteredRepos(filtered);
      };
  
      filterRepos();
    }, 300);
  
    // Clean up the timeout if searchTerm changes before the delay completes
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, repositories, filterType]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    fetchAwaitingApprovalRepos();
  }, [session]);

  const toggleTechStack = (tech: string) => {
    setNewRepo(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(item => item !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleDeletion = async (repoId: number) => {
    try {
      await axios.delete(`/api/admin/repositories?repoId=${repoId}`);
      await fetchRepositories();
      await fetchAwaitingApprovalRepos();
      toast.success('Repository deleted successfully!');
    } catch (error) {
      console.error('Error deleting repository:', error);
      toast.error('Failed to delete repository. Please try again.');
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <Toaster position="bottom-right" />
      <header className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg py-6 sticky top-0 z-10">
  <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
    <motion.h1
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold text-white"
    >
      RepoFlow
    </motion.h1>
    <div className="flex items-center space-x-4 mt-4 sm:mt-0 flex-wrap justify-center">
      {status === 'authenticated' ? (
        <>
          <Button
            onClick={() => setIsApprovalModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
          >
            <Plus className="mr-2" size={18} />
            Awaiting Approval
          </Button>
          <Button
            onClick={() => signOut()}
            variant="destructive"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors duration-300"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </>
      ) : (
        <Button
          onClick={() => signIn('github')}
          variant="outline"
          className="flex items-center gap-2 text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
        >
          <Github size={16} />
          Login with GitHub
        </Button>
      )}
      <a
        href="https://github.com/Absterrg0"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors duration-300"
      >
        <Github size={20} />
        Contribute
      </a>
    </div>
  </div>
</header>


      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-bold text-white mb-8 text-center"
          >
            Repository Dashboard
          </motion.h1>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
          >
            <div className="relative w-full md:w-2/3">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-800  border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>

            {status === 'authenticated' && (
              <Button
                onClick={() => setIsAddRepoModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                <Plus size={16} />
                Add Repository
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {['All', ...techStackOptions].map((tech) => (
              <Button
                key={tech}
                onClick={() => setFilterType(tech)}
                variant={filterType === tech ? 'default' : 'outline'}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  filterType === tech
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {tech}
              </Button>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            <AnimatePresence>
              {filteredRepos.map((repo) => (
                <motion.div
                  key={repo.id}
                  variants={cardVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  layout
                >
                  <Card className="bg-gray-800 border-gray-700 rounded-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500 flex flex-col h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-white truncate max-w-[200px]">
                          {repo.name.length > 15 ? `${repo.name.substring(0, 15)}...` : repo.name}
                        </CardTitle>
                        <Github size={24} className="text-gray-400" />
                      </div>
                      <CardDescription className="text-gray-400 mt-2 line-clamp-2 h-12 overflow-hidden">
                        {repo.description.length > 40 ? `${repo.description.substring(0, 40)}...` : repo.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        View Repository
                        <ExternalLink size={16} className="ml-1" />
                      </a>
                      {session?.user.isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletion(repo.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors duration-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Dialog open={isAddRepoModalOpen} onOpenChange={() => setIsAddRepoModalOpen(false)}>
        <DialogContent className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Add Repository</DialogTitle>
            <DialogDescription className="text-gray-400">Fill in the repository details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRepo} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="repoName" className="block text-sm font-medium text-gray-200">Repository Name</Label>
                <Input
                  id="repoName"
                  value={newRepo.name}
                  onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                  required
                  maxLength={20}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <Label htmlFor="repoDescription" className="block text-sm font-medium text-gray-200">Description</Label>
                <textarea
                  id="repoDescription"
                  value={newRepo.description}
                  onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                  required
                  maxLength={100}
                  rows={3}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <Label htmlFor="repoUrl" className="block text-sm font-medium text-gray-200">Repository URL</Label>
                <Input
                  id="repoUrl"
                  type="url"
                  value={newRepo.url}
                  onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                  required
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-md px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>
              <div>
                <Label htmlFor="techStack" className="block text-sm font-medium text-gray-200">Tech Stack</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {techStackOptions.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTechStack(tech)}
                      className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                        newRepo.techStack.includes(tech)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-500 transition-colors duration-300">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isApprovalModalOpen} onOpenChange={() => setIsApprovalModalOpen(false)}>
        <DialogContent className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">Repositories Awaiting Approval</DialogTitle>
            <DialogDescription className="text-gray-400">Below are the repositories that need approval.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {awaitingApprovalRepos.length === 0 ? (
              <p className="text-gray-400">No repositories are currently awaiting approval.</p>
            ) : (
              awaitingApprovalRepos.map((repo) => (
                <Card
                  key={repo.id}
                  className="bg-gray-800 border-gray-700 rounded-lg transition-all duration-300 hover:shadow-xl hover:border-blue-500"
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white mb-2 truncate">
                      {repo.name.length > 15 ? `${repo.name.substring(0, 15)}...` : repo.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-2 h-12 overflow-hidden">
                      {repo.description.length > 40 ? `${repo.description.substring(0, 40)}...` : repo.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {repo.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
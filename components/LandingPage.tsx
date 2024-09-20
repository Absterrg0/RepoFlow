'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Github, Trash2, ExternalLink, Code2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast, Toaster } from 'react-hot-toast';
import ApprovalModal from './ApprovalModal';
import GitHubRepoSelectionModal from './GitHubRepoModal';
import AddRepoModal from './AddRepoModal';

interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  techStack: string[];
  language?: string;
  isApproved: boolean;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
}

const techStackOptions: string[] = ["React", "Node.js", "Express", "TypeScript", "MongoDB", "Docker", "GoLang", "Rust", "NextJs", "Backend", "Frontend", "New", "Intermediate", "Experienced", "Postgres", "Web3", "Python", "AI"];

const pageVariants = {
  initial: { opacity: 0, y: -20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
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
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [awaitingApprovalRepos, setAwaitingApprovalRepos] = useState<Repository[]>([]);
  const [isGitHubRepoModalOpen, setIsGitHubRepoModalOpen] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [selectedGithubRepos, setSelectedGithubRepos] = useState<GitHubRepo[]>([]);
  const [isAddRepoModalOpen, setIsAddRepoModalOpen] = useState(false);

  // Fetch all repositories
  const fetchRepositories = async () => {
    try {
      const response = await axios.get<Repository[]>('/api/repos');
      setRepositories(response.data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast.error('Failed to fetch repositories. Please try again.');
    }
  };

  // Fetch repositories awaiting approval
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

  // Fetch user's GitHub repositories
  const fetchGithubRepos = async () => {
    if (session?.accessToken) {
      try {
        const response = await axios.get<GitHubRepo[]>('https://api.github.com/user/repos', {
          headers: {
            Authorization: `token ${session.accessToken}`,
          },
          params: {
            visibility: 'public',
            sort: 'updated',
            per_page: 100,
          },
        });
        setGithubRepos(response.data);
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        toast.error('Failed to fetch GitHub repositories. Please try again.');
      }
    }
  };

  // Handle adding selected GitHub repositories
  const handleAddSelectedRepos = async () => {
    try {
      const reposToAdd = selectedGithubRepos.map(repo => ({
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        techStack: [repo.language].filter(Boolean),
        language: repo.language,
      }));

      await Promise.all(reposToAdd.map(repo => axios.post('/api/repos', repo)));

      setIsGitHubRepoModalOpen(false);
      setSelectedGithubRepos([]);
      await fetchRepositories();
      toast.success('Selected repositories added successfully!');
    } catch (error) {
      console.error('Error adding selected repositories:', error);
      toast.error('Failed to add selected repositories. Please try again.');
    }
  };

  // Handle adding a new repository
  const handleAddRepo = async (repoData: { name: string; description: string; url: string; techStack: string[] }) => {
    try {
      await axios.post('/api/repos', repoData);
      await fetchRepositories();
      toast.success('Repository added successfully!');
      setIsAddRepoModalOpen(false);
    } catch (error) {
      console.error('Error adding repository:', error);
      toast.error('Failed to add repository. Please try again.');
    }
  };

  // Fetch data on component mount and session change
  useEffect(() => {
    fetchRepositories();
    fetchAwaitingApprovalRepos();
    if (session) fetchGithubRepos();
  }, [session]);

  // Handle filtering of repositories based on search term
// Handle filtering of repositories based on search term
useEffect(() => {
  const debounceTimer = setTimeout(() => {
    const filterRepos = () => {
      let filtered = repositories;
      if (searchTerm) {
        filtered = filtered.filter(repo => 
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      setFilteredRepos(filtered);
    };
    filterRepos();
  }, 300);

  return () => clearTimeout(debounceTimer);
}, [searchTerm, repositories]);


  // Handle deletion of a repository
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
      <Toaster position="top-right" />
      <header className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg py-6 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <Code2 size={32} className="text-blue-500" />
            <h1 className="text-4xl font-bold text-white">RepoFlow</h1>
          </motion.div>
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
            {status === 'authenticated' && (
              <Button
                onClick={() => setIsAddRepoModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                <Plus size={16} />
                Add Repository
              </Button>
            )}
            
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
  <div className="flex items-center mb-6">
    <Input
      placeholder="Search repositories..."
      className="flex-grow"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <Button
      onClick={() => setIsGitHubRepoModalOpen(true)}
      className="ml-4 bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
    >
      Import from GitHub
    </Button>
  </div>

  {/* Add the login prompt message here */}
          {status === 'unauthenticated' && (
              <p className="text-center text-lg text-gray-300 mb-4">
              You must log in to add repositories.
            </p>
          )}

  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.8 }}
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
              {repo.language && (
                <span className="text-sm text-gray-400 mt-2">
                  Language: {repo.language}
                </span>
              )}
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
</main>


      {/* Modals */}
      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        awaitingApprovalRepos={awaitingApprovalRepos}
      />

      <GitHubRepoSelectionModal
        isOpen={isGitHubRepoModalOpen}
        onClose={() => setIsGitHubRepoModalOpen(false)}
        githubRepos={githubRepos}
        selectedRepos={selectedGithubRepos}
        setSelectedRepos={setSelectedGithubRepos}
        onAddSelectedRepos={handleAddSelectedRepos}
      />

      <AddRepoModal
        isOpen={isAddRepoModalOpen}
        onClose={() => setIsAddRepoModalOpen(false)}
        onAddRepo={handleAddRepo}
        techStackOptions={techStackOptions}
      />
    </motion.div>
  );
}

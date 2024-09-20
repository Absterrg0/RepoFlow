import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRepo: (repoData: { name: string; description: string; url: string; techStack: string[] }) => Promise<void>;
  techStackOptions: string[];
}

const AddRepoModal: React.FC<AddRepoModalProps> = ({ isOpen, onClose, onAddRepo, techStackOptions }) => {
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    url: '',
    techStack: [] as string[],
  });

  const toggleTechStack = (tech: string) => {
    setNewRepo(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(item => item !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onAddRepo(newRepo);
    setNewRepo({ name: '', description: '', url: '', techStack: [] });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Add Repository</DialogTitle>
          <DialogDescription className="text-gray-400">Fill in the repository details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label className="block text-sm font-medium text-gray-200">Tech Stack</Label>
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
  );
};

export default AddRepoModal;

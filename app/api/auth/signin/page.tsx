'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Github, Code, Star, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignIn() {
  const handleSignIn = async () => {
    const result = await signIn('github', { callbackUrl: '/' });
    if (result?.error) {
      console.error('Sign in error:', result.error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="bg-gray-800 p-8 sm:p-12 rounded-2xl shadow-2xl text-center max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants} className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to RepoFlow
          </h1>
        </motion.div>
        
        <motion.p variants={childVariants} className="text-gray-300 mb-8 text-lg">
          Sign in to start exploring and contributing to repositories.
        </motion.p>
        
        <motion.div variants={childVariants} className="flex justify-center space-x-4 mb-8">
          <div className="flex flex-col items-center">
            <Code className="h-8 w-8 text-purple-400 mb-2" />
            <span className="text-sm text-gray-400">Collaborate</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="h-8 w-8 text-yellow-400 mb-2" />
            <span className="text-sm text-gray-400">Contribute</span>
          </div>
          <div className="flex flex-col items-center">
            <GitBranch className="h-8 w-8 text-green-400 mb-2" />
            <span className="text-sm text-gray-400">Innovate</span>
          </div>
        </motion.div>
        
        <motion.div variants={childVariants}>
          <Button
            onClick={handleSignIn}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Github className="mr-3 h-6 w-6" />
            Sign in with GitHub
          </Button>
        </motion.div>
        
        <motion.p variants={childVariants} className="mt-6 text-sm text-gray-400">
          By signing in, you agree to our <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
        </motion.p>
      </motion.div>
    </div>
  );
}
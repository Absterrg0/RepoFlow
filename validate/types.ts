

export interface AddRepoModalProps {
    isOpen: boolean
    onClose: () => void
    newRepo: {
      name: string
      description: string
      url: string
      techStack: string
    }
    setNewRepo: (repo: any) => void
    handleAddRepo: (e: React.FormEvent) => void
  }


  export interface UserDetails{
    name:string,
    isAdmin:boolean
  }


  export interface RepoType {
    id: number;
    name: string;
    description?: string; // Optional
    url: string;
    isApproved: boolean;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    techStack: string[];
    stars?: number | null; // Optional
    forks?: number | null; // Optional
    language?: string | null; // Optional
  }
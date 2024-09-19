export interface Repository {
    id: number;
    name: string;
    description: string;
    url: string;
    isApproved: boolean;
    techStack: string[];
  }
  


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
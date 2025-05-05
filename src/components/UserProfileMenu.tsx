import { useState } from "react";
import { 
  UserRound, 
  Settings, 
  LogOut, 
  CreditCard, 
  HelpCircle,
  ChevronDown,
  Users
} from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock de dados dos usuários para demonstração
const mockUsers = [
  {
    id: "1",
    name: "João da Silva",
    email: "joao.silva@exemplo.com",
    role: "Médico",
    avatarUrl: ""
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@exemplo.com",
    role: "Enfermeira",
    avatarUrl: ""
  },
  {
    id: "3",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@exemplo.com",
    role: "Administrador",
    avatarUrl: ""
  }
];

export function UserProfileMenu() {
  const { currentPlan } = usePremium();
  const [isOpen, setIsOpen] = useState(false);
  const [userSwitchOpen, setUserSwitchOpen] = useState(false);
  const { toast } = useToast();
  
  // Estado para controlar o usuário atual
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  
  const planName = currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
    // Em uma aplicação real, aqui teria o código para limpar os dados da sessão
  };

  const switchUser = (user) => {
    setCurrentUser(user);
    setUserSwitchOpen(false);
    toast({
      title: "Usuário alterado",
      description: `Agora você está logado como ${user.name}.`
    });
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-md hover:bg-safecare-50 w-full text-left">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback className="bg-safecare-100 text-safecare-700">
                {currentUser.name.split(" ").map(name => name[0]).join("").toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs bg-safecare-100 text-safecare-700 px-2 py-0.5 rounded-full">
                  Plano {planName}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <UserRound className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Gerenciar Plano</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => {
              setIsOpen(false);
              setUserSwitchOpen(true);
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Trocar Usuário</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda & Suporte</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="cursor-pointer text-red-500 focus:text-red-500" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo para troca de usuário */}
      <Dialog open={userSwitchOpen} onOpenChange={setUserSwitchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trocar usuário</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {mockUsers.map(user => (
              <div 
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                  currentUser.id === user.id 
                    ? 'bg-safecare-50 border border-safecare-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => switchUser(user)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-safecare-100 text-safecare-700">
                    {user.name.split(" ").map(name => name[0]).join("").toUpperCase().slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
                {currentUser.id === user.id && (
                  <Badge className="bg-safecare-500 text-xs">Ativo</Badge>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setUserSwitchOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

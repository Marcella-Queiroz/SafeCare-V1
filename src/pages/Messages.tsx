
import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import PremiumFeatureBlock from "@/components/PremiumFeatureBlock";
import { usePremium } from "@/contexts/PremiumContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, Plus, Search, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Dados de exemplo para mensagens
const mockContacts = [
  { id: "1", name: "Dra. Fernanda Alves", lastMessage: "Vamos discutir o caso do paciente João", time: "10:30", unread: 2 },
  { id: "2", name: "Enfermeira Márcia", lastMessage: "Os resultados chegaram", time: "09:15", unread: 0 },
  { id: "3", name: "Dr. Ricardo Santos", lastMessage: "Preciso de sua opinião", time: "Ontem", unread: 1 },
  { id: "4", name: "Recepção", lastMessage: "Paciente confirmado para amanhã", time: "Ontem", unread: 0 },
];

interface Message {
  id: string;
  content: string;
  sender: "user" | "contact";
  timestamp: Date;
}

// Dados de exemplo para conversas de chat
const mockChats: Record<string, Message[]> = {
  "1": [
    { id: "1", content: "Olá, tudo bem?", sender: "contact", timestamp: new Date(Date.now() - 1000000) },
    { id: "2", content: "Sim, e você?", sender: "user", timestamp: new Date(Date.now() - 900000) },
    { id: "3", content: "Vamos discutir o caso do paciente João", sender: "contact", timestamp: new Date(Date.now() - 800000) },
  ],
  "2": [
    { id: "1", content: "Os resultados dos exames chegaram", sender: "contact", timestamp: new Date(Date.now() - 500000) },
    { id: "2", content: "Excelente, vou analisar", sender: "user", timestamp: new Date(Date.now() - 400000) },
  ],
  "3": [
    { id: "1", content: "Preciso de sua opinião sobre um caso", sender: "contact", timestamp: new Date(Date.now() - 86400000) },
    { id: "2", content: "Claro, pode me enviar os detalhes", sender: "user", timestamp: new Date(Date.now() - 85400000) },
    { id: "3", content: "Preciso de sua opinião", sender: "contact", timestamp: new Date(Date.now() - 84400000) },
  ],
  "4": [
    { id: "1", content: "Paciente confirmado para amanhã às 10h", sender: "contact", timestamp: new Date(Date.now() - 172800000) },
    { id: "2", content: "Obrigado pela informação", sender: "user", timestamp: new Date(Date.now() - 171800000) },
    { id: "3", content: "Paciente confirmado para amanhã", sender: "contact", timestamp: new Date(Date.now() - 170800000) },
  ]
};

const MessagesPage = () => {
  const { isPremiumFeature } = usePremium();
  const { toast } = useToast();
  const isLocked = isPremiumFeature("messaging");
  
  const [contacts, setContacts] = useState(mockContacts);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockChats);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtrar contatos com base na pesquisa
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const activeContact = contacts.find(c => c.id === activeContactId);
  const activeChat = activeContactId ? messages[activeContactId] || [] : [];
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContactId) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    // Atualizar o chat
    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), message]
    }));
    
    // Atualizar a última mensagem no contato
    setContacts(contacts.map(contact => {
      if (contact.id === activeContactId) {
        return {
          ...contact,
          lastMessage: newMessage,
          time: "Agora"
        };
      }
      return contact;
    }));
    
    setNewMessage("");
  };
  
  const handleContactClick = (contactId: string) => {
    setActiveContactId(contactId);
    
    // Marcar mensagens como lidas
    setContacts(contacts.map(contact => {
      if (contact.id === contactId && contact.unread > 0) {
        return { ...contact, unread: 0 };
      }
      return contact;
    }));
  };

  return (
    <MainLayout title="Mensagens">
      {isLocked ? (
        <PremiumFeatureBlock 
          featureKey="messaging"
          featureName="Sistema de Mensagens"
          description="Comunique-se com sua equipe e pacientes em tempo real. Disponível nos planos Profissional e Empresarial."
        />
      ) : (
        <div className="h-[calc(100vh-180px)] flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="new">Nova Conversa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {/* Lista de contatos */}
                <Card className="hidden md:block">
                  <CardHeader className="p-4">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar conversas..." 
                        className="h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`flex items-center space-x-4 p-3 cursor-pointer hover:bg-accent ${
                            activeContactId === contact.id ? "bg-accent" : ""
                          }`}
                          onClick={() => handleContactClick(contact.id)}
                        >
                          <Avatar>
                            <AvatarFallback className="bg-safecare-100 text-safecare-700">
                              {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium truncate">{contact.name}</p>
                              <span className="text-xs text-muted-foreground">{contact.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {contact.lastMessage}
                            </p>
                          </div>
                          {contact.unread > 0 && (
                            <span className="h-5 w-5 bg-safecare-500 text-white text-xs flex items-center justify-center rounded-full">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Nenhum contato encontrado
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Área de chat */}
                <Card className={`md:col-span-2 flex flex-col ${!activeContactId ? "items-center justify-center" : ""}`}>
                  {activeContactId && activeContact ? (
                    <>
                      <CardHeader className="border-b p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-safecare-100 text-safecare-700">
                              {activeContact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{activeContact.name}</CardTitle>
                            <CardDescription>Online agora</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-420px)]">
                        {activeChat.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender === "user"
                                  ? "bg-safecare-100 text-safecare-700"
                                  : "bg-muted"
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className="text-xs text-muted-foreground text-right mt-1">
                                {format(message.timestamp, "HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <div className="p-4 border-t">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Digite sua mensagem..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1"
                          />
                          <Button onClick={handleSendMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                      <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Nenhuma conversa selecionada</h3>
                      <p className="text-muted-foreground">
                        Selecione uma conversa ou inicie uma nova
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="new">
              <Card>
                <CardHeader>
                  <CardTitle>Nova Conversa</CardTitle>
                  <CardDescription>Inicie uma nova conversa com um contato</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="contactSearch" className="text-sm font-medium">
                      Buscar contato
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactSearch"
                        placeholder="Digite o nome do contato..."
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "Esta funcionalidade será disponibilizada em breve."
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Nova Conversa
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </MainLayout>
  );
};

export default MessagesPage;


import { useState } from "react";
import { Home, Users, Calendar, MessageCircle, Pill, FileText, Menu, X, DollarSign } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { UserProfileMenu } from "./UserProfileMenu";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Pacientes", href: "/patients" },
    { icon: Pill, label: "Medicamentos", href: "/medications" },
    { icon: Calendar, label: "Agendamentos", href: "/appointments" },
    { icon: MessageCircle, label: "Mensagens", href: "/messages" },
    { icon: FileText, label: "Relatórios", href: "/reports" },
    { icon: DollarSign, label: "Planos", href: "/plans" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-border w-64 fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          <Logo className="mb-8 mt-4" />
          
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-safecare-50 hover:text-safecare-600",
                  location.pathname === item.href && "bg-safecare-50 text-safecare-600"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-border pt-4 mt-auto">
            <UserProfileMenu />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

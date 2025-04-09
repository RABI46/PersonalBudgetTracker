import React, { ReactNode, useState } from "react";
import { useLocation, Link } from "wouter";
import { 
  Home, 
  LayoutDashboard as Dashboard, 
  User, 
  BookOpen, 
  BarChart, 
  Menu, 
  X 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

function NavItem({ 
  icon: Icon, 
  text, 
  to, 
  active, 
  onClick 
}: { 
  icon: any, 
  text: string, 
  to: string, 
  active: boolean,
  onClick?: () => void 
}) {
  return (
    <Link href={to}>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center p-3 rounded-lg w-full",
          active 
            ? "bg-blue-100 text-blue-700" 
            : "hover:bg-gray-100 text-gray-700"
        )}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{text}</span>
      </a>
    </Link>
  );
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Home": return Home;
    case "LayoutDashboard": return Dashboard;
    case "User": return User;
    case "BookOpen": return BookOpen;
    case "BarChart": return BarChart;
    default: return Home;
  }
};

export default function Layout({ children, title, subtitle }: LayoutProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold text-blue-800">StopClope</h1>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed inset-0 z-50 bg-white md:hidden"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold text-blue-800">Menu</h2>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X />
              </button>
            </div>
            <nav className="p-4 flex-1">
              {NAV_ITEMS.map((item) => (
                <NavItem 
                  key={item.path}
                  icon={getIconComponent(item.icon)} 
                  text={item.label} 
                  to={item.path} 
                  active={location === item.path}
                  onClick={closeMenu}
                />
              ))}
            </nav>
            <div className="p-4 border-t text-center text-gray-500 text-sm">
              © 2024 StopClope
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r p-4 fixed h-full">
          <div className="mb-6 pb-6 border-b">
            <h1 className="text-2xl font-bold text-blue-800">StopClope</h1>
          </div>
          
          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavItem 
                key={item.path}
                icon={getIconComponent(item.icon)} 
                text={item.label} 
                to={item.path} 
                active={location === item.path} 
              />
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t text-sm text-gray-500">
            © 2024 StopClope
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          {/* Page Content */}
          <div className="p-4 md:p-6">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
            
            {/* Content */}
            {children}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around p-3 z-10">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} href={item.path}>
              <a className={cn(
                "flex flex-col items-center", 
                location === item.path ? "text-blue-600" : "text-gray-500"
              )}>
                {React.createElement(getIconComponent(item.icon), { className: "h-6 w-6" })}
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  FlaskConical,
  TestTubes,
  ShieldCheck,
  Boxes,
  Calculator,
  Wrench,
  BookOpen,
  Settings,
  Sparkles,
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Cpu,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Sun,
  Moon,
  Laptop,
  Wifi,
  WifiOff,
  ArrowLeft,
  ArrowRight,
  Zap,
  Activity,
  FolderGit2,
  LucideProps
} from 'lucide-react';

interface IconHelperProps extends LucideProps {
  name: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, ...props }) => {
  switch (name) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'MessageSquare':
      return <MessageSquare {...props} />;
    case 'FlaskConical':
      return <FlaskConical {...props} />;
    case 'TestTubes':
      return <TestTubes {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Boxes':
      return <Boxes {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Menu':
      return <Menu {...props} />;
    case 'X':
      return <X {...props} />;
    case 'Search':
      return <Search {...props} />;
    case 'ChevronLeft':
      return <ChevronLeft {...props} />;
    case 'ChevronRight':
      return <ChevronRight {...props} />;
    case 'Database':
      return <Database {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Cpu':
      return <Cpu {...props} />;
    case 'CheckCircle2':
      return <CheckCircle2 {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'ExternalLink':
      return <ExternalLink {...props} />;
    case 'Sun':
      return <Sun {...props} />;
    case 'Moon':
      return <Moon {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Wifi':
      return <Wifi {...props} />;
    case 'WifiOff':
      return <WifiOff {...props} />;
    case 'ArrowLeft':
      return <ArrowLeft {...props} />;
    case 'ArrowRight':
      return <ArrowRight {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Activity':
      return <Activity {...props} />;
    case 'FolderGit2':
      return <FolderGit2 {...props} />;
    case 'Info':
    default:
      return <Info {...props} />;
  }
};

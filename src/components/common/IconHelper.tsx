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
  Beaker,
  Pipette,
  FlaskRound,
  FileSpreadsheet,
  AlertTriangle,
  Printer,
  QrCode,
  Tag,
  Flame,
  Skull,
  ShieldAlert,
  Microscope,
  Bug,
  Dna,
  Binary,
  CircleDot,
  Gauge,
  Thermometer,
  Atom,
  LucideProps
} from 'lucide-react';

interface IconHelperProps extends LucideProps {
  name: string;
}

export const IconHelper: React.FC<IconHelperProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Microscope':
      return <Microscope {...props} />;
    case 'Bug':
      return <Bug {...props} />;
    case 'Dna':
      return <Dna {...props} />;
    case 'Binary':
      return <Binary {...props} />;
    case 'CircleDot':
      return <CircleDot {...props} />;
    case 'Gauge':
      return <Gauge {...props} />;
    case 'Thermometer':
      return <Thermometer {...props} />;
    case 'Atom':
      return <Atom {...props} />;
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
    case 'Beaker':
      return <Beaker {...props} />;
    case 'Pipette':
      return <Pipette {...props} />;
    case 'FlaskRound':
      return <FlaskRound {...props} />;
    case 'FileSpreadsheet':
      return <FileSpreadsheet {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'Printer':
      return <Printer {...props} />;
    case 'QrCode':
      return <QrCode {...props} />;
    case 'Tag':
      return <Tag {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Skull':
      return <Skull {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
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

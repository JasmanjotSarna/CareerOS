import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Target,
  GitPullRequest,
  Map,
  FileCheck,
  Code2,
  Users2,
  Mic,
  Brain,
  TrendingUp,
  Bot,
  Briefcase,
  Columns3,
  Contact,
  FolderKanban,
  ListChecks,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const STUDENT_NAV_SECTIONS: NavSection[] = [  {
    title: 'Career workspace',
    items: [
      { label: 'Command center', href: '/app', icon: LayoutDashboard, group: 'Career workspace' },
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, group: 'Career workspace' },
      { label: 'Job search', href: '/jobs', icon: Briefcase, group: 'Career workspace' },
      { label: 'Applications', href: '/app/tracker', icon: Columns3, group: 'Career workspace' },
      { label: 'Goals & tasks', href: '/tasks', icon: ListChecks, group: 'Career workspace' },
      { label: 'Networking', href: '/networking', icon: Contact, group: 'Career workspace' },
      { label: 'Portfolio', href: '/portfolio', icon: FolderKanban, group: 'Career workspace' },
    ],
  },
  {
    title: 'Career clarity',
    items: [
      { label: 'Role suitability', href: '/suitability', icon: Target, group: 'Career clarity' },
      { label: 'Skill gaps', href: '/skills', icon: GitPullRequest, group: 'Career clarity' },
      { label: 'Learning roadmap', href: '/roadmap', icon: Map, group: 'Career clarity' },
      { label: 'Career analytics', href: '/analytics', icon: BarChart3, group: 'Career clarity' },
    ],
  },
  {
    title: 'Documents & practice',
    items: [
      { label: 'Resume studio', href: '/resume', icon: FileCheck, group: 'Documents & practice' },
      { label: 'Technical studio', href: '/interviews/technical', icon: Code2, group: 'Documents & practice' },
      { label: 'Behavioral studio', href: '/interviews/hr', icon: Users2, group: 'Documents & practice' },
      { label: 'Aptitude arena', href: '/aptitude', icon: Brain, group: 'Documents & practice' },
      { label: 'Communication lab', href: '/communication', icon: Mic, group: 'Documents & practice' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { label: 'AI career coach', href: '/coach', icon: Bot, group: 'Intelligence' },
      { label: 'Readiness progress', href: '/progress', icon: TrendingUp, group: 'Intelligence' },
      { label: 'Notifications', href: '/notifications', icon: Bell, group: 'Intelligence' },
      { label: 'Settings', href: '/settings', icon: Settings, group: 'Intelligence' },
    ],
  },
];

export const FACULTY_NAV_SECTIONS: NavSection[] = [
  {
    title: 'Faculty management',
    items: [
      { label: 'Cohort Overview', href: '/faculty/dashboard', icon: LayoutDashboard, group: 'Faculty management' },
      { label: 'Student Directory', href: '/faculty/students', icon: Users2, group: 'Faculty management' },
    ],
  },
];

export const ALL_STUDENT_NAV_ITEMS = STUDENT_NAV_SECTIONS.flatMap((section) => section.items);

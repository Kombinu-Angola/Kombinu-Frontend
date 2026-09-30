import type { SVGProps } from "react";
import {
  Check, X, ArrowRight, ArrowLeft, HelpCircle, Zap, BookOpen, BadgeCheck, Target, Trophy,
  Snowflake, Signal, Lock, Upload, FileText, Shield, Clock, Hourglass, Paperclip, Phone,
  MessageCircle, Pencil, Sparkles, Cloud, Plus, GraduationCap, Wallet, AlertTriangle, BarChart3,
  Headphones, Flame, Bell, LayoutGrid, ShoppingBag, Star, Search, TrendingUp, Gem, Heart, Scale,
  Cpu, Pause, Play, Share2, MessageSquare, Image, Video, BarChart2, Eye, List, Trash2, Lightbulb,
  Settings, Menu, MoreHorizontal, RefreshCw, Download, Key, Minus, Users, ZoomIn, ZoomOut,
  ExternalLink, type LucideIcon,
} from "lucide-react";

/**
 * Ícones de interface do design system, mapeados para o lucide-react
 * (único pacote de ícones do projecto — ver CLAUDE.md). Mantém os mesmos
 * nomes lógicos do pacote de origem das telas para não obrigar a editar
 * cada ecrã que usa <Icon name="..." />.
 */
const ICONS = {
  check: Check,
  x: X,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,
  help: HelpCircle,
  bolt: Zap,
  book: BookOpen,
  seal: BadgeCheck,
  target: Target,
  trophy: Trophy,
  snow: Snowflake,
  signal: Signal,
  lock: Lock,
  upload: Upload,
  file: FileText,
  shield: Shield,
  clock: Clock,
  hourglass: Hourglass,
  paperclip: Paperclip,
  phone: Phone,
  chat: MessageCircle,
  edit: Pencil,
  sparkle: Sparkles,
  cloud: Cloud,
  plus: Plus,
  school: GraduationCap,
  wallet: Wallet,
  alert: AlertTriangle,
  chart: BarChart3,
  headphones: Headphones,
  flame: Flame,
  bell: Bell,
  grid: LayoutGrid,
  bag: ShoppingBag,
  star: Star,
  search: Search,
  "trend-up": TrendingUp,
  gem: Gem,
  heart: Heart,
  scale: Scale,
  cpu: Cpu,
  pause: Pause,
  play: Play,
  share: Share2,
  comment: MessageSquare,
  image: Image,
  video: Video,
  poll: BarChart2,
  eye: Eye,
  list: List,
  trash: Trash2,
  lightbulb: Lightbulb,
  gear: Settings,
  menu: Menu,
  dots: MoreHorizontal,
  refresh: RefreshCw,
  download: Download,
  key: Key,
  minus: Minus,
  users: Users,
  "zoom-in": ZoomIn,
  "zoom-out": ZoomOut,
  external: ExternalLink,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  /** Se definido, o ícone passa a ter nome acessível; caso contrário é decorativo. */
  label?: string;
};

export function Icon({ name, size = 24, label, strokeWidth = 2, ...rest }: IconProps) {
  const LucideGlyph = ICONS[name];
  return (
    <LucideGlyph
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...rest}
    />
  );
}

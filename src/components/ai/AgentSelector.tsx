import { 
  Brain, 
  GraduationCap, 
  ClipboardCheck, 
  BookOpen, 
  Languages 
} from "lucide-react";
import { AgentCard, Agent } from "./AgentCard";

export const agents: Agent[] = [
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Çoxseçimli, doğru/yanlış və açıq suallar yaradır",
    icon: Brain,
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
    systemPrompt: `Sən Quiz Master - sual yaratma ekspertisən. 
Səndən istənilən mövzu üzrə yüksək keyfiyyətli test sualları yaratmalısan.
Suallar aydın, düzgün və öyrənmə məqsədinə uyğun olmalıdır.
Hər sual üçün izah da verməlisən.`
  },
  {
    id: "curriculum-designer",
    name: "Kurikulum Dizayneri",
    description: "Mövzu planlaması və öyrənmə nəticələri hazırlayır",
    icon: GraduationCap,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    systemPrompt: `Sən Kurikulum Dizayneri - təhsil proqramı mütəxəssisisən.
Mövzu planları, öyrənmə nəticələri və təlim strukturları hazırlamaqda köməkçisən.
Bloom taksonomiyasına uyğun öyrənmə məqsədləri formalaşdırırsan.`
  },
  {
    id: "assessment-expert",
    name: "Qiymətləndirmə Eksperti",
    description: "Bloom taksonomiyasına uyğun suallar hazırlayır",
    icon: ClipboardCheck,
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
    systemPrompt: `Sən Qiymətləndirmə Eksperti - pedaqoji qiymətləndirmə mütəxəssisisən.
Bloom taksonomiyasının 6 səviyyəsinə uyğun suallar yaradırsan:
1. Yadda saxlama 2. Anlama 3. Tətbiqetmə 4. Analiz 5. Sintez 6. Qiymətləndirmə
Hər sualın hansı səviyyəyə aid olduğunu göstərirsən.`
  },
  {
    id: "subject-specialist",
    name: "Fənn Mütəxəssisi",
    description: "Dərin mövzu təhlili və məzmun hazırlayır",
    icon: BookOpen,
    color: "bg-gradient-to-br from-orange-500 to-amber-600",
    systemPrompt: `Sən Fənn Mütəxəssisi - dərin bilik sahibisən.
İstənilən fənn üzrə ətraflı izahlar, nümunələr və məzmun hazırlayırsan.
Mövzuları sadə dildə izah edə və çətin konsepsiyaları aydınlaşdıra bilirsən.`
  },
  {
    id: "language-coach",
    name: "Dil Köməkçisi",
    description: "Çox dilli məzmun və tərcümə dəstəyi verir",
    icon: Languages,
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    systemPrompt: `Sən Dil Köməkçisi - çox dilli təhsil ekspertisən.
Azərbaycan, İngilis, Rus və Türk dillərində məzmun yarada bilirsən.
Terminlərin düzgün tərcüməsini və dil uyğunluğunu təmin edirsən.`
  }
];

interface AgentSelectorProps {
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function AgentSelector({ selectedAgentId, onSelectAgent }: AgentSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isSelected={selectedAgentId === agent.id}
          onClick={() => onSelectAgent(agent.id)}
        />
      ))}
    </div>
  );
}

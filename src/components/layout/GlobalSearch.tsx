import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileQuestion, Users, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchResult {
  id: string;
  title: string;
  type: "quiz" | "question" | "user" | "page";
  url: string;
}

const quickLinks: SearchResult[] = [
  { id: "1", title: "Ana Səhifə", type: "page", url: "/" },
  { id: "2", title: "Quizlər", type: "page", url: "/quizzes" },
  { id: "3", title: "Liderlik Cədvəli", type: "page", url: "/leaderboard" },
  { id: "4", title: "Quiz Yarat", type: "page", url: "/teacher/create-quiz" },
  { id: "5", title: "Quizlərim", type: "page", url: "/teacher/my-quizzes" },
  { id: "6", title: "AI Köməkçi", type: "page", url: "/teacher/ai-assistant" },
  { id: "7", title: "Sual Bankı", type: "page", url: "/teacher/question-bank" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (result: SearchResult) => {
    // Add to recent searches
    const newRecent = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));
    
    setOpen(false);
    navigate(result.url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <FileQuestion className="mr-2 h-4 w-4" />;
      case "question":
        return <BookOpen className="mr-2 h-4 w-4" />;
      case "user":
        return <Users className="mr-2 h-4 w-4" />;
      default:
        return <Search className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-9 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Axtar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Axtar..." />
        <CommandList>
          <CommandEmpty>Nəticə tapılmadı.</CommandEmpty>
          
          {recentSearches.length > 0 && (
            <>
              <CommandGroup heading="Son Axtarışlar">
                {recentSearches.map((search, index) => (
                  <CommandItem key={index} className="cursor-pointer">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {search}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}
          
          <CommandGroup heading="Sürətli Keçidlər">
            {quickLinks.map((link) => (
              <CommandItem
                key={link.id}
                onSelect={() => handleSelect(link)}
                className="cursor-pointer"
              >
                {getIcon(link.type)}
                {link.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

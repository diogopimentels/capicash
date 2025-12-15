import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function ThemeToggle() {
    const handleToggle = () => {
        toast("Em breve!", {
            description: "O Modo Claro está sendo polido para uma experiência visual incrível.",
            action: {
                label: "Entendi",
                onClick: () => console.log("Undo"),
            },
        })
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="rounded-full w-10 h-10 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden"
        >
            {/* Show only Moon (Dark Mode active) or a generic theme icon */}
            <Sun className="h-[1.2rem] w-[1.2rem] text-zinc-400 absolute opacity-0 scale-0" />
            <Moon className="h-[1.2rem] w-[1.2rem] text-white transition-all scale-100 rotate-0" />
            <span className="sr-only">Alternar tema</span>
        </Button>
    )
}

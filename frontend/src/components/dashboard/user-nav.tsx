import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk, useUser } from "@clerk/clerk-react";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
    const { signOut } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-white/10">
                        <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                        <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            {/* ForceMount garante que o menu seja renderizado corretamente */}
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    {/* Item PERFIL - Visível sempre */}
                    <DropdownMenuItem onClick={() => navigate("/dashboard/profile")} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>

                    {/* Item CONFIGURAÇÕES - Oculto no Mobile (hidden), Visível no Desktop (md:flex) 
              NOTA: Como este componente pode ser usado no MobileHeader (que já é mobile-only), 
              o hidden md:flex vai esconder sempre se estiver dentro de um container pequeno, 
              mas funcionará corretamente se usado em um header responsivo.
          */}
                    <DropdownMenuItem
                        onClick={() => navigate("/dashboard/settings")}
                        className="hidden md:flex cursor-pointer"
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configurações</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Item LOGOUT - Visível sempre */}
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

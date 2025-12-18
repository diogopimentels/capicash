import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export function useUserSync() {
    const { user, isLoaded: isUserLoaded } = useUser();
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        const syncUser = async () => {
            if (!isUserLoaded || !user) return;

            try {
                // Endpoint .NET 8: POST /users/sync
                console.log("🛡️ [SYNC] Synchronizing user with .NET Backend...");

                // Mock CPF for Dev logic (User needs to input this in Settings later)
                const mockDocument = "00000000000";

                await api.post("/users/sync", {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    name: user.fullName || "Novo Usuário",
                    document: mockDocument,
                    avatarUrl: user.imageUrl
                });

                console.log("✅ [SYNC] User synchronized.");
                queryClient.invalidateQueries({ queryKey: ['metrics'] });

            } catch (error) {
                console.error("❌ [SYNC] Failed:", error);
            }
        };

        syncUser();
    }, [isUserLoaded, user, getToken, queryClient]);
}

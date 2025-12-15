import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { Logo } from '@/components/shared/Logo';
import { toast } from 'sonner';

export function LoginPage() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const { isSignedIn } = useAuth();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            window.location.href = '/dashboard';
        }
    }, [isLoaded, isSignedIn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!signIn) return;

        try {
            setIsLoading(true);

            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                // Force hard reload to ensure clean state
                window.location.href = '/dashboard';
            } else {
                console.log('Login incomplete:', result);
                toast.error('Login incompleto. Verifique seu email.');
            }
        } catch (error: any) {
            console.error('Erro no login:', error);

            if (error.errors?.[0]?.code === 'form_identifier_not_found') {
                toast.error('Email não encontrado');
            } else if (error.errors?.[0]?.code === 'form_password_incorrect') {
                toast.error('Senha incorreta');
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Base - O Vazio */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 to-transparent pointer-events-none" />

            {/* Main Container - O Vidro */}
            <div className="w-full max-w-[420px] relative z-10">
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl shadow-black p-8 sm:p-10">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10 space-y-4">
                        <Logo className="w-10 h-10" forceTheme="dark" showText={false} />
                        <div className="text-center">
                            <h1 className="text-2xl font-medium text-white tracking-tight">
                                Bem-vindo
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1">
                                Entre para gerenciar suas vendas
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-500 ml-1">Email</label>
                            <div className="relative group focus-within:ring-1 focus-within:ring-white/20 rounded-xl transition-all">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full bg-white/5 text-zinc-100 placeholder:text-zinc-600 rounded-xl border-none pl-11 pr-4 py-3.5 text-sm focus:ring-0 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-500 ml-1">Senha</label>
                            <div className="relative group focus-within:ring-1 focus-within:ring-white/20 rounded-xl transition-all">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 text-zinc-100 placeholder:text-zinc-600 rounded-xl border-none pl-11 pr-11 py-3.5 text-sm focus:ring-0 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Main Action */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-lg shadow-emerald-900/20"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <span>Entrar</span>
                            )}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-8 flex flex-col items-center gap-4 text-sm">
                        <Link
                            to="/auth/forgot-password"
                            className="text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                            Esqueceu a senha?
                        </Link>

                        <div className="w-full h-px bg-white/5" />

                        <div className="text-zinc-500">
                            Não tem conta?{' '}
                            <Link
                                to="/auth/register"
                                className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                            >
                                Criar agora
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

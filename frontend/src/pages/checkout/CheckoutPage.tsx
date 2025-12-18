import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { checkoutService, type CheckoutResponse } from "@/services/checkout.service";
import { Loader2, CheckCircle, Copy } from "lucide-react";

export function CheckoutPage() {
    const { id: productId } = useParams();
    const [step, setStep] = useState<'FORM' | 'PAYMENT' | 'PAID'>('FORM');
    const [loading, setLoading] = useState(false);
    const [pixData, setPixData] = useState<CheckoutResponse | null>(null);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");

    // Polling Effect
    useEffect(() => {
        let interval: any;

        if (step === 'PAYMENT' && pixData?.paymentId) {
            interval = setInterval(async () => {
                try {
                    const { status } = await checkoutService.checkStatus(pixData.paymentId);
                    if (status === 'PAID') {
                        setStep('PAID');
                        clearInterval(interval);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                }
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [step, pixData]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId) return;

        setLoading(true);
        try {
            console.log("Tentando pagar...");
            const response = await fetch("http://localhost:5147/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // SEM HEADER DE AUTH
                body: JSON.stringify({
                    productId,
                    buyerName: name,
                    buyerEmail: email,
                    buyerCpf: cpf
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || response.statusText);
            }

            const data = await response.json();
            console.log("Sucesso:", data);

            setPixData(data);
            setStep('PAYMENT');
        } catch (error: any) {
            console.error("Erro fatal:", error);
            alert("Erro: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyPix = () => {
        if (pixData?.pixCopiaECola || pixData?.invoiceUrl) {
            navigator.clipboard.writeText(pixData.pixCopiaECola || pixData.invoiceUrl);
            alert("Pix Copiado!");
        }
    };

    if (step === 'PAID') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl text-green-700">Pagamento Confirmado!</CardTitle>
                        <CardDescription>Obrigado pela sua compra. Enviamos o acesso para seu email.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button className="w-full bg-green-600 hover:bg-green-700">Acessar Produto</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Checkout Seguro</CardTitle>
                    <CardDescription>
                        {step === 'FORM' ? "Informe seus dados para prosseguir" : "Escaneie o QR Code para pagar"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'FORM' && (
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input id="name" required placeholder="João Silva" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" required type="email" placeholder="joao@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input id="cpf" required placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Gerando Pix..." : "Pagar com Pix"}
                            </Button>
                        </form>
                    )}

                    {step === 'PAYMENT' && pixData && (
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-lg bg-gray-100 border-2 border-dashed border-gray-300">
                                {pixData.encodedImage ? (
                                    <img src={`data:image/png;base64,${pixData.encodedImage}`} alt="QR Code Pix" className="h-full w-full object-contain" />
                                ) : (
                                    <p className="text-sm text-gray-500">QR Code não disponível (Use Copia e Cola)</p>
                                )}
                            </div>

                            <div className="w-full space-y-2">
                                <Label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Pix Copia e Cola</Label>
                                <div className="flex items-center space-x-2">
                                    <Input readOnly value={pixData.pixCopiaECola || pixData.invoiceUrl} className="font-mono text-xs bg-gray-50" />
                                    <Button size="icon" variant="outline" onClick={copyPix}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-center space-x-2 text-sm text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Aguardando pagamento...</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

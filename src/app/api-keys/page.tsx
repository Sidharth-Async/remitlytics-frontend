"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  KeyRound, 
  ShieldAlert, 
  Copy, 
  Check, 
  Plus, 
  Zap 
} from "lucide-react";

interface MockApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  status: "ACTIVE" | "REVOKED";
  rateLimitReqPerMin: number;
  remainingTokens: number;
  createdAt: string;
}

export default function ApiKeysPage() {
  // Client-only Mock State
  const [keys, setKeys] = useState<MockApiKey[]>([
    {
      id: "key-1",
      name: "Default Development Secret",
      keyPrefix: "remit_live_secret123",
      status: "ACTIVE",
      rateLimitReqPerMin: 100,
      remainingTokens: 98,
      createdAt: "2026-08-01",
    },
    {
      id: "key-2",
      name: "Staging Testing Token",
      keyPrefix: "remit_test_8841a129",
      status: "REVOKED",
      rateLimitReqPerMin: 50,
      remainingTokens: 0,
      createdAt: "2026-07-15",
    },
  ]);

  // Modal & Key Generation State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [rateLimit, setRateLimit] = useState(100);
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a realistic client-side secret string
    const rawSecret = `remit_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    const newKey: MockApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: rawSecret.substring(0, 15),
      status: "ACTIVE",
      rateLimitReqPerMin: Number(rateLimit),
      remainingTokens: Number(rateLimit),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setKeys([newKey, ...keys]);
    setGeneratedSecret(rawSecret);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys((prevKeys) =>
      prevKeys.map((k) => (k.id === keyId ? { ...k, status: "REVOKED", remainingTokens: 0 } : k))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setGeneratedSecret(null);
    setNewKeyName("");
    setRateLimit(100);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                API Key Management
              </h1>
              <p className="text-sm text-slate-500">
                Manage SHA-256 tenant credentials and Bucket4j rate limiting
              </p>
            </div>
          </div>

          {/* Create API Key Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetModal();
            setIsDialogOpen(open);
          }}>
            <DialogTrigger render={
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" />
                Generate Secret
              </Button>
            } />
            <DialogContent className="sm:max-w-md">
              {generatedSecret ? (
                <div className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-emerald-600">
                      <KeyRound className="mr-2 h-5 w-5" />
                      API Key Generated
                    </DialogTitle>
                    <DialogDescription>
                      Copy this secret token now. It is hashed using SHA-256 on the server and will not be displayed again.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center gap-2 rounded-lg bg-slate-950 p-3 font-mono text-xs text-indigo-300">
                    <span className="truncate flex-1">{generatedSecret}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(generatedSecret)}
                      className="h-7 w-7 text-slate-400 hover:text-white"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button onClick={resetModal} className="w-full bg-slate-900">
                      I Have Stored The Secret
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <form onSubmit={handleGenerateKey}>
                  <DialogHeader>
                    <DialogTitle>Issue New API Key</DialogTitle>
                    <DialogDescription>
                      Create a unique secret key for isolated tenant API access.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-700">Key Identifier Name</label>
                      <Input
                        placeholder="e.g. Production Mobile App"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-700">Bucket4j Rate Limit (req/min)</label>
                      <Input
                        type="number"
                        value={rateLimit}
                        onChange={(e) => setRateLimit(Number(e.target.value))}
                        required
                      />
                      <p className="text-[11px] text-slate-500">
                        Enforces Bucket4j token bucket rate limiting on every incoming request.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
                      Generate Key
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Active &amp; Revoked Secrets
            </CardTitle>
            <CardDescription>
              Authenticates requests passed via the `X-API-KEY` HTTP header.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {keys.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-slate-500">
                No API keys generated yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key Identifier</TableHead>
                    <TableHead>Token Prefix</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bucket4j Capacity</TableHead>
                    <TableHead>Tokens Remaining</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium text-slate-900">
                        {key.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {key.keyPrefix}••••••••
                      </TableCell>
                      <TableCell>
                        {key.status === "ACTIVE" ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-700">ACTIVE</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500 border-slate-300">REVOKED</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <span className="inline-flex items-center">
                          <Zap className="mr-1 h-3.5 w-3.5 text-amber-500" />
                          {key.rateLimitReqPerMin} req/min
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-slate-700">
                        {key.remainingTokens} / {key.rateLimitReqPerMin}
                      </TableCell>
                      <TableCell className="text-right">
                        {key.status === "ACTIVE" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeKey(key.id)}
                            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <ShieldAlert className="mr-1 h-3.5 w-3.5" />
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
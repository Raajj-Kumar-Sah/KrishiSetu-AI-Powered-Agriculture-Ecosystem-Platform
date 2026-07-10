import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, ImageUp, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAiChatMutation, useChatHistoryQuery, useDetectDiseaseMutation, useDiseaseHistoryQuery } from "@/api/apiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { resolveItems } from "@/lib/utils";

const chatSchema = z.object({ question: z.string().min(2) });

export default function AIAssistantPage() {
  const [detectDisease, diseaseState] = useDetectDiseaseMutation();
  const [chat, chatState] = useAiChatMutation();
  const { data: diseaseHistory } = useDiseaseHistoryQuery();
  const { data: chatHistory } = useChatHistoryQuery();
  const [result, setResult] = useState(null);
  const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(chatSchema) });

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("image", file);
    form.append("cropName", "Unknown crop");
    await detectDisease(form).unwrap().then((response) => { setResult(response); toast.success("Disease scan complete"); }).catch((error) => toast.error(error?.data?.message || "Scan failed"));
  };

  const ask = async (values) => {
    await chat(values).unwrap().then((response) => { setResult(response); reset(); }).catch((error) => toast.error(error?.data?.message || "AI chat failed"));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="AI assistant" description="Disease detection, chat history, recommendations, and nearby store intelligence backed by the protected AI routes." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Disease detection</CardTitle></CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 p-10 text-center">
                <ImageUp className="h-10 w-10 text-primary" />
                <span className="mt-3 font-semibold">{diseaseState.isLoading ? "Analyzing image..." : "Upload crop image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={upload} />
              </label>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>AI chat</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(ask)} className="flex gap-3">
                <Input placeholder="Ask about crop care, pests, soil, weather, or treatment" {...register("question")} />
                <Button disabled={chatState.isLoading}><Send className="h-4 w-4" /></Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Latest result</CardTitle></CardHeader>
            <CardContent>
              {result ? <pre className="max-h-80 overflow-auto rounded-lg bg-slate-950 p-4 text-sm text-white">{JSON.stringify(result, null, 2)}</pre> : <EmptyState title="No AI result yet" description="Upload an image or send a chat message." />}
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-5">
          <HistoryCard title="Disease history" icon={Bot} items={resolveItems(diseaseHistory)} />
          <HistoryCard title="Chat history" icon={Bot} items={resolveItems(chatHistory)} />
        </aside>
      </div>
    </main>
  );
}

function HistoryCard({ title, icon: Icon, items }) {
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /> {title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {!items.length && <p className="text-sm text-muted-foreground">No records yet.</p>}
        {items.slice(0, 5).map((item) => <div key={item._id || item.id} className="rounded-lg border p-3 text-sm">{item.diseaseName || item.question || item.prompt || item.createdAt}</div>)}
      </CardContent>
    </Card>
  );
}

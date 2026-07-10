import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Bot, IndianRupee, Package, Users } from "lucide-react";
import { useAiAnalyticsQuery, useCropsQuery, useEquipmentQuery, useRevenueAnalyticsQuery } from "@/api/apiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { resolveItems } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

export default function AdminDashboardPage() {
  const { data: crops } = useCropsQuery();
  const { data: equipment } = useEquipmentQuery();
  const { data: ai } = useAiAnalyticsQuery();
  const { data: revenue } = useRevenueAnalyticsQuery();

  const revenueData = resolveSeries(revenue, "revenue");
  const aiData = resolveSeries(ai, "count");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <PageHeader title="Admin analytics" description="High-level operational analytics connected to available marketplace, equipment, payment, and AI endpoints." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Package} label="Crop listings" value={resolveItems(crops).length} />
        <StatCard icon={Users} label="Equipment" value={resolveItems(equipment).length} tone="text-yellow-600" />
        <StatCard icon={Bot} label="AI events" value={ai?.total || ai?.count || resolveItems(ai).length || 0} tone="text-lime-600" />
        <StatCard icon={IndianRupee} label="Revenue" value={revenue?.totalRevenue || revenue?.total || 0} tone="text-blue-600" />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent>
            <Bar data={chartData(revenueData, "Revenue")} options={chartOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Disease statistics</CardTitle></CardHeader>
          <CardContent>
            <Line data={chartData(aiData, "AI activity")} options={chartOptions} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true } },
};

function chartData(series, label) {
  return {
    labels: series.map((item) => item.label),
    datasets: [{ label, data: series.map((item) => item.value), backgroundColor: "#16A34A", borderColor: "#16A34A", tension: 0.35 }],
  };
}

function resolveSeries(payload, key) {
  const items = resolveItems(payload?.monthly || payload?.stats || payload);
  if (items.length) {
    return items.slice(0, 8).map((item, index) => ({
      label: item.month || item.date || item.name || `P${index + 1}`,
      value: Number(item[key] || item.total || item.count || 0),
    }));
  }
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label) => ({ label, value: 0 }));
}

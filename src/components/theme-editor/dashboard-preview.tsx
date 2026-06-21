"use client";

/* A realistic dashboard mock composed of real Kraken components, used as the live
 * preview surface for the theme editor. Layout chrome uses --ds-spacing-* vars so
 * the spacing multiplier visibly affects gaps/padding too, not just components. */

import {
  TrendingUp,
  Users,
  CreditCard,
  Activity,
  Search,
  Plus,
  Bell,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const stats = [
  { label: "Revenue", value: "$48,210", delta: "+12.5%", icon: CreditCard },
  { label: "Active users", value: "2,318", delta: "+4.1%", icon: Users },
  { label: "Conversion", value: "3.6%", delta: "+0.8%", icon: TrendingUp },
  { label: "Sessions", value: "9,841", delta: "-2.3%", icon: Activity },
];

const orders = [
  { id: "#1042", customer: "Ada Lovelace", status: "Paid", amount: "$320.00" },
  { id: "#1041", customer: "Alan Turing", status: "Pending", amount: "$150.00" },
  { id: "#1040", customer: "Grace Hopper", status: "Paid", amount: "$540.00" },
  { id: "#1039", customer: "Linus Pauling", status: "Refunded", amount: "$90.00" },
];

const statusColor = (s: string) =>
  s === "Paid" ? "green" : s === "Pending" ? "amber" : s === "Refunded" ? "red" : "neutral";

export function DashboardPreview() {
  return (
    <div
      className="bg-background text-foreground [padding:var(--ds-spacing-24)] [&_*]:transition-[padding,gap,border-radius] [&_*]:duration-150"
      style={{ display: "flex", flexDirection: "column", gap: "var(--ds-spacing-24)" }}
    >
      {/* Topbar */}
      <div className="flex items-center justify-between [gap:var(--ds-spacing-16)]">
        <div className="flex items-center [gap:var(--ds-spacing-12)]">
          <div className="size-8 rounded-[var(--ds-radius-md)] bg-primary" />
          <div>
            <div className="text-sm font-semibold">Kraken Analytics</div>
            <div className="text-xs text-muted-foreground">Overview · Last 30 days</div>
          </div>
        </div>
        <div className="flex items-center [gap:var(--ds-spacing-8)]">
          <div className="w-56 max-sm:hidden">
            <InputField placeholder="Search…" leftDecoration={<Search />} aria-label="Search" />
          </div>
          <Button variant="ghost" size="md" iconOnly aria-label="Notifications" leftIcon={<Bell />} />
          <Button variant="ghost" size="md" iconOnly aria-label="Settings" leftIcon={<Settings />} />
          <Avatar fallback="WZ" />
        </div>
      </div>

      {/* Hero — shows heading font + type scale */}
      <div>
        <h1 className="[font-family:var(--ds-typography-headingxl-fontfamily)] [font-size:var(--ds-typography-headingxl-fontsize)] [font-weight:var(--ds-typography-headingxl-fontweight)] [line-height:var(--ds-typography-headingxl-lineheight)] text-foreground">
          Good morning, Wojciech
        </h1>
        <p className="[font-family:var(--ds-typography-bodymd-fontfamily)] [font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)] text-muted-foreground [margin-top:var(--ds-spacing-4)]">
          Here&apos;s how your workspace is performing today. The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 [gap:var(--ds-spacing-16)]">
        {stats.map(({ label, value, delta, icon: Icon }) => {
          const up = delta.startsWith("+");
          return (
            <Card key={label} filled>
              <CardHeader>
                <CardDescription className="flex items-center justify-between">
                  {label}
                  <Icon className="size-4 text-muted-foreground" />
                </CardDescription>
                <CardTitle className="text-2xl">{value}</CardTitle>
              </CardHeader>
              <CardFooter>
                <Badge color={up ? "green" : "red"} appearance="ghost" size="sm">
                  <ArrowUpRight className={up ? "" : "rotate-90"} />
                  {delta}
                </Badge>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Main two-column area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 [gap:var(--ds-spacing-24)]">
        {/* Orders table with tabs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
              <CardDescription>Latest transactions across all channels.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList variant="line">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="[padding-top:var(--ds-spacing-12)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.id}</TableCell>
                          <TableCell>{o.customer}</TableCell>
                          <TableCell>
                            <Badge color={statusColor(o.status)} appearance="outlined" size="sm">
                              {o.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">{o.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="paid" className="[padding-top:var(--ds-spacing-12)] text-sm text-muted-foreground">
                  2 paid orders this period.
                </TabsContent>
                <TabsContent value="pending" className="[padding-top:var(--ds-spacing-12)] text-sm text-muted-foreground">
                  1 pending order awaiting payment.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right column: form + alert + progress */}
        <div className="flex flex-col [gap:var(--ds-spacing-16)]">
          <Alert type="informational">
            <AlertTitle>Plan usage at 82%</AlertTitle>
            <AlertDescription>You are approaching your monthly limit.</AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Quick invite</CardTitle>
              <CardDescription>Add a teammate to the workspace.</CardDescription>
            </CardHeader>
            <CardContent style={{ display: "flex", flexDirection: "column", gap: "var(--ds-spacing-16)" }}>
              <InputField label="Email" placeholder="name@company.com" mandatory />
              <div className="flex items-center justify-between">
                <span className="text-sm">Send welcome email</span>
                <Switch defaultChecked aria-label="Send welcome email" />
              </div>
              <Separator />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-spacing-8)" }}>
                <Progress value={62} label="Storage" showLabels />
              </div>
            </CardContent>
            <CardFooter className="flex [gap:var(--ds-spacing-8)]">
              <Button variant="primary" size="md" leftIcon={<Plus />}>
                Invite
              </Button>
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

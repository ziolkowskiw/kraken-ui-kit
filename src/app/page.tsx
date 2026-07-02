"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const BRANDS = ["jit", "brand"] as const;
type Brand = (typeof BRANDS)[number];

export default function Showcase() {
  const [brand, setBrand] = useState<Brand>("jit");

  function applyBrand(next: Brand) {
    setBrand(next);
    // jit is the :root default — no attribute needed; brand is an override.
    if (next === "jit") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      {/* Brand toggle — the live "change the semantic layer" control */}
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kraken UI Kit</h1>
          <p className="text-muted-foreground text-sm">
            One token system, two brands. Flip the brand — the whole kit re-skins.
          </p>
        </div>
        <div className="bg-muted inline-flex rounded-lg p-1">
          {BRANDS.map((b) => (
            <button
              key={b}
              onClick={() => applyBrand(b)}
              data-active={brand === b}
              className="data-[active=true]:bg-background data-[active=true]:text-foreground text-muted-foreground rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors data-[active=true]:shadow-sm"
            >
              {b}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Variants & sizes — primary follows the brand.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tonal">Tonal</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">xs</Button>
              <Button size="sm">sm</Button>
              <Button size="md">md</Button>
              <Button size="lg">lg</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>color × appearance — mirrors the Figma set.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge color="neutral">Neutral</Badge>
              <Badge color="green">Green</Badge>
              <Badge color="red">Red</Badge>
              <Badge color="amber">Amber</Badge>
              <Badge color="blue">Blue</Badge>
              <Badge color="purple">Purple</Badge>
              <Badge color="brand">Brand</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge color="blue" appearance="filled">Filled</Badge>
              <Badge color="blue" appearance="outlined">Outlined</Badge>
              <Badge color="blue" appearance="ghost">Ghost</Badge>
              <Badge color="blue" shape="square">Square</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form controls */}
        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>Input, select, choices.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Input placeholder="Email address" />
            <Textarea placeholder="Your message…" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pick an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">One</SelectItem>
                <SelectItem value="two">Two</SelectItem>
                <SelectItem value="three">Three</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <label htmlFor="terms" className="text-sm">
                I agree to the terms
              </label>
            </div>
            <RadioGroup defaultValue="a" className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="a" /> Option A
              </label>
              <label className="flex items-center gap-2 text-sm">
                <RadioGroupItem value="b" /> Option B
              </label>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Switch id="notifications" defaultChecked />
              <label htmlFor="notifications" className="text-sm">
                Notifications
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Tabs + Alert + Dialog */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs, alert & dialog</CardTitle>
            <CardDescription>Composed components.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-muted-foreground text-sm">
                The overview tab content.
              </TabsContent>
              <TabsContent value="activity" className="text-muted-foreground text-sm">
                The activity tab content.
              </TabsContent>
            </Tabs>
            <Alert>
              <AlertTitle>Heads up</AlertTitle>
              <AlertDescription>This alert uses semantic tokens.</AlertDescription>
            </Alert>
            <Dialog>
              <DialogTrigger
                render={<Button variant="secondary">Open dialog</Button>}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Brand-aware dialog</DialogTitle>
                  <DialogDescription>
                    Every surface here is driven by the active brand’s tokens.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="secondary">Cancel</Button>} />
                  <DialogClose render={<Button>Confirm</Button>} />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
          <CardFooter className="text-muted-foreground text-xs">
            Active brand: <span className="ml-1 font-medium capitalize">{brand}</span>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

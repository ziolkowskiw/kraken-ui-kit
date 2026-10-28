import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { CircleCheck } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputField } from "@/components/ui/input";
import { SelectField, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ROLES = ["Designer", "Engineer", "Product manager"] as const;

// Validation lives in the page, not in the kit: components only render the error state.
function SettingsForm() {
  const [email, setEmail] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const emailError = email.length > 0 && !email.includes("@") ? "Enter a valid email address" : "";

  return (
    <Card className="w-96">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(email.includes("@"));
        }}
      >
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>How you appear to your team.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {saved && (
            <Alert type="success" icon={<CircleCheck />}>
              <AlertTitle>Profile saved</AlertTitle>
              <AlertDescription>Your changes are live.</AlertDescription>
            </Alert>
          )}
          <InputField label="Full name" mandatory defaultValue="Ada Lovelace" />
          <InputField
            label="Email"
            mandatory
            placeholder="name@company.com"
            value={email}
            onChange={(event) => {
              setSaved(false);
              setEmail(event.target.value);
            }}
            errorMessage={emailError}
          />
          <SelectField label="Role" placeholder="Pick a role" defaultValue={ROLES[0]}>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectField>
          <Switch rightLabel="Email me about activity" />
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost" size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Save changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

const meta = {
  title: "Patterns/Settings form",
  component: SettingsForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A card form that composes InputField, SelectField, Switch, Alert and Button. Shows where validation belongs: the page owns it, the kit renders the error state through `errorMessage`.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// Interaction test: a bad email shows the field error, a good one saves.
export const ValidatesEmail: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole("textbox", { name: /^Email/ });
    await userEvent.type(email, "not-an-email");
    await expect(await canvas.findByText("Enter a valid email address")).toBeVisible();
    await userEvent.clear(email);
    await userEvent.type(email, "ada@company.com");
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(canvas.getByText("Profile saved")).toBeVisible());
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { icons } from "lucide-react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { Info } from "lucide-react";

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "tonal",
  "ghost",
  "destructive",
  "destructive-secondary",
  "destructive-ghost",
] as const;
const BUTTON_SIZES = ["xs", "sm", "md", "lg"] as const;

type IconName = "none" | keyof typeof icons;
const ICON_OPTIONS: IconName[] = ["none", ...(Object.keys(icons) as (keyof typeof icons)[])];
const renderIcon = (name?: IconName): React.ReactNode => {
  if (!name || name === "none") return undefined;
  const Icon = icons[name as keyof typeof icons];
  return Icon ? <Icon /> : undefined;
};

type ButtonConfig = {
  show: boolean;
  label: string;
  variant: (typeof BUTTON_VARIANTS)[number];
  size: (typeof BUTTON_SIZES)[number];
  iconOnly: boolean;
  leftIconName: IconName;
  rightIconName: IconName;
  closesDialog: boolean;
};

function renderButton(cfg: ButtonConfig, key: string) {
  if (!cfg.show) return null;
  const btn = (
    <Button
      variant={cfg.variant}
      size={cfg.size}
      iconOnly={cfg.iconOnly}
      leftIcon={renderIcon(cfg.leftIconName)}
      rightIcon={renderIcon(cfg.rightIconName)}
    >
      {cfg.iconOnly ? renderIcon(cfg.leftIconName) : cfg.label}
    </Button>
  );
  if (cfg.closesDialog) {
    return (
      <AlertDialogClose key={key} render={btn}>
        {cfg.iconOnly ? renderIcon(cfg.leftIconName) : cfg.label}
      </AlertDialogClose>
    );
  }
  return <React.Fragment key={key}>{btn}</React.Fragment>;
}

type StoryProps = {
  variant: "default";
  title: string;
  description: string;
  closeIcon: boolean;
  // Left slot — button 1
  left1Show: boolean;
  left1Label: string;
  left1Variant: (typeof BUTTON_VARIANTS)[number];
  left1Size: (typeof BUTTON_SIZES)[number];
  left1IconOnly: boolean;
  left1LeftIcon: IconName;
  left1RightIcon: IconName;
  left1ClosesDialog: boolean;
  // Left slot — button 2
  left2Show: boolean;
  left2Label: string;
  left2Variant: (typeof BUTTON_VARIANTS)[number];
  left2Size: (typeof BUTTON_SIZES)[number];
  left2IconOnly: boolean;
  left2LeftIcon: IconName;
  left2RightIcon: IconName;
  left2ClosesDialog: boolean;
  // Right slot — button 1
  right1Show: boolean;
  right1Label: string;
  right1Variant: (typeof BUTTON_VARIANTS)[number];
  right1Size: (typeof BUTTON_SIZES)[number];
  right1IconOnly: boolean;
  right1LeftIcon: IconName;
  right1RightIcon: IconName;
  right1ClosesDialog: boolean;
  // Right slot — button 2
  right2Show: boolean;
  right2Label: string;
  right2Variant: (typeof BUTTON_VARIANTS)[number];
  right2Size: (typeof BUTTON_SIZES)[number];
  right2IconOnly: boolean;
  right2LeftIcon: IconName;
  right2RightIcon: IconName;
  right2ClosesDialog: boolean;
};

function buttonArgTypes(prefix: string, category: string, ifArg: string) {
  return {
    [`${prefix}Show`]: { control: "boolean", name: "Show", table: { category } },
    [`${prefix}Label`]: { control: "text", name: "Label", table: { category }, if: { arg: ifArg } },
    [`${prefix}Variant`]: {
      control: "select",
      options: BUTTON_VARIANTS,
      name: "Variant",
      table: { category },
      if: { arg: ifArg },
    },
    [`${prefix}Size`]: {
      control: "select",
      options: BUTTON_SIZES,
      name: "Size",
      table: { category },
      if: { arg: ifArg },
    },
    [`${prefix}IconOnly`]: {
      control: "boolean",
      name: "iconOnly",
      table: { category },
      if: { arg: ifArg },
    },
    [`${prefix}LeftIcon`]: {
      control: "select",
      options: ICON_OPTIONS,
      name: "Left icon",
      table: { category },
      if: { arg: ifArg },
    },
    [`${prefix}RightIcon`]: {
      control: "select",
      options: ICON_OPTIONS,
      name: "Right icon",
      table: { category },
      if: { arg: ifArg },
    },
    [`${prefix}ClosesDialog`]: {
      control: "boolean",
      name: "Closes dialog",
      table: { category },
      if: { arg: ifArg },
    },
  };
}

function collectButton(args: Record<string, unknown>, prefix: string): ButtonConfig {
  return {
    show: args[`${prefix}Show`] as boolean,
    label: args[`${prefix}Label`] as string,
    variant: args[`${prefix}Variant`] as ButtonConfig["variant"],
    size: args[`${prefix}Size`] as ButtonConfig["size"],
    iconOnly: args[`${prefix}IconOnly`] as boolean,
    leftIconName: args[`${prefix}LeftIcon`] as IconName,
    rightIconName: args[`${prefix}RightIcon`] as IconName,
    closesDialog: args[`${prefix}ClosesDialog`] as boolean,
  };
}

const meta = {
  title: "Components/AlertDialog",
  // docs-only association; the playground args are story-level props
  component: AlertDialog as React.ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A modal dialog that interrupts the user with important content and expects a response; destructive/irreversible confirmations.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default"], name: "Variant" },
    title: { control: "text", name: "Title" },
    description: { control: "text", name: "Description" },
    closeIcon: { control: "boolean", name: "closeIcon" },
    // dialog-content is a slot — no control, use stories to demonstrate different content
    ...buttonArgTypes("left1", "Left slot: Button 1", "left1Show"),
    ...buttonArgTypes("left2", "Left slot: Button 2", "left2Show"),
    ...buttonArgTypes("right1", "Right slot: Button 1", "right1Show"),
    ...buttonArgTypes("right2", "Right slot: Button 2", "right2Show"),
  } as Meta<StoryProps>["argTypes"],
  args: {
    variant: "default",
    title: "Modal title",
    description: "Are you sure you want to proceed? This action cannot be undone.",
    closeIcon: false,
    // Left slot — 1 ghost button (cancel)
    left1Show: true,
    left1Label: "Label",
    left1Variant: "ghost",
    left1Size: "md",
    left1IconOnly: false,
    left1LeftIcon: "none",
    left1RightIcon: "none",
    left1ClosesDialog: true,
    left2Show: false,
    left2Label: "Label",
    left2Variant: "ghost",
    left2Size: "md",
    left2IconOnly: false,
    left2LeftIcon: "none",
    left2RightIcon: "none",
    left2ClosesDialog: false,
    // Right slot — secondary + primary
    right1Show: true,
    right1Label: "Label",
    right1Variant: "secondary",
    right1Size: "md",
    right1IconOnly: false,
    right1LeftIcon: "none",
    right1RightIcon: "none",
    right1ClosesDialog: true,
    right2Show: true,
    right2Label: "Label",
    right2Variant: "primary",
    right2Size: "md",
    right2IconOnly: false,
    right2LeftIcon: "none",
    right2RightIcon: "none",
    right2ClosesDialog: false,
  },
  render: (args) => {
    const left1 = collectButton(args, "left1");
    const left2 = collectButton(args, "left2");
    const right1 = collectButton(args, "right1");
    const right2 = collectButton(args, "right2");

    const leftButtons = (
      <>
        {renderButton(left1, "l1")}
        {renderButton(left2, "l2")}
      </>
    );
    const rightButtons = (
      <>
        {renderButton(right1, "r1")}
        {renderButton(right2, "r2")}
      </>
    );

    const hasLeft = left1.show || left2.show;
    const hasRight = right1.show || right2.show;

    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Open alert dialog</Button>} />
        <AlertDialogContent
          title={args.title}
          description={args.description || undefined}
          closeIcon={args.closeIcon}
          secondaryActions={hasLeft ? leftButtons : undefined}
          primaryActions={hasRight ? rightButtons : undefined}
        />
      </AlertDialog>
    );
  },
} satisfies Meta<StoryProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Destructive: Story = {
  args: {
    title: "Delete item",
    description: "This will permanently delete the item. This action cannot be undone.",
    left1Label: "Learn more",
    right1Label: "Cancel",
    right2Label: "Delete",
    right2Variant: "destructive",
  },
  render: (args) => {
    const left1 = collectButton(args, "left1");
    const left2 = collectButton(args, "left2");
    const right1 = collectButton(args, "right1");
    const right2 = collectButton(args, "right2");
    const hasLeft = left1.show || left2.show;
    const hasRight = right1.show || right2.show;
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive">Delete</Button>} />
        <AlertDialogContent
          title={args.title}
          description={args.description || undefined}
          closeIcon={args.closeIcon}
          secondaryActions={
            hasLeft ? (
              <>
                {renderButton(left1, "l1")}
                {renderButton(left2, "l2")}
              </>
            ) : undefined
          }
          primaryActions={
            hasRight ? (
              <>
                {renderButton(right1, "r1")}
                {renderButton(right2, "r2")}
              </>
            ) : undefined
          }
        />
      </AlertDialog>
    );
  },
};

export const WithForm: Story = {
  args: {
    title: "Confirm your identity",
    right1Label: "Cancel",
    right2Label: "Confirm",
  },
  render: (args) => {
    const left1 = collectButton(args, "left1");
    const left2 = collectButton(args, "left2");
    const right1 = collectButton(args, "right1");
    const right2 = collectButton(args, "right2");
    const hasLeft = left1.show || left2.show;
    const hasRight = right1.show || right2.show;
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Verify</Button>} />
        <AlertDialogContent
          title={args.title}
          closeIcon={args.closeIcon}
          secondaryActions={
            hasLeft ? (
              <>
                {renderButton(left1, "l1")}
                {renderButton(left2, "l2")}
              </>
            ) : undefined
          }
          primaryActions={
            hasRight ? (
              <>
                {renderButton(right1, "r1")}
                {renderButton(right2, "r2")}
              </>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-3 [padding-inline:var(--ds-spacing-component-xl)] [padding-block:var(--ds-spacing-component-lg)]">
            <label className="flex flex-col gap-1 [font-size:var(--ds-typography-labelsm-fontsize)] [color:var(--ds-color-content-secondary)]">
              Email address
              <input
                type="email"
                placeholder="you@example.com"
                className="border [border-color:var(--ds-color-border-input)] [border-radius:var(--ds-radius-md)] px-3 py-2 [font-size:var(--ds-typography-bodymd-fontsize)] outline-none focus:[border-color:var(--ds-color-border-focus)]"
              />
            </label>
            <label className="flex flex-col gap-1 [font-size:var(--ds-typography-labelsm-fontsize)] [color:var(--ds-color-content-secondary)]">
              Confirmation code
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="border [border-color:var(--ds-color-border-input)] [border-radius:var(--ds-radius-md)] px-3 py-2 [font-size:var(--ds-typography-bodymd-fontsize)] outline-none focus:[border-color:var(--ds-color-border-focus)]"
              />
            </label>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};

export const NoActions: Story = {
  args: { left1Show: false, right1Show: false, right2Show: false },
};

/**
 * Mirrors the Figma "Examples → Change Variant" composition: an informational
 * Alert plus body copy inside the dialog content, with Cancel / Edit / Save and
 * close actions. The Alert is the real `Alert` component (single source of
 * truth), not bespoke markup.
 */
export const ChangeVariant: Story = {
  args: {
    title: "Change Variant",
    left1Label: "Cancel",
    right1Label: "Edit",
    right2Label: "Save and close",
  },
  render: (args) => {
    const left1 = collectButton(args, "left1");
    const left2 = collectButton(args, "left2");
    const right1 = collectButton(args, "right1");
    const right2 = collectButton(args, "right2");
    const hasLeft = left1.show || left2.show;
    const hasRight = right1.show || right2.show;
    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Change variant</Button>} />
        <AlertDialogContent
          title={args.title}
          closeIcon={args.closeIcon}
          secondaryActions={
            hasLeft ? (
              <>
                {renderButton(left1, "l1")}
                {renderButton(left2, "l2")}
              </>
            ) : undefined
          }
          primaryActions={
            hasRight ? (
              <>
                {renderButton(right1, "r1")}
                {renderButton(right2, "r2")}
              </>
            ) : undefined
          }
        >
          <div className="flex flex-col gap-[var(--ds-spacing-component-lg)] [padding-inline:var(--ds-spacing-component-xl)] [padding-block:var(--ds-spacing-component-lg)]">
            <Alert type="informational" icon={<Info />}>
              <AlertTitle>Information provided by the system</AlertTitle>
              <AlertDescription>
                Information provided by the system might not be sufficient for performing this
                operation.
              </AlertDescription>
            </Alert>
            <p className="[font-size:var(--ds-typography-bodymd-fontsize)] [line-height:var(--ds-typography-bodymd-lineheight)] [color:var(--ds-color-content-primary)]">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et massa mi. Aliquam in
              hendrerit urna. Pellentesque sit amet sapien.
            </p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};

"use client";

import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

type TypographyProps = React.ComponentPropsWithRef<"div"> & {
  variant?:
    | "default"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "p"
    | "blockquote"
    | "table"
    | "ul"
    | "code"
    | "lead"
    | "large"
    | "small"
    | "muted";
};

const typographyConfigs = {
  default: { TagName: "div", classes: "" },
  h1: {
    TagName: "h1",
    classes: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  },
  h2: {
    TagName: "h2",
    classes:
      "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  },
  h3: {
    TagName: "h3",
    classes: "scroll-m-20 text-2xl font-semibold tracking-tight",
  },
  h4: {
    TagName: "h4",
    classes: "scroll-m-20 text-xl font-semibold tracking-tight",
  },
  p: { TagName: "p", classes: "leading-7 [&:not(:first-child)]:mt-6" },
  blockquote: { TagName: "blockquote", classes: "mt-6 border-l-2 pl-6 italic" },
  table: {
    TagName: "table",
    classes:
      "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
  },
  ul: { TagName: "ul", classes: "my-6 ml-6 list-disc [&>li]:mt-2" },
  code: {
    TagName: "code",
    classes:
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  },
  lead: { TagName: "p", classes: "text-xl text-muted-foreground" },
  large: { TagName: "div", classes: "text-lg font-semibold" },
  small: { TagName: "small", classes: "text-sm font-medium leading-none" },
  muted: { TagName: "p", classes: "text-sm text-muted-foreground" },
};

export function Typography({
  variant = "default",
  className,
  children,
  ...props
}: TypographyProps) {
  const config = typographyConfigs[variant];
  const { TagName, classes } = config;

  return (
    // @ts-expect-error
    <TagName {...props} className={cn(classes, className)}>
      {children}
    </TagName>
  );
}

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/ui/components/navigation-menu";
import { cn } from "@repo/ui/lib/utils";
import { NavLink, type NavLinkProps } from "react-router";
import type { ReactNode } from "react";

interface ComponentItem {
  title: string;
  href: string;
  description: string;
}

interface MenuItem {
  title: string;
  href?: string;
  isLink?: boolean;
  content?: ReactNode | ReactNode[];
}

interface NavigationProps {
  menuItems?: MenuItem[];
  components?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: {
    title: string;
    href: string;
    description: string;
  }[];
}

export default function Navigation({
  menuItems = [
    {
      title: "Getting started",
      content: "default",
    },
    {
      title: "Components",
      content: "components",
    },
  ],
  components = [
    {
      title: "Buttons & Badges",
      href: "/gallery#buttons-badges",
      description:
        "Button variants and groups, badges, toggles, toggle groups and kbd.",
    },
    {
      title: "Forms & Inputs",
      href: "/gallery#forms-inputs",
      description:
        "Inputs, select, combobox, checkbox, radio, switch, slider, OTP and calendar.",
    },
    {
      title: "Overlays",
      href: "/gallery#overlays",
      description:
        "Dialog, alert dialog, sheet, drawer, popover, hover card, tooltip and menus.",
    },
    {
      title: "Navigation",
      href: "/gallery#navigation",
      description:
        "Breadcrumb, menubar, navigation menu, pagination, tabs, command and sidebar.",
    },
    {
      title: "Data Display",
      href: "/gallery#data-display",
      description:
        "Table, card, avatar, chart, accordion, carousel, scroll area and resizable.",
    },
    {
      title: "Feedback",
      href: "/gallery#feedback",
      description: "Alert, progress, spinner, skeleton and sonner toasts.",
    },
  ],
  logo = (
    <>
      <img
        src="/logo-light.svg"
        className="h-6 w-auto dark:hidden"
        alt="React Router"
        loading="lazy"
      />
      <img
        src="/logo-dark.svg"
        className="hidden h-6 w-auto dark:block"
        alt="React Router"
        loading="lazy"
      />
    </>
  ),
  logoTitle = "Component gallery",
  logoDescription = "Every @repo/ui primitive on one page, switchable across six themes.",
  logoHref = "/gallery",
  introItems = [
    {
      title: "Projects",
      href: "/projects",
      description:
        "Private CRUD on Supabase, scoped to the signed-in user by row-level security.",
    },
    {
      title: "Component gallery",
      href: "/gallery",
      description:
        "Every @repo/ui primitive rendered live, with a theme switcher.",
    },
    {
      title: "Theme switching",
      href: "/test-theme",
      description:
        "Light, dark and system themes applied through the set-theme action.",
    },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink
                href={item.href ?? ""}
                className={navigationMenuTriggerStyle()}
              >
                {item.title}
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink
                          render={
                            <a
                              className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                              href={logoHref}
                            >
                              {logo}
                              <div className="mt-4 mb-2 text-lg font-medium">
                                {logoTitle}
                              </div>
                              <p className="text-muted-foreground text-sm leading-tight">
                                {logoDescription}
                              </p>
                            </a>
                          }
                        />
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem key={i} href={intro.href} title={intro.title}>
                          {intro.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem
                          key={component.title}
                          title={component.title}
                          href={component.href}
                        >
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  ) : (
                    item.content
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink
        render={
          <a
            data-slot="list-item"
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
              className,
            )}
            {...props}
          >
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </a>
        }
      />
    </li>
  );
}

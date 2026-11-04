import { Menu } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "@repo/ui/components/navbar";
import { Sheet, SheetContent, SheetTrigger } from "@repo/ui/components/sheet";
import { cn } from "@repo/ui/lib/utils";
import Navigation from "~/components/navigation";
import { Form, NavLink } from "react-router";

interface NavbarLink {
  text: string;
  href: string;
}

interface NavbarActionProps {
  text: string;
  href: string;
  variant?: ComponentProps<typeof Button>["variant"];
  icon?: ReactNode;
  iconRight?: ReactNode;
  isButton?: boolean;
  /** Use "post" for actions that change state, so a link cannot trigger them. */
  method?: "get" | "post";
}

interface NavbarProps {
  logo?: ReactNode;
  name?: string;
  homeUrl?: string;
  mobileLinks?: NavbarLink[];
  actions?: NavbarActionProps[];
  showNavigation?: boolean;
  customNavigation?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo = (
    <>
      <img
        src="/logo-light.svg"
        alt="Logo"
        className="hover:bg-accent hover:text-accent-foreground max-h-4 w-auto rounded-md leading-none no-underline transition-colors dark:hidden"
      />
      <img
        src="/logo-dark.svg"
        alt="Logo"
        className="hover:bg-accent hover:text-accent-foreground hidden max-h-4 w-auto rounded-md leading-none no-underline transition-colors dark:block"
      />
    </>
  ),
  name = "Company Name",
  homeUrl = "/",
  mobileLinks = [
    { text: "Component gallery", href: "/gallery" },
    { text: "Projects", href: "/projects" },
    { text: "Theme switching", href: "/test-theme" },
  ],
  actions = [
    { text: "Sign in", href: "/login", isButton: false },
    {
      text: "Get Started",
      href: "/sign-up",
      isButton: true,
      variant: "default",
    },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      {/* <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div> */}
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <NavLink to={homeUrl} className="flex">
              {logo}
            </NavLink>
            {showNavigation && (customNavigation ?? <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.method === "post" ? (
                <Form
                  key={index}
                  method="post"
                  action={action.href}
                  className="contents"
                >
                  <Button
                    type="submit"
                    variant={action.variant ?? "default"}
                    className={action.isButton ? undefined : "hidden md:block"}
                  >
                    {action.icon}
                    {action.text}
                    {action.iconRight}
                  </Button>
                </Form>
              ) : action.isButton ? (
                <Button
                  key={index}
                  variant={action.variant ?? "default"}
                  nativeButton={false}
                  role="link"
                  render={
                    <a href={action.href}>
                      {action.icon}
                      {action.text}
                      {action.iconRight}
                    </a>
                  }
                />
              ) : (
                <a
                  key={index}
                  href={action.href}
                  className="hidden text-sm md:block"
                >
                  {action.text}
                </a>
              ),
            )}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="size-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                }
              />
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <a
                    href={homeUrl}
                    className="flex items-center gap-2 text-xl font-bold"
                  >
                    <span>{name}</span>
                  </a>
                  {mobileLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {link.text}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}

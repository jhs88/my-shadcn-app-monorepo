import "@repo/ui/themes.css";

import { useState } from "react";
import { redirect } from "react-router";
import { toast } from "sonner";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Inbox,
  Search,
  Underline,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/ui/components/accordion";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
import { AspectRatio } from "@repo/ui/components/aspect-ratio";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Button } from "@repo/ui/components/button";
import { ButtonGroup, ButtonGroupText } from "@repo/ui/components/button-group";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/carousel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/chart";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/ui/components/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@repo/ui/components/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/ui/components/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@repo/ui/components/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { DirectionProvider, useDirection } from "@repo/ui/components/direction";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@repo/ui/components/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@repo/ui/components/hover-card";
import { Input } from "@repo/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@repo/ui/components/input-otp";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/item";
import { Kbd, KbdGroup } from "@repo/ui/components/kbd";
import { Label } from "@repo/ui/components/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@repo/ui/components/menubar";
import { NativeSelect, NativeSelectOption } from "@repo/ui/components/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/ui/components/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Progress, ProgressLabel, ProgressValue } from "@repo/ui/components/progress";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@repo/ui/components/resizable";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Slider } from "@repo/ui/components/slider";
import { Spinner } from "@repo/ui/components/spinner";
import { Switch } from "@repo/ui/components/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import { Toggle } from "@repo/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/components/tooltip";

export function loader() {
  if (!import.meta.env.DEV) {
    throw redirect("/");
  }
  return null;
}

const GALLERY_THEMES = [
  "claude",
  "mono",
  "neobrutualism",
  "notebook",
  "supabase",
  "vercel",
] as const;

const SECTIONS = [
  { id: "buttons-badges", label: "Buttons & Badges" },
  { id: "forms-inputs", label: "Forms & Inputs" },
  { id: "overlays", label: "Overlays" },
  { id: "navigation", label: "Navigation" },
  { id: "data-display", label: "Data Display" },
  { id: "feedback", label: "Feedback" },
] as const;

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-testid={`gallery-section-${id}`}
      className="scroll-mt-24 space-y-4 border-b border-border pb-10"
    >
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Demo({
  name,
  children,
  className,
}: {
  name: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-testid={`demo-${name}`}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
    >
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {name}
      </span>
      <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>{children}</div>
    </div>
  );
}

const chartData = [
  { month: "Jan", views: 186 },
  { month: "Feb", views: 305 },
  { month: "Mar", views: 237 },
  { month: "Apr", views: 273 },
  { month: "May", views: 209 },
  { month: "Jun", views: 314 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const comboboxFrameworks = ["Next.js", "Remix", "React Router", "Astro", "Vite"];

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() =>
    typeof document === "undefined"
      ? ""
      : (document.documentElement.dataset.theme ?? "")
  );

  return (
    <NativeSelect
      data-testid="gallery-theme-switcher"
      value={theme}
      onChange={(event) => {
        const next = event.target.value;
        setTheme(next);
        if (next === "") {
          delete document.documentElement.dataset.theme;
        } else {
          document.documentElement.dataset.theme = next;
        }
      }}
    >
      <NativeSelectOption value="">Default theme</NativeSelectOption>
      {GALLERY_THEMES.map((name) => (
        <NativeSelectOption key={name} value={name}>
          {name}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}

function DirectionDemo() {
  const direction = useDirection();
  return (
    <div className="flex w-full flex-col gap-2">
      <Slider defaultValue={[40]} aria-label="RTL slider" />
      <p className="text-xs text-muted-foreground">DirectionProvider direction: {direction}</p>
    </div>
  );
}

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border border-border"
    />
  );
}

export default function GalleryRoute() {
  return (
    <TooltipProvider delay={150}>
      <div data-testid="gallery" className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
            <h1 className="text-base font-semibold">Component Gallery</h1>
            <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <div className="ml-auto">
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
          <Section id="buttons-badges" title="Buttons & Badges">
            <Demo name="button">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </Demo>
            <Demo name="button-group">
              <ButtonGroup>
                <Button variant="outline">Left</Button>
                <Button variant="outline">Middle</Button>
                <Button variant="outline">Right</Button>
              </ButtonGroup>
              <ButtonGroup>
                <ButtonGroupText>Label</ButtonGroupText>
                <Button variant="outline">Action</Button>
              </ButtonGroup>
            </Demo>
            <Demo name="badge">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </Demo>
            <Demo name="toggle">
              <Toggle aria-label="Toggle bold">
                <Bold />
              </Toggle>
              <Toggle variant="outline" aria-label="Toggle italic">
                <Italic />
              </Toggle>
              <Toggle defaultPressed>Pressed</Toggle>
            </Demo>
            <Demo name="toggle-group">
              <ToggleGroup defaultValue={["left"]} aria-label="Text alignment">
                <ToggleGroupItem value="left" aria-label="Align left">
                  <AlignLeft />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">
                  <AlignCenter />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">
                  <AlignRight />
                </ToggleGroupItem>
              </ToggleGroup>
              <ToggleGroup multiple defaultValue={["bold"]} variant="outline">
                <ToggleGroupItem value="bold" aria-label="Bold">
                  <Bold />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic">
                  <Italic />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline">
                  <Underline />
                </ToggleGroupItem>
              </ToggleGroup>
            </Demo>
            <Demo name="kbd">
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
              <span className="text-sm text-muted-foreground">to open search</span>
            </Demo>
          </Section>

          <Section id="forms-inputs" title="Forms & Inputs">
            <Demo name="input">
              <Input placeholder="Text input" className="max-w-56" />
              <Input type="email" placeholder="email@example.com" className="max-w-56" />
              <Input disabled placeholder="Disabled" className="max-w-56" />
            </Demo>
            <Demo name="textarea">
              <Textarea placeholder="Write something..." className="max-w-sm" />
            </Demo>
            <Demo name="label">
              <div className="flex items-center gap-2">
                <Checkbox id="gallery-terms" />
                <Label htmlFor="gallery-terms">Accept terms and conditions</Label>
              </div>
            </Demo>
            <Demo name="checkbox">
              <Checkbox aria-label="Unchecked" />
              <Checkbox defaultChecked aria-label="Checked" />
              <Checkbox disabled aria-label="Disabled" />
            </Demo>
            <Demo name="switch">
              <Switch aria-label="Default switch" />
              <Switch defaultChecked aria-label="Checked switch" />
              <Switch size="sm" defaultChecked aria-label="Small switch" />
            </Demo>
            <Demo name="radio-group">
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="default" id="gallery-r1" />
                  <Label htmlFor="gallery-r1">Default</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="comfortable" id="gallery-r2" />
                  <Label htmlFor="gallery-r2">Comfortable</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="compact" id="gallery-r3" />
                  <Label htmlFor="gallery-r3">Compact</Label>
                </div>
              </RadioGroup>
            </Demo>
            <Demo name="select">
              <Select defaultValue="apple">
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="cherry">Cherry</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Demo>
            <Demo name="native-select">
              <NativeSelect defaultValue="one">
                <NativeSelectOption value="one">Option one</NativeSelectOption>
                <NativeSelectOption value="two">Option two</NativeSelectOption>
                <NativeSelectOption value="three">Option three</NativeSelectOption>
              </NativeSelect>
            </Demo>
            <Demo name="slider" className="w-full">
              <div className="w-full max-w-sm">
                <Slider defaultValue={[33]} max={100} aria-label="Single slider" />
              </div>
              <div className="w-full max-w-sm">
                <Slider defaultValue={[25, 75]} max={100} aria-label="Range slider" />
              </div>
            </Demo>
            <Demo name="input-otp">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Demo>
            <Demo name="input-group" className="w-full">
              <InputGroup className="max-w-sm">
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="xs">Go</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Demo>
            <Demo name="combobox">
              <Combobox items={comboboxFrameworks}>
                <ComboboxInput placeholder="Select a framework" className="w-56" />
                <ComboboxContent>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Demo>
            <Demo name="calendar">
              <CalendarDemo />
            </Demo>
            <Demo name="field" className="w-full">
              <FieldSet className="w-full max-w-sm">
                <FieldLegend>Profile</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="gallery-field-name">Name</FieldLabel>
                    <Input id="gallery-field-name" placeholder="Ada Lovelace" />
                    <FieldDescription>Shown on your public profile.</FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </Demo>
          </Section>

          <Section id="overlays" title="Overlays">
            <Demo name="dialog">
              <Dialog>
                <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <Input placeholder="Display name" />
                  </div>
                  <DialogFooter>
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Demo>
            <Demo name="alert-dialog">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive">Delete account</Button>} />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
                    <AlertDialogAction render={<Button>Continue</Button>} />
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Demo>
            <Demo name="sheet">
              <Sheet>
                <SheetTrigger render={<Button variant="outline">Open Sheet</Button>} />
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Sheet title</SheetTitle>
                    <SheetDescription>A panel that slides in from the edge.</SheetDescription>
                  </SheetHeader>
                  <div className="px-4 text-sm text-muted-foreground">
                    Sheet body content goes here.
                  </div>
                </SheetContent>
              </Sheet>
            </Demo>
            <Demo name="drawer">
              <Drawer>
                <DrawerTrigger render={<Button variant="outline">Open Drawer</Button>} />
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Drawer title</DrawerTitle>
                    <DrawerDescription>A bottom drawer with swipe support.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4 text-sm text-muted-foreground">
                    Drawer body content goes here.
                  </div>
                  <DrawerFooter>
                    <DrawerClose render={<Button variant="outline">Close</Button>} />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Demo>
            <Demo name="popover">
              <Popover>
                <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
                <PopoverContent className="w-64">
                  <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>Set the layer dimensions.</PopoverDescription>
                  </PopoverHeader>
                  <div className="flex flex-col gap-2">
                    <Input placeholder="Width" />
                    <Input placeholder="Height" />
                  </div>
                </PopoverContent>
              </Popover>
            </Demo>
            <Demo name="hover-card">
              <HoverCard>
                <HoverCardTrigger render={<Button variant="link">@shadcn</Button>} />
                <HoverCardContent className="w-64">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">shadcn</span>
                    <span className="text-sm text-muted-foreground">
                      The creator of shadcn/ui.
                    </span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Demo>
            <Demo name="tooltip">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
                <TooltipContent>Tooltip content</TooltipContent>
              </Tooltip>
            </Demo>
            <Demo name="context-menu">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    Copy <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    Paste <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Demo>
            <Demo name="dropdown-menu">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Profile <DropdownMenuShortcut>Shift+P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings <DropdownMenuShortcut>Ctrl+S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Demo>
          </Section>

          <Section id="navigation" title="Navigation">
            <Demo name="breadcrumb">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Demo>
            <Demo name="menubar">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New Tab <MenubarShortcut>Ctrl+T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>New Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>Print</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </Demo>
            <Demo name="navigation-menu">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-56 gap-1 p-1">
                        <li>
                          <NavigationMenuLink href="#">Accordion</NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink href="#">Dialog</NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink href="#">Popover</NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
                      Documentation
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Demo>
            <Demo name="pagination">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Demo>
            <Demo name="tabs" className="w-full">
              <Tabs defaultValue="account" className="w-full max-w-sm">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="rounded-md border border-border p-3 text-sm">
                  Account settings panel.
                </TabsContent>
                <TabsContent value="password" className="rounded-md border border-border p-3 text-sm">
                  Password settings panel.
                </TabsContent>
              </Tabs>
            </Demo>
            <Demo name="command" className="w-full">
              <Command className="w-full max-w-sm rounded-lg border border-border">
                <CommandInput placeholder="Type a command..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      Calendar <CommandShortcut>Ctrl+C</CommandShortcut>
                    </CommandItem>
                    <CommandItem>Search</CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>Profile</CommandItem>
                    <CommandItem>Billing</CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </Demo>
            <Demo name="sidebar" className="w-full">
              <div className="h-56 w-full overflow-hidden rounded-lg border border-border">
                <SidebarProvider className="h-full min-h-0 w-full" defaultOpen>
                  <Sidebar collapsible="none" className="h-full">
                    <SidebarContent>
                      <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton>Dashboard</SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton>Projects</SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton>Settings</SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    </SidebarContent>
                  </Sidebar>
                  <div className="flex flex-1 items-center justify-center bg-muted/40 p-4 text-sm text-muted-foreground">
                    Main content
                  </div>
                </SidebarProvider>
              </div>
            </Demo>
            <Demo name="direction" className="w-full">
              <DirectionProvider direction="rtl">
                <DirectionDemo />
              </DirectionProvider>
            </Demo>
          </Section>

          <Section id="data-display" title="Data Display">
            <Demo name="accordion" className="w-full">
              <Accordion defaultValue={["item-1"]} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. It follows the WAI-ARIA design pattern.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>Yes. It uses theme tokens.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </Demo>
            <Demo name="avatar">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>JD</AvatarFallback>
                <AvatarBadge />
              </Avatar>
              <Avatar size="sm">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </Demo>
            <Demo name="card" className="w-full">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                  <CardDescription>Card description text.</CardDescription>
                  <CardAction>
                    <Button size="sm" variant="outline">
                      Action
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card content goes here.</p>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-muted-foreground">Card footer</span>
                </CardFooter>
              </Card>
            </Demo>
            <Demo name="carousel" className="w-full">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {[1, 2, 3].map((n) => (
                    <CarouselItem key={n}>
                      <div className="flex aspect-square items-center justify-center rounded-md border border-border bg-muted text-2xl font-semibold">
                        {n}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Demo>
            <Demo name="chart" className="w-full">
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-views)" radius={4} />
                </BarChart>
              </ChartContainer>
            </Demo>
            <Demo name="table" className="w-full">
              <Table>
                <TableCaption>A list of recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV-001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV-002</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Demo>
            <Demo name="item" className="w-full">
              <ItemGroup className="w-full max-w-sm">
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <Inbox />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Inbox</ItemTitle>
                    <ItemDescription>3 unread messages</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>Muted item</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </Demo>
            <Demo name="empty" className="w-full">
              <Empty className="border border-dashed border-border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Inbox />
                  </EmptyMedia>
                  <EmptyTitle>No messages</EmptyTitle>
                  <EmptyDescription>You are all caught up.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm" variant="outline">
                    Refresh
                  </Button>
                </EmptyContent>
              </Empty>
            </Demo>
            <Demo name="aspect-ratio" className="w-full">
              <div className="w-full max-w-sm">
                <AspectRatio ratio={16 / 9} className="rounded-lg bg-muted" />
              </div>
            </Demo>
            <Demo name="scroll-area" className="w-full">
              <ScrollArea className="h-32 w-full max-w-sm rounded-md border border-border">
                <div className="flex flex-col gap-2 p-4 text-sm">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i}>Scrollable row {i + 1}</span>
                  ))}
                </div>
              </ScrollArea>
            </Demo>
            <Demo name="resizable" className="w-full">
              <ResizablePanelGroup
                orientation="horizontal"
                className="min-h-28 w-full max-w-md rounded-lg border border-border"
              >
                <ResizablePanel defaultSize="50">
                  <div className="flex h-full items-center justify-center text-sm">One</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50">
                  <div className="flex h-full items-center justify-center text-sm">Two</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Demo>
            <Demo name="separator" className="w-full">
              <div className="w-full max-w-sm">
                <div className="text-sm">Above</div>
                <Separator className="my-3" />
                <div className="flex h-5 items-center gap-3 text-sm">
                  <span>Left</span>
                  <Separator orientation="vertical" />
                  <span>Right</span>
                </div>
              </div>
            </Demo>
            <Demo name="collapsible" className="w-full">
              <Collapsible className="w-full max-w-sm">
                <CollapsibleTrigger render={<Button variant="outline">Toggle repositories</Button>} />
                <div className="mt-2 rounded-md border border-border px-3 py-2 text-sm">
                  Always visible
                </div>
                <CollapsibleContent className="mt-2 flex flex-col gap-2">
                  <div className="rounded-md border border-border px-3 py-2 text-sm">
                    Hidden repo one
                  </div>
                  <div className="rounded-md border border-border px-3 py-2 text-sm">
                    Hidden repo two
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Demo>
          </Section>

          <Section id="feedback" title="Feedback">
            <Demo name="alert" className="w-full">
              <div className="flex w-full flex-col gap-3">
                <Alert>
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>You can add components with the CLI.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Something went wrong.</AlertDescription>
                </Alert>
              </div>
            </Demo>
            <Demo name="progress" className="w-full">
              <Progress value={66} className="w-full max-w-sm">
                <ProgressLabel>Uploading</ProgressLabel>
                <ProgressValue />
              </Progress>
            </Demo>
            <Demo name="spinner">
              <Spinner />
              <Spinner className="size-6" />
              <Button disabled>
                <Spinner /> Loading
              </Button>
            </Demo>
            <Demo name="skeleton" className="w-full">
              <div className="flex w-full max-w-sm items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Demo>
            <Demo name="sonner">
              <Button
                variant="outline"
                onClick={() => toast.success("Gallery toast fired")}
              >
                Fire toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error("Something failed")}
              >
                Fire error toast
              </Button>
            </Demo>
          </Section>
        </main>
      </div>
    </TooltipProvider>
  );
}

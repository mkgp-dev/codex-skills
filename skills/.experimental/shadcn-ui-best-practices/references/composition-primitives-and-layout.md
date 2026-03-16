# Composition, Primitives, and Layout

Use this reference when the user is building or reviewing interfaces and needs guidance on choosing the right shadcn building blocks.

## Core Principle

Prefer composing existing primitives over recreating them with custom markup and utility piles. shadcn/ui is most maintainable when the code still looks like clear React composition, not like a custom design system fork in every file.

## Composition Defaults

- Use `Alert`, `Badge`, `Card`, `Empty`, `Separator`, `Skeleton`, and `sonner` instead of recreating common UI with raw elements.
- Use complete structures for composed components:
  - `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `DialogHeader`, `DialogTitle`, `DialogDescription`
  - `SheetHeader`, `SheetTitle`, `SheetDescription`
- Keep grouped item components inside their required grouping parents:
  - `SelectItem` inside `SelectGroup`
  - `DropdownMenuItem` inside `DropdownMenuGroup`
  - `CommandItem` inside `CommandGroup`
- Keep `TabsTrigger` inside `TabsList`.
- Always include `AvatarFallback`.

## Overlay Selection

- Use `Dialog` for focused tasks that require attention or input.
- Use `AlertDialog` for destructive confirmation.
- Use `Sheet` for side-panel detail, settings, or filters.
- Use `Drawer` for mobile-first bottom-sheet flows.
- Use `Popover` or `HoverCard` for lighter contextual UI.

Every `Dialog`, `Sheet`, or `Drawer` needs a title for accessibility, even if the title is visually hidden.

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Filter Orders</SheetTitle>
      <SheetDescription>
        Narrow the current order list without leaving the page.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Base vs Radix Differences

- Radix trigger composition commonly uses `asChild`.
- Base trigger composition commonly uses `render`.
- Some components also differ in root props:
  - `ToggleGroup` uses `type` in radix but `multiple` and array defaults in base.
  - `Select` has base-specific `items` and object-value patterns that radix does not share.

Do not write one example that silently assumes both APIs are identical.

## Layout Rules

- Use `gap-*` for spacing instead of `space-*`.
- Use `size-*` when width and height are equal.
- Keep `className` focused on layout and placement before reaching for appearance overrides.
- Avoid manual `z-index` adjustments on overlay primitives.

## Good Review Questions

- Is this custom markup replacing a first-party primitive?
- Is the trigger API correct for the project's base library?
- Does the component hierarchy preserve titles, groups, fallbacks, and content wrappers?
- Are layout classes clear and limited, or is the component being restyled from scratch?

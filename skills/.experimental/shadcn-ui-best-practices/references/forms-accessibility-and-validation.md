# Forms, Accessibility, and Validation

Use this reference for form authoring, controlled inputs, invalid states, and accessibility-focused reviews.

## Form Structure

- Prefer `FieldGroup` to stack related fields.
- Prefer `Field` as the main control wrapper.
- Prefer `FieldSet` and `FieldLegend` for grouped checkbox, radio, or switch sections.
- Prefer `FieldDescription` and `FieldError` instead of ad hoc helper text markup.
- Use `Field orientation="horizontal"` or responsive field layouts intentionally for settings pages and denser control panels.

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" autoComplete="email" />
    <FieldDescription>We only use this for account updates.</FieldDescription>
  </Field>
</FieldGroup>
```

## Invalid and Disabled States

- Put `data-invalid` on the `Field`.
- Put `aria-invalid` on the actual control.
- Put `data-disabled` on the `Field` and `disabled` on the control when disabled styles should cascade cleanly.

```tsx
<Field data-invalid={fieldState.invalid}>
  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
</Field>
```

## Input Choice Rules

- `Input` for plain text entry
- `Textarea` for multi-line entry
- `Select` for fixed option lists
- `Combobox` for searchable option lists
- `Switch` for settings-style boolean preferences
- `Checkbox` for form-style boolean or multi-select choices
- `ToggleGroup` for small mutually exclusive or multi-select visual option sets
- `InputOTP` for verification flows

## Input Group Rules

- Use `InputGroupInput` or `InputGroupTextarea` inside `InputGroup`.
- Use `InputGroupAddon` for buttons or affixes.
- Do not fake grouped inputs with absolute-positioned buttons inside regular `Input`.

## Form Library Integration

- With React Hook Form or TanStack Form, keep the field wrapper and accessibility attributes in the render layer.
- Keep schema validation separate from field markup; the UI should expose field state, not own validation logic.
- Do not remove labels just because placeholders exist. If the design requires a hidden label, use `sr-only`, not no label.

## Accessibility Checklist

- Every control has a visible or screen-reader-accessible label.
- Invalid controls expose `aria-invalid`.
- Dialog-hosted forms still include proper titles and descriptions.
- Helper text and errors are structurally tied to the field rather than floating elsewhere in the layout.

# Resolver Setup and Typing

Use this reference when the question is how to structure `useForm`, choose a validation strategy, or type the form values safely.

## Baseline RHF Pattern

For simple forms, start with RHF alone.

```ts
import { useForm } from "react-hook-form";

type LoginValues = {
  email: string;
  password: string;
};

const form = useForm<LoginValues>({
  defaultValues: {
    email: "",
    password: "",
  },
  mode: "onSubmit",
});
```

This is enough when validation is lightweight and local to the form.

## When to Add a Resolver

Bring in Zod when one or more of these are true:

- validation rules should live in a reusable schema
- the same validation should run on client and server
- parsed output types matter
- the existing form already uses Zod and needs modernization

```ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8, { error: "Password must be at least 8 characters." }),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: {
    email: "",
    password: "",
  },
});
```

## Typing Rules

- Use plain RHF interfaces or type aliases when there is no schema.
- Use `z.infer<typeof schema>` when the accepted input shape and parsed output shape are effectively the same.
- Use `z.input<typeof schema>` when the browser sends a looser shape than the parsed result.
- Use `z.output<typeof schema>` when transforms or coercion materially change the final parsed data.

```ts
const schema = z.object({
  amount: z.coerce.number().int().positive(),
});

type RawValues = z.input<typeof schema>;
type ParsedValues = z.output<typeof schema>;
```

If the user needs both types, say so explicitly instead of pretending one alias covers both.

## `defaultValues` Guidance

- Provide `defaultValues` in `useForm(...)` when RHF tracks dirtiness, reset behavior, or controlled fields.
- Avoid `undefined` for controlled values; use `""`, `null`, `[]`, or another explicit empty state that matches the widget.
- If a field is managed through `Controller`, either provide form-level `defaultValues` or field-level `defaultValue`, but keep one clear source of truth.

## Validation Mode

Validation mode is an RHF choice. Explain it as a UX and performance tradeoff:

- `onSubmit`: least chatter, best default for heavy forms
- `onBlur`: balanced feedback
- `onChange`: live feedback, higher validation cost
- `all`: most reactive, highest churn

Keep the strategy simple unless the UX demands more.

## Common Review Notes

- Prefer plain RHF when a schema adds little value.
- Prefer `zodResolver(schema)` over ad hoc submit-time parsing when the form is already schema-backed.
- Do not duplicate the same required/min/max rules in both `register(...)` and Zod unless the duplication is intentional for UI-specific behavior.
- If the user shows stale Zod string-format methods, modernize the schema while preserving the RHF wiring.

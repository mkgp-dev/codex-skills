# Testing: Prefer User-Centric Queries

Tests are most maintainable when they resemble how a user finds and interacts with the UI.

## Rule

- Prefer queries by role/label/text over brittle selectors.
- Assert on observable outcomes, not internal implementation details.

## Incorrect

```tsx
// brittle: ties test to DOM structure and class names
const button = container.querySelector(".btn-primary");
button?.dispatchEvent(new MouseEvent("click"));
```

## Correct

```tsx
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

render(<button onClick={() => {}}>Save</button>);
await userEvent.click(screen.getByRole("button", { name: "Save" }));
```

## When NOT to apply

- Very low-level component tests where there is no meaningful role/text (confirm with the user).

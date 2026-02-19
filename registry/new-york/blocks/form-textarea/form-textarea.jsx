"use client";

import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function FormTextarea({ ...props }) {
  const {
    label,
    htmlFor,
    topRightItem,
    icon,
    iconRight,
    maxLength,
    onKeyDown,
    onWheel,
    onInput,
    error,
    className,
    rows = 4,
    ...rest
  } = props;

  const isNumber = rest.type === "number";

  const handleKeyDown = (event) => {
    if (isNumber && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
    }
    onKeyDown?.(event);
  };

  const handleWheel = (event) => {
    if (isNumber) {
      event.currentTarget.blur();
    }
    onWheel?.(event);
  };

  const handleInput = (event) => {
    if (maxLength) {
      const value = event.currentTarget.value;
      if (value.length > maxLength) {
        event.currentTarget.value = value.slice(0, maxLength);
      }
    }
    onInput?.(event);
  };

  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-center justify-between">
        {label && <Label htmlFor={htmlFor}>{label}</Label>}
        {topRightItem && topRightItem}
      </div>

      <div className="flex items-start flex-col">
        <InputGroup>
          {icon && (
            <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>
          )}

          <Textarea
            {...rest}
            rows={rows}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            onInput={handleInput}
            aria-invalid={!!error}
            className="resize-none"
          />

          {iconRight && (
            <InputGroupAddon align="inline-end">
              <div className="flex items-center gap-1">{iconRight}</div>
            </InputGroupAddon>
          )}
        </InputGroup>

        <div className="min-h-6 text-destructive text-xs flex items-center">
          {error?.message ?? (typeof error === "string" ? error : null)}
        </div>
      </div>
    </div>
  );
}

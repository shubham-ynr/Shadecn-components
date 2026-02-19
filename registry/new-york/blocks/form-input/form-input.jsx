"use client";
import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FormInput({ ...props }) {
  const {
    type,
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
  } = props;
  const isPassword = type === "password";
  const isNumber = type === "number";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isPassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

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
    if (maxLength && isNumber) {
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
          <InputGroupInput
            {...props}
            type={inputType}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            onInput={handleInput}
            aria-invalid={!!error}
          />
          {(iconRight || isPassword) && (
            <InputGroupAddon align="inline-end">
              <div className="flex items-center gap-1">
                {iconRight ? (
                  iconRight
                ) : (
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    aria-label={
                      isPasswordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                )}
              </div>
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

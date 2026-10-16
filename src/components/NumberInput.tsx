import { useEffect, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from "react";

export function normalizeNumericInput(text: string, fallback: number, min?: number | string, max?: number | string, step?: number | string) {
  let value = text.trim() ? Number(text) : fallback;
  if (!Number.isFinite(value)) value = fallback;
  const lower = min === undefined || min === "" ? -Infinity : Number(min);
  const upper = max === undefined || max === "" ? Infinity : Number(max);
  value = Math.max(lower, Math.min(upper, value));
  const increment = Number(step);
  if (Number.isFinite(increment) && increment > 0) {
    const base = Number.isFinite(lower) ? lower : 0;
    value = base + Math.round((value - base) / increment) * increment;
    value = Math.max(lower, Math.min(upper, value));
  }
  return Number(value.toPrecision(14));
}

/** Keep an incomplete edit local; only valid numbers reach the physical model. */
export function NumberInput({ value, onChange, onFocus, onBlur, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [draft, setDraft] = useState(String(value ?? ""));
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(String(value ?? "")); }, [value]);
  return <input {...props} type="number" value={draft} onFocus={event => { editing.current = true; onFocus?.(event); }} onChange={event => {
    setDraft(event.target.value);
    if (event.target.value.trim() && Number.isFinite(event.target.valueAsNumber) && event.target.validity.valid) onChange?.(event);
  }} onBlur={event => {
    editing.current = false;
    const fallback = Number(value);
    const normalized = normalizeNumericInput(event.target.value, Number.isFinite(fallback) ? fallback : 0, props.min, props.max, props.step);
    setDraft(String(normalized));
    if (normalized !== fallback) {
      event.currentTarget.value = String(normalized);
      onChange?.({ ...event, type: "change", target: event.currentTarget, currentTarget: event.currentTarget } as unknown as ChangeEvent<HTMLInputElement>);
    }
    onBlur?.(event);
  }} />;
}

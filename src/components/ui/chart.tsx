"use client";

import * as React from "react";
import { type LegendProps } from "recharts";
import { Legend, ResponsiveContainer, Tooltip, TooltipProps } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

interface ChartRootProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

function ChartRoot({ config, className, children, ...props }: ChartRootProps) {
  return (
    <div
      className={cn("h-full w-full", className)}
      style={
        {
          "--color-primary": "hsl(var(--primary))",
          "--color-secondary": "hsl(var(--secondary))",
          "--color-muted": "hsl(var(--muted))",
          "--color-accent": "hsl(var(--accent))",
          "--color-background": "hsl(var(--background))",
          ...Object.entries(config).reduce<Record<string, string>>(
            (vars, [key, value]) => {
              vars[`--color-${key}`] = value.color;
              return vars;
            },
            {}
          ),
        } as React.CSSProperties
      }
      {...props}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartRootProps>(
  ({ ...props }, ref) => (
    <div ref={ref} className="h-[300px] w-full">
      <ChartRoot {...props} />
    </div>
  )
);
ChartContainer.displayName = "ChartContainer";

interface ChartLegendProps extends LegendProps {
  className?: string;
}

function ChartLegend({ className, ...props }: ChartLegendProps) {
  return <Legend className={cn("", className)} {...props} />;
}

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: Array<{
    value: string;
    color: string;
    payload: {
      fill: string;
      dataKey: string;
    };
  }>;
}

function ChartLegendContent({
  className,
  payload,
  ...props
}: ChartLegendContentProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-4 text-sm", className)}
      {...props}
    >
      {payload?.map((entry, index) => {
        const { value, color } = entry;
        return (
          <div key={`item-${index}`} className="flex items-center gap-1">
            <div
              className="size-3 rounded-sm"
              style={{
                backgroundColor: color,
              }}
            />
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );
}

interface ChartTooltipProps extends Omit<TooltipProps<any, any>, "content"> {
  className?: string;
  content?: React.ReactNode;
}

function ChartTooltip({ className, content, ...props }: ChartTooltipProps) {
  return (
    <Tooltip
      content={content}
      cursor={false}
      className={cn("", className)}
      {...props}
    />
  );
}

interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: string | number;
    color: string;
    dataKey: string;
    payload: Record<string, any>;
  }>;
  label?: string;
  hideLabel?: boolean;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  className,
  ...props
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn("rounded-lg border bg-background p-2 shadow-sm", className)}
      {...props}
    >
      {!hideLabel && label ? (
        <div className="mb-1 text-xs font-medium">{label}</div>
      ) : null}
      <div className="flex flex-col gap-0.5">
        {payload.map((item, index) => {
          return (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1 text-xs">
                <div
                  className="size-2 rounded-sm"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-xs font-medium tabular-nums">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
};

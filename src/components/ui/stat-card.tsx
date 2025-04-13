// version1
// author Yxff
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive"
}

export function StatCard({ title, value, description, icon: Icon, trend, color = "default" }: StatCardProps) {
  const getColorClass = () => {
    switch (color) {
      case "primary":
        return "border-l-4 border-l-primary"
      case "secondary":
        return "border-l-4 border-l-secondary"
      case "success":
        return "border-l-4 border-l-success"
      case "warning":
        return "border-l-4 border-l-warning"
      case "destructive":
        return "border-l-4 border-l-destructive"
      default:
        return ""
    }
  }

  const getTrendClass = () => {
    if (!trend) return ""
    return trend.value > 0
      ? "text-success text-xs font-medium"
      : trend.value < 0
        ? "text-destructive text-xs font-medium"
        : "text-secondary text-xs font-medium"
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return "↑"
    if (trend.value < 0) return "↓"
    return "→"
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md dark:bg-card/90 ${getColorClass()}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-card-foreground">{title}</h3>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center mt-2 ${getTrendClass()}`}>
            <span>
              {getTrendIcon()} {Math.abs(trend.value)}%
            </span>
            <span className="ml-1 text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


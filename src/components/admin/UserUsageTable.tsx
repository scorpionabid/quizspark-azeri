import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Save } from "lucide-react";
import { AIUserUsage } from "@/types/ai-config";

interface UserUsageTableProps {
  usage: AIUserUsage[];
  userLimit: number;
  isLoading?: boolean;
  onUpdateLimit?: (userId: string, limit: number | null) => Promise<void>;
}

export function UserUsageTable({ usage, userLimit, isLoading, onUpdateLimit }: UserUsageTableProps) {
  const [editingLimit, setEditingLimit] = useState<Record<string, string>>({});

  const getStatusBadge = (requests: number, currentLimit: number) => {
    const percentage = (requests / currentLimit) * 100;
    if (percentage >= 100) {
      return <Badge variant="destructive">Limit aşılıb</Badge>;
    }
    if (percentage >= 80) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Yüksək</Badge>;
    }
    return <Badge variant="secondary">Normal</Badge>;
  };

  const handleLimitChange = (userId: string, value: string) => {
    setEditingLimit(prev => ({ ...prev, [userId]: value }));
  };

  const handleSaveLimit = async (userId: string) => {
    if (!onUpdateLimit) return;
    const value = editingLimit[userId];
    const limit = value === "" ? null : parseInt(value);
    await onUpdateLimit(userId, limit);
    setEditingLimit(prev => {
      const { [userId]: _, ...rest } = prev;
      return rest;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            İstifadəçi Limitləri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          İstifadəçi Limitləri (Bugün)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {usage.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Bugün istifadə qeydə alınmayıb
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İstifadəçi</TableHead>
                  <TableHead className="text-right">Sorğular</TableHead>
                  <TableHead className="text-right">Tokenlər</TableHead>
                  <TableHead className="text-right">Fərdi Limit</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usage.map((item) => {
                  const effectiveLimit = item.ai_daily_limit ?? userLimit;
                  const isEditing = editingLimit[item.user_id] !== undefined;
                  const displayLimitValue = editingLimit[item.user_id] ?? (item.ai_daily_limit?.toString() || "");

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.full_name || "Naməlum"}</span>
                          <span className="text-xs text-muted-foreground">{item.email || item.user_id.slice(0, 8)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.total_requests} / {effectiveLimit}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.total_tokens.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Input
                            type="number"
                            className="w-20 h-8 text-right"
                            placeholder={userLimit.toString()}
                            value={displayLimitValue}
                            onChange={(e) => handleLimitChange(item.user_id, e.target.value)}
                          />
                          {isEditing && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleSaveLimit(item.user_id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(item.total_requests, effectiveLimit)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

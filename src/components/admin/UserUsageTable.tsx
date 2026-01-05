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
import { Users } from "lucide-react";
import { AIUserUsage } from "@/types/ai-config";

interface UserUsageTableProps {
  usage: AIUserUsage[];
  userLimit: number;
  isLoading?: boolean;
}

export function UserUsageTable({ usage, userLimit, isLoading }: UserUsageTableProps) {
  const getStatusBadge = (requests: number) => {
    const percentage = (requests / userLimit) * 100;
    if (percentage >= 100) {
      return <Badge variant="destructive">Limit aşılıb</Badge>;
    }
    if (percentage >= 80) {
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Yüksək</Badge>;
    }
    return <Badge variant="secondary">Normal</Badge>;
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>İstifadəçi ID</TableHead>
                <TableHead className="text-right">Sorğular</TableHead>
                <TableHead className="text-right">Tokenlər</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usage.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">
                    {item.user_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-right">
                    {item.total_requests} / {userLimit}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.total_tokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(item.total_requests)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

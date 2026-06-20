'use client';

import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Member } from '../lib/calculations';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { UserPlus, Trash2, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function MemberList() {
  const { members, addMember, removeMember, updateMember } = useStore();
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('1.0');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: Member = {
      id: crypto.randomUUID(),
      name: name.trim(),
      weight: parseFloat(weight) || 1.0,
    };

    addMember(newMember);
    setName('');
    setWeight('1.0');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          メンバー管理
        </CardTitle>
        <CardDescription>
          参加メンバーと傾斜（負担割合）を設定します。通常の人は1.0、多く払う人は2.0などを指定してください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAdd} className="flex items-end gap-4 bg-muted/30 p-4 rounded-lg">
          <div className="space-y-2 flex-1">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              placeholder="例: 山田太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2 w-32">
            <Label htmlFor="weight">傾斜</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="bg-background"
            />
          </div>
          <Button type="submit" disabled={!name.trim()}>
            <UserPlus className="w-4 h-4 mr-2" />
            追加
          </Button>
        </form>

        {members.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>名前</TableHead>
                  <TableHead className="w-32">傾斜</TableHead>
                  <TableHead className="w-24 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={member.weight}
                        onChange={(e) =>
                          updateMember({ ...member, weight: parseFloat(e.target.value) || 1.0 })
                        }
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(member.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            メンバーが登録されていません
          </div>
        )}
      </CardContent>
    </Card>
  );
}

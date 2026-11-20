"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, UserCog } from "lucide-react";

import RecordDetails from "@/components/dashboard/RecordDetails";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  changeUserRole,
  deleteAdminUser,
  getAdminUsers,
} from "@/lib/api/ownerAction";
import { formatDate, getInitials } from "@/lib/format";
import type { AdminUser, UserRole } from "@/lib/types";

const roles: UserRole[] = ["customer", "owner", "admin"];
const roleTone = {
  customer: "info",
  owner: "success",
  admin: "warning",
} as const;

export default function UsersTable() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (user: AdminUser, role: UserRole) => {
    try {
      const updated = await changeUserRole(user.id, role);
      setUsers((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setSelected((current) => (current?.id === updated.id ? updated : current));
      toast.success(`${user.name} is now ${role}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not change role.",
      );
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await deleteAdminUser(selected.id);
      setUsers((current) => current.filter((item) => item.id !== selected.id));
      toast.success("User deleted");
      setSelected(null);
      setConfirming(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete user.",
      );
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading users…</p>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/40 hover:bg-secondary/40">
              <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Email</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Role</TableHead>
              <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Registered</TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-secondary/30">
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      {getInitials(user.name)}
                    </span>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <select
                    aria-label={`Role for ${user.name}`}
                    value={user.role}
                    onChange={(event) =>
                      handleRoleChange(user, event.target.value as UserRole)
                    }
                    className="h-8 rounded-lg border border-border bg-background px-2 text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                  {user.createdAt ? formatDate(user.createdAt) : "—"}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger aria-label={`Actions for ${user.name}`}>
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <RecordDetails record={user} title={user.name} asMenu />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelected(user);
                          setConfirming(false);
                        }}
                      >
                        <UserCog />
                        Manage
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage user</DialogTitle>
            <DialogDescription>
              Review the account and change its access level.
            </DialogDescription>
          </DialogHeader>

          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {getInitials(selected.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{selected.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {selected.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm">
                <span className="text-muted-foreground">Current role</span>
                <StatusBadge
                  label={selected.role}
                  tone={roleTone[selected.role]}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Change role
                </p>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <Button
                      key={role}
                      size="sm"
                      variant={selected.role === role ? "brand" : "outline"}
                      onClick={() => handleRoleChange(selected, role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/70 pt-4">
                {confirming ? (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive">
                      Delete this user and their auth records? This cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleDelete}>
                        Confirm delete
                      </Button>
                      <Button variant="outline" onClick={() => setConfirming(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => setConfirming(true)}
                  >
                    <Trash2 />
                    Delete user
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

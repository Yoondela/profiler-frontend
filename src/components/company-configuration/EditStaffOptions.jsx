import { useEffect, useMemo, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditStaffOptions({
  user,
  disabled = false,
  onRemove,
  onUpdateRole,
}) {
  const userName = user?.name || 'this user';
  const roleRadioName = `staff-role-${user?.portfolioId || user?.id || 'user'}`;

  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [removeOpen, setRemoveOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);

  const [removePassword, setRemovePassword] = useState('');
  const [removeConfirmed, setRemoveConfirmed] = useState(false);
  const [removeSubmitting, setRemoveSubmitting] = useState(false);

  const [rolePassword, setRolePassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  const canRemoveSubmit = useMemo(() => {
    return !!removePassword.trim() && removeConfirmed && !removeSubmitting;
  }, [removePassword, removeConfirmed, removeSubmitting]);

  const canRoleSubmit = useMemo(() => {
    return !!rolePassword.trim() && !!selectedRole && !roleSubmitting;
  }, [rolePassword, selectedRole, roleSubmitting]);

  const resetRemoveForm = () => {
    setRemovePassword('');
    setRemoveConfirmed(false);
    setRemoveSubmitting(false);
  };

  const resetRoleForm = () => {
    setRolePassword('');
    setSelectedRole(user?.role || '');
    setRoleSubmitting(false);
  };

  const handleRemoveSubmit = async (e) => {
    e.preventDefault();
    if (!canRemoveSubmit) return;

    setRemoveSubmitting(true);
    try {
      if (typeof onRemove === 'function') {
        await onRemove({ user, password: removePassword.trim() });
      } else {
        console.warn(
          'EditStaffOptions: `onRemove` not provided; remove action skipped.'
        );
      }
      setRemoveOpen(false);
      resetRemoveForm();
    } catch (err) {
      console.error('Failed to remove staff member', err);
    } finally {
      setRemoveSubmitting(false);
    }
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    if (!canRoleSubmit) return;

    setRoleSubmitting(true);
    try {
      if (typeof onUpdateRole === 'function') {
        await onUpdateRole({
          user,
          password: rolePassword.trim(),
          role: selectedRole,
        });
      } else {
        console.warn(
          'EditStaffOptions: `onUpdateRole` not provided; role update skipped.'
        );
      }
      setEditRoleOpen(false);
      resetRoleForm();
    } catch (err) {
      console.error('Failed to update staff role', err);
    } finally {
      setRoleSubmitting(false);
    }
  };

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div
        ref={menuRef}
        className="relative inline-flex cursor-pointer!"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="h-7 w-7 rounded-full"
          disabled={disabled}
          aria-label="Staff options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MoreVertical className="h-5 w-5" />
        </Button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-md border border-gray-200 bg-white shadow-md"
          >
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:opacity-50"
              disabled={disabled}
              onClick={() => {
                setMenuOpen(false);
                setEditRoleOpen(true);
              }}
            >
              Edit role
            </button>
            <div className="h-px bg-gray-200" />
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              disabled={disabled}
              onClick={() => {
                setMenuOpen(false);
                setRemoveOpen(true);
              }}
            >
              Remove from staff
            </button>
          </div>
        )}
      </div>

      <AlertDialog
        open={removeOpen}
        onOpenChange={(nextOpen) => {
          setRemoveOpen(nextOpen);
          if (!nextOpen) resetRemoveForm();
        }}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove staff member</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your password to confirm removing {userName} from your
              company staff.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form className="space-y-4" onSubmit={handleRemoveSubmit}>
            <div className="space-y-2">
              <Label htmlFor="remove-staff-password">Password</Label>
              <Input
                id="remove-staff-password"
                type="password"
                autoComplete="current-password"
                value={removePassword}
                onChange={(e) => setRemovePassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remove-staff-confirm"
                checked={removeConfirmed}
                onCheckedChange={(checked) => setRemoveConfirmed(!!checked)}
              />
              <Label htmlFor="remove-staff-confirm" className="text-sm">
                Remove {userName} from company staff
              </Label>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                variant="destructive"
                disabled={!canRemoveSubmit}
              >
                {removeSubmitting ? 'Removing…' : 'Remove'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={editRoleOpen}
        onOpenChange={(nextOpen) => {
          setEditRoleOpen(nextOpen);
          if (!nextOpen) resetRoleForm();
        }}
      >
        <DialogContent className="bg-white sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit staff role</DialogTitle>
            <DialogDescription>
              Set {userName}&apos;s role. Confirm with your password.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleRoleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="edit-role-password">Password</Label>
              <Input
                id="edit-role-password"
                type="password"
                autoComplete="current-password"
                value={rolePassword}
                onChange={(e) => setRolePassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'member', label: 'Member' },
                ].map((option) => {
                  const checked = selectedRole === option.value;
                  return (
                    <label
                      key={option.value}
                      className={[
                        'flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                        checked
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white hover:bg-gray-50',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name={roleRadioName}
                        value={option.value}
                        checked={checked}
                        onChange={() => setSelectedRole(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!canRoleSubmit}>
                {roleSubmitting ? 'Saving…' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

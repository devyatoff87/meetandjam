"use client";

import { useMe } from "@/features/auth/hooks/use-me";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MePage() {
  const query = useMe();
  const logout = useLogout();

  if (query.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive">Failed to load profile</p>
      </div>
    );
  }

  const user = query.data;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <Button onClick={logout} variant="outline">
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

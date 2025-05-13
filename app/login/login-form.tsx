'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { POST_METHOD } from '@/lib/req';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await POST_METHOD('/api/login', { username, password });

    if (redirect) {
      router.push(redirect);
      return;
    } else {
      router.push('/man'); // hoặc redirect theo logic app của bạn
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Username or Email</Label>
                <Input id="email" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

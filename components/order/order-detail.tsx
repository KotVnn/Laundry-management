'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ICustomer } from '@/interfaces/customer.interface';
import { useEffect, useState } from 'react';
import { GET_METHOD } from '@/lib/req';
import { toast } from 'sonner';
import { IOrder } from '@/interfaces/order.interface';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function OrderDetailComp({ obj }: { obj: {phone?: string, orderId?: string} }) {

  const [customer, setCustomer] = useState<ICustomer>();
  const [order, setOrder] = useState<IOrder>();

  useEffect(() => {
    if (obj.phone && obj.phone.length === 10) {
      GET_METHOD(`/api/customer?phone=${obj.phone.replace(/\+84/g, "0").trim()}`).then((cus: ICustomer) => {
        setCustomer(cus);
      }).catch((err) => {
        toast.error(err.message);
      })
    } else if (obj.orderId) {
      GET_METHOD(`/api/order/${obj.orderId}`).then((ord: IOrder) => {
        setOrder(ord);
        setCustomer(ord.customer);
      }).catch((err) => {
        toast.error(err.message);
      })
    }
  }, [obj]);

  return (
    <Sheet>
      <SheetTrigger>
        <Button type="submit">{obj.orderId ? `Xem đơn ${obj.orderId}` : "Tạo đơn mới"}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{obj.orderId ? `Xem đơn ${obj.orderId}` : "Tạo đơn mới"}</SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <div className="space-y-8 px-5 max-w-xl mx-auto">
          <div>
            <Label htmlFor="fullName">Tên khách hàng</Label>
            <Input disabled={!obj.orderId} id="fullName" placeholder="Tên khách hàng" value={customer?.fullName} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="m@example.com" />
            <p className="text-sm text-muted-foreground mt-1">
              You can manage verified email addresses in your{" "}
              <Link href="/examples/forms" className="underline">
                email settings
              </Link>.
            </p>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little bit about yourself"
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-1">
              You can <span>@mention</span> other users and organizations to link to them.
            </p>
          </div>

          <div>
            <Label>URLs</Label>
            <div className="space-y-2">
              <Input placeholder="https://your-site.com" />
              <Input placeholder="https://your-blog.com" />
              <Button variant="outline" size="sm">
                Add URL
              </Button>
            </div>
          </div>

          <Button type="submit">Update profile</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

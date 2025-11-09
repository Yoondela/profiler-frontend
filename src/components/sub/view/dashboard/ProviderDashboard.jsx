'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProviderBookingsPending from "./ProviderBookingsPending"
import ProviderBookingsAll from "./ProviderBookingsAll"
import ProviderBookingsCompleted from "./ProviderBookingsCompleted"

export default function ProviderDashboard() {

  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-semibold mb-4">Provider Dashboard</h1> */}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-blue-200">
          <TabsTrigger value="accepted">My Bookings</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ProviderBookingsAll />
        </TabsContent>

        <TabsContent value="accepted">
          <ProviderBookingsAll />
        </TabsContent>

        <TabsContent value="pending">
          <ProviderBookingsPending />
        </TabsContent>

        <TabsContent value="completed">
          <ProviderBookingsCompleted />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// import { Calendar } from 'lucide-react';
// import BookingList from './bookingList';
// import { useBookings } from '@/api/context/bookingsContext';
// import {
//   Sheet,
//   SheetTrigger,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from '@/components/ui/sheet';

// export default function BookingContainer() {
//   const { hasNew, clearNewFlag } = useBookings();

//   return (
//     <div>
//       <Sheet
//         modal={false}
//         onOpenChange={(open) => {
//           if (!open) clearNewFlag();
//         }}
//       >
//         <SheetTrigger className="group relative flex items-center justify-center transition cursor-pointer">
//           <Calendar size={19} className="group-hover:hidden mt-[4px]" />
//           {hasNew && (
//             <span className="absolute top-0 right-0 block h-[10px] w-[10px] rounded-full bg-red-600" />
//           )}
//         </SheetTrigger>

//         <SheetContent
//           side="right"
//           className="border-none w-[420px] sm:w-[520px] h-[93%] bg-[white] my-[50px] gap-0"
//         >
//           <SheetHeader className="mt-7 px-2 py-0">
//             <SheetTitle className="text-xl text-green-200">Bookings</SheetTitle>
//           </SheetHeader>

//           <div className="overflow-y-auto m-0 p-0">
//             <BookingList />
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

import { useApiClient } from '@/api/useApiClient';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { useEffect, useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import ProfileHeader from '../ProfileHeader';
import { RxDotsVertical, RxChevronLeft, RxChevronRight } from 'react-icons/rx';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';

// Sample meetings data
const meetings = [
  {
    id: 1,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-08-20T13:00',
    endDatetime: '2025-08-20T14:30',
  },
  {
    id: 2,
    name: 'Michael Foster',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-08-20T09:00',
    endDatetime: '2025-05-20T11:30',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-08-20T17:00',
    endDatetime: '2025-08-20T18:30',
  },

  {
    id: 4,
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-08-09T13:00',
    endDatetime: '2025-08-09T14:30',
  },
  {
    id: 5,
    name: 'Michael Foster',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    startDatetime: '2025-08-13T14:00',
    endDatetime: '2022-08-13T14:30',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function UserSchedule() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const [bookings, setBookings] = useState([]);
  // const [selectedDayBooking, setSelectedDayBooking] = new Date();

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [backendUserId, setBackendUserId] = useState(null);
  const api = useApiClient();

  useEffect(() => {
    async function loadBackendUser() {
      if (!isAuthenticated || !user) return;
      const id = await getUserID(getAccessTokenSilently, user.email);
      setBackendUserId(id);
    }
    loadBackendUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    if (!backendUserId) return;
    async function fetchBookings() {
      try {
        const res = await api.get(
          `/bookings/client/${backendUserId}?status=accepted`
        );
        console.log('res.data:', res.data);
        const mapped = res.data.map((b) => {
          const dateString = b.forDate?.substring(0, 10);
          const timeString = b.forTime || '09:00';

          const start = new Date(`${dateString} ${timeString}`);
          const end = new Date(start.getTime() + 60 * 60 * 1000);

          return {
            id: b._id,
            name: b.provider?.name || 'Unknown',
            service: b.serviceType,
            imageUrl: b.provider?.profile?.avatarUrl || '',
            startDatetime: start.toISOString(),
            endDatetime: end.toISOString(),
          };
        });

        console.log('mapped bookings:', mapped);
        setBookings(mapped);
        console.log('bookings fetched for calendar', res.data);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    }
    fetchBookings();
  }, [backendUserId, api]);

  const selectedDayBookings = bookings.filter((b) =>
    isSameDay(parseISO(b.startDatetime), selectedDay)
  );

  console.log('selectedDayBookings:', selectedDayBookings);

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  );

  return (
    <div className="user-schedule-wrapper">
      {/* <ProfileHeader userName="John Doe" /> */}

      <div className="profile-page__divider" />

      <p className="mt-16 mb-6 space-y-1 text-center text-l leading-6 text-gray-500">
        Your past and upcoming services
      </p>

      <div className="pt-16">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
              <div className="flex items-center">
                <h2 className="flex-auto font-semibold text-gray-900">
                  {format(firstDayCurrentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <RxChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <RxChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      'py-1.5'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && 'text-white',
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          'text-pink-500',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-900',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          'text-gray-400',
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          'bg-blue-500',
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          'bg-gray-900',
                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          'font-semibold',
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                      )}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {bookings.some((booking) =>
                        isSameDay(parseISO(booking.startDatetime), day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 items-center"></div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-semibold text-gray-900">
                Schedule for{' '}
                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                  {format(selectedDay, 'MMM dd, yyy')}
                </time>
              </h2>
              <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayBookings.length > 0 ? (
                  selectedDayBookings.map((booking) => (
                    <Meeting meeting={booking} key={booking.id} />
                  ))
                ) : (
                  <p>No service scheduled for today.</p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meeting({ meeting }) {
  console.log('Rendering meeting:');
  let startDatetime = parseISO(meeting.startDatetime);
  let endDatetime = parseISO(meeting.startDatetime);

  return (
    <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
      <img
        src={meeting.imageUrl || '/user-profile-img/profile.jpg'}
        alt="couldn't load image"
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <p className="text-gray-900">{meeting.name}</p>
        <p className="text-xs text-gray-500">{meeting.service}</p>
        <p className="mt-0.5 text-gray-500 text-sm truncate">
          <time dateTime={meeting.startDatetime}>
            {format(startDatetime, 'h:mm a')}
          </time>{' '}
          -{' '}
          <time dateTime={meeting.endDatetime}>
            {format(endDatetime, 'h:mm a')}
          </time>
        </p>
      </div>
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
      >
        <div>
          <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <span className="sr-only">Open options</span>
            <RxDotsVertical className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Edit
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Cancel
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

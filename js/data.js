/* ==========================================================================
   AeroBook — hardcoded demo data (no backend)
   ========================================================================== */

const DB = {
  users: [
    { id: 'ADM-001', role: 'admin', name: 'Jana Tamer', email: 'admin@aerobook.com', password: 'Admin@123', title: 'Network & Pricing Admin' },
    { id: 'STF-014', role: 'staff', name: 'Salma Hussein', email: 'staff@aerobook.com', password: 'Staff@123', title: 'Ground Staff · CAI Terminal 3' },
    { id: 'PAX-20931', role: 'passenger', name: 'Jumana Hussam', email: 'passenger@aerobook.com', phone: '+20 100 555 0199', password: 'Pass@123', title: 'AeroBook Silver member' },
    { id: 'PAX-20944', role: 'passenger', name: 'Nour Reda', email: 'nour.reda@gmail.com', phone: '+20 122 410 8833', password: 'Pass@123', title: 'AeroBook member' }
  ],

  airports: [
    { code: 'CAI', city: 'Cairo', country: 'Egypt' },
    { code: 'HRG', city: 'Hurghada', country: 'Egypt' },
    { code: 'DXB', city: 'Dubai', country: 'UAE' },
    { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia' },
    { code: 'RUH', city: 'Riyadh', country: 'Saudi Arabia' },
    { code: 'AMM', city: 'Amman', country: 'Jordan' },
    { code: 'IST', city: 'Istanbul', country: 'Türkiye' },
    { code: 'LHR', city: 'London', country: 'United Kingdom' },
    { code: 'CDG', city: 'Paris', country: 'France' },
    { code: 'FRA', city: 'Frankfurt', country: 'Germany' },
    { code: 'JFK', city: 'New York', country: 'United States' }
  ],

  aircraft: [
    { reg: 'SU-ABA', type: 'Airbus A320neo', layout: 'A320', cabins: { business: 12, economy: 150 } },
    { reg: 'SU-ABB', type: 'Airbus A320neo', layout: 'A320', cabins: { business: 12, economy: 150 } },
    { reg: 'SU-ABC', type: 'Boeing 737-800', layout: 'B738', cabins: { business: 16, economy: 138 } },
    { reg: 'SU-ABD', type: 'Boeing 787-9', layout: 'B789', cabins: { business: 30, premium: 28, economy: 232 } },
    { reg: 'SU-ABE', type: 'Airbus A321neo', layout: 'A321', cabins: { business: 16, economy: 180 } }
  ],

  flights: [
    { no: 'AB101', from: 'CAI', to: 'DXB', dep: '2026-10-22T08:15', arr: '2026-10-22T12:50', aircraft: 'SU-ABA', status: 'On time', gate: 'B12', capacity: 162, booked: 148, checkedIn: 96, lowest: 289, airline: 'AeroBook', stops: 0 },
    { no: 'AB205', from: 'CAI', to: 'LHR', dep: '2026-10-22T10:40', arr: '2026-10-22T14:55', aircraft: 'SU-ABD', status: 'Delayed', newTime: '2026-10-22T11:35', gate: 'F4', capacity: 290, booked: 251, checkedIn: 120, lowest: 512, airline: 'AeroBook', stops: 0 },
    { no: 'AB317', from: 'CAI', to: 'JED', dep: '2026-10-22T13:05', arr: '2026-10-22T15:20', aircraft: 'SU-ABC', status: 'Boarding', gate: 'C7', capacity: 154, booked: 150, checkedIn: 141, lowest: 214, airline: 'AeroBook', stops: 0 },
    { no: 'AB422', from: 'DXB', to: 'CAI', dep: '2026-10-22T15:30', arr: '2026-10-22T18:10', aircraft: 'SU-ABA', status: 'On time', gate: 'A3', capacity: 162, booked: 121, checkedIn: 40, lowest: 265, airline: 'AeroBook', stops: 0 },
    { no: 'AB510', from: 'CAI', to: 'IST', dep: '2026-10-22T17:45', arr: '2026-10-22T20:55', aircraft: 'SU-ABE', status: 'Gate changed', gate: 'D9', oldGate: 'D2', capacity: 196, booked: 172, checkedIn: 22, lowest: 238, airline: 'AeroBook', stops: 0 },
    { no: 'AB611', from: 'CAI', to: 'CDG', dep: '2026-10-23T09:20', arr: '2026-10-23T13:40', aircraft: 'SU-ABB', status: 'On time', gate: 'F1', capacity: 162, booked: 97, checkedIn: 0, lowest: 448, airline: 'AeroBook', stops: 0 },
    { no: 'AB720', from: 'RUH', to: 'CAI', dep: '2026-10-23T06:10', arr: '2026-10-23T08:35', aircraft: 'SU-ABC', status: 'Cancelled', gate: '—', capacity: 154, booked: 88, checkedIn: 0, lowest: 199, airline: 'AeroBook', stops: 0 },
    { no: 'AB833', from: 'CAI', to: 'HRG', dep: '2026-10-24T07:00', arr: '2026-10-24T08:05', aircraft: 'SU-ABE', status: 'On time', gate: 'B2', capacity: 196, booked: 143, checkedIn: 0, lowest: 79, airline: 'AeroBook', stops: 0 },
    { no: 'AB905', from: 'CAI', to: 'JFK', dep: '2026-10-25T11:00', arr: '2026-10-25T16:45', aircraft: 'SU-ABD', status: 'On time', gate: 'F6', capacity: 290, booked: 204, checkedIn: 0, lowest: 879, airline: 'AeroBook', stops: 0 },
    { no: 'AB118', from: 'AMM', to: 'CAI', dep: '2026-10-21T21:30', arr: '2026-10-21T22:45', aircraft: 'SU-ABB', status: 'Arrived', gate: 'A8', capacity: 162, booked: 133, checkedIn: 133, lowest: 155, airline: 'AeroBook', stops: 0 },
    { no: 'AB240', from: 'FRA', to: 'CAI', dep: '2026-10-21T12:15', arr: '2026-10-21T17:20', aircraft: 'SU-ABE', status: 'Departed', gate: 'B44', capacity: 196, booked: 180, checkedIn: 178, lowest: 402, airline: 'AeroBook', stops: 0 }
  ],

  /* Search results for CAI → DXB (passenger search page) */
  searchResults: [
    { no: 'AB101', airline: 'AeroBook', from: 'CAI', to: 'DXB', dep: '08:15', arr: '12:50', duration: 215, stops: 0, fare: 289, seatsLeft: 9, aircraft: 'Airbus A320neo', tod: 'morning' },
    { no: 'AB103', airline: 'AeroBook', from: 'CAI', to: 'DXB', dep: '14:40', arr: '19:15', duration: 215, stops: 0, fare: 315, seatsLeft: 22, aircraft: 'Airbus A321neo', tod: 'afternoon' },
    { no: 'NL 412', airline: 'Nile Air (partner)', from: 'CAI', to: 'DXB', dep: '23:55', arr: '04:30', duration: 215, stops: 0, fare: 254, seatsLeft: 4, aircraft: 'Airbus A320', tod: 'night', nextDay: true },
    { no: 'AB317 + AB650', airline: 'AeroBook', from: 'CAI', to: 'DXB', dep: '13:05', arr: '20:10', duration: 365, stops: 1, fare: 238, seatsLeft: 14, aircraft: 'B737-800 · A320neo', tod: 'afternoon',
      via: 'JED', layover: 95 },
    { no: 'AB510 + AB772', airline: 'AeroBook', from: 'CAI', to: 'DXB', dep: '17:45', arr: '06:20', duration: 515, stops: 1, fare: 226, seatsLeft: 31, aircraft: 'A321neo · B787-9', tod: 'evening',
      via: 'IST', layover: 140, nextDay: true }
  ],

  fareClasses: [
    { cabin: 'Business', code: 'J', name: 'Business Flex', base: 1180, taxes: 96, bags: '2 × 32 kg', change: 'Free', refund: 'Full refund', color: 'primary' },
    { cabin: 'Business', code: 'C', name: 'Business Saver', base: 920, taxes: 96, bags: '2 × 32 kg', change: '$75', refund: '$150 fee', color: 'primary' },
    { cabin: 'Premium Economy', code: 'W', name: 'Premium Flex', base: 640, taxes: 82, bags: '2 × 23 kg', change: '$50', refund: '$100 fee', color: 'info' },
    { cabin: 'Economy', code: 'Y', name: 'Economy Flex', base: 420, taxes: 74, bags: '1 × 23 kg', change: '$50', refund: '$120 fee', color: 'success' },
    { cabin: 'Economy', code: 'M', name: 'Economy Classic', base: 289, taxes: 74, bags: '1 × 23 kg', change: '$90', refund: '50% refund', color: 'success' },
    { cabin: 'Economy', code: 'O', name: 'Economy Light', base: 199, taxes: 74, bags: 'Cabin bag only', change: 'Not allowed', refund: 'Non-refundable', color: 'warning' }
  ],

  promos: [
    { code: 'AUTUMN15', type: 'percent', value: 15, from: '2026-10-01', to: '2026-11-30', routes: 'All routes', used: 412, max: 1000, status: 'Active' },
    { code: 'DXB50', type: 'fixed', value: 50, from: '2026-10-15', to: '2026-12-31', routes: 'CAI–DXB, DXB–CAI', used: 88, max: 500, status: 'Active' },
    { code: 'STUDENT10', type: 'percent', value: 10, from: '2026-01-01', to: '2026-12-31', routes: 'All routes', used: 1290, max: 5000, status: 'Active' },
    { code: 'SUMMER25', type: 'percent', value: 25, from: '2026-06-01', to: '2026-08-31', routes: 'CAI–IST, CAI–CDG', used: 750, max: 750, status: 'Expired' },
    { code: 'NYC100', type: 'fixed', value: 100, from: '2026-11-15', to: '2027-01-15', routes: 'CAI–JFK', used: 0, max: 200, status: 'Scheduled' }
  ],

  bookings: [
    { ref: 'K7M2QX', pax: 'Jumana Hussam', lastName: 'Hussam', flight: 'AB101', route: 'CAI → DXB', date: '2026-10-22', fare: 'Economy Classic', seat: '14C', total: 412.4, status: 'Confirmed', paid: true, checkedIn: true, passport: 'A12345678' },
    { ref: 'P9D4LT', pax: 'Nour Reda', lastName: 'Reda', flight: 'AB205', route: 'CAI → LHR', date: '2026-10-22', fare: 'Business Saver', seat: '3A', total: 1088.0, status: 'Confirmed', paid: true, checkedIn: false, passport: 'A88213409' },
    { ref: 'H2W8NC', pax: 'Omar Hassan', lastName: 'Hassan', flight: 'AB317', route: 'CAI → JED', date: '2026-10-22', fare: 'Economy Light', seat: '22F', total: 273.0, status: 'Checked in', paid: true, checkedIn: true, passport: 'A55102847' },
    { ref: 'R5T1BZ', pax: 'Laila Mostafa', lastName: 'Mostafa', flight: 'AB510', route: 'CAI → IST', date: '2026-10-22', fare: 'Economy Flex', seat: '—', total: 494.0, status: 'Confirmed', paid: true, checkedIn: false, passport: 'A33019284' },
    { ref: 'M8Q3JV', pax: 'Karim Fathy', lastName: 'Fathy', flight: 'AB720', route: 'RUH → CAI', date: '2026-10-23', fare: 'Economy Classic', seat: '9B', total: 286.0, status: 'Cancelled by airline', paid: true, checkedIn: false, passport: 'A77120034' },
    { ref: 'Z4N6YD', pax: 'Nadia Farouk', lastName: 'Farouk', flight: 'AB611', route: 'CAI → CDG', date: '2026-10-23', fare: 'Economy Flex', seat: '18A', total: 522.0, status: 'Pending payment', paid: false, checkedIn: false, passport: 'A90012773' },
    { ref: 'T3C7GA', pax: 'Hany Ibrahim', lastName: 'Ibrahim', flight: 'AB905', route: 'CAI → JFK', date: '2026-10-25', fare: 'Business Flex', seat: '2D', total: 1276.0, status: 'Confirmed', paid: true, checkedIn: false, passport: 'A41827730' },
    { ref: 'B6V2KE', pax: 'Mona Adel', lastName: 'Adel', flight: 'AB833', route: 'CAI → HRG', date: '2026-10-24', fare: 'Economy Light', seat: '7C', total: 153.0, status: 'Confirmed', paid: true, checkedIn: false, passport: 'A20183344' }
  ],

  /* Passenger (Jumana Hussam) travel history — newest first */
  trips: [
    { ref: 'Y8E3RT', flight: 'AB905', from: 'CAI', to: 'JFK', date: '2026-12-18T11:00', status: 'Confirmed', seat: '31A', cabin: 'Economy', upcoming: true },
    { ref: 'K7M2QX', flight: 'AB101', from: 'CAI', to: 'DXB', date: '2026-10-22T08:15', status: 'Checked in', seat: '14C', cabin: 'Economy', upcoming: true },
    { ref: 'F2L9HP', flight: 'AB422', from: 'DXB', to: 'CAI', date: '2026-08-14T15:30', status: 'Completed', seat: '12A', cabin: 'Economy', upcoming: false },
    { ref: 'Q4A7MN', flight: 'AB611', from: 'CAI', to: 'CDG', date: '2026-05-02T09:20', status: 'Completed', seat: '4C', cabin: 'Business', upcoming: false },
    { ref: 'W1S5UB', flight: 'AB317', from: 'CAI', to: 'JED', date: '2025-12-20T13:05', status: 'Cancelled', seat: '—', cabin: 'Economy', upcoming: false },
    { ref: 'J6T0CX', flight: 'AB510', from: 'CAI', to: 'IST', date: '2024-03-11T17:45', status: 'Completed', seat: '20D', cabin: 'Economy', upcoming: false }
  ],

  auditLog: [
    { at: '2026-10-21T09:42:11', admin: 'ADM-001', flight: 'AB205', field: 'Departure time', old: '2026-10-22 10:40', new: '2026-10-22 11:35', notified: 251 },
    { at: '2026-10-21T08:15:03', admin: 'ADM-001', flight: 'AB720', field: 'Status', old: 'Scheduled', new: 'Cancelled', notified: 88 },
    { at: '2026-10-20T17:30:47', admin: 'ADM-003', flight: 'AB510', field: 'Gate', old: 'D2', new: 'D9', notified: 172 },
    { at: '2026-10-20T11:02:19', admin: 'ADM-001', flight: 'AB611', field: 'Aircraft', old: 'SU-ABA (A320neo)', new: 'SU-ABB (A320neo)', notified: 97 },
    { at: '2026-10-19T14:44:52', admin: 'ADM-002', flight: 'AB905', field: 'Route', old: 'CAI → EWR', new: 'CAI → JFK', notified: 204 },
    { at: '2026-10-18T10:20:31', admin: 'ADM-001', flight: 'AB833', field: 'Created', old: '—', new: 'CAI → HRG · 2026-10-24 07:00', notified: 0 }
  ],

  bags: [
    { tag: '0157204381', pax: 'Jumana Hussam', ref: 'K7M2QX', flight: 'AB101', weight: 21.4, status: 'Loaded',
      history: [
        { status: 'Checked in', at: '2026-10-22T06:12', loc: 'CAI · T3 Counter 14' },
        { status: 'Security screened', at: '2026-10-22T06:40', loc: 'CAI · Baggage hall' },
        { status: 'Loaded', at: '2026-10-22T07:48', loc: 'CAI · Stand B12 · AB101' }
      ] },
    { tag: '0157204382', pax: 'Jumana Hussam', ref: 'K7M2QX', flight: 'AB101', weight: 18.9, status: 'Checked in',
      history: [{ status: 'Checked in', at: '2026-10-22T06:12', loc: 'CAI · T3 Counter 14' }] },
    { tag: '0157198820', pax: 'Omar Hassan', ref: 'H2W8NC', flight: 'AB317', weight: 24.6, status: 'Transferred',
      history: [
        { status: 'Checked in', at: '2026-10-22T10:30', loc: 'CAI · T3 Counter 9' },
        { status: 'Loaded', at: '2026-10-22T12:31', loc: 'CAI · Stand C7' },
        { status: 'Transferred', at: '2026-10-22T16:05', loc: 'JED · Transfer belt 3' }
      ] },
    { tag: '0157190044', pax: 'Hala Youssef', ref: 'C1R8DS', flight: 'AB240', weight: 22.1, status: 'Missing',
      history: [
        { status: 'Checked in', at: '2026-10-21T09:50', loc: 'FRA · Counter 712' },
        { status: 'Loaded', at: '2026-10-21T11:40', loc: 'FRA · Stand B44' },
        { status: 'Missing', at: '2026-10-21T18:02', loc: 'CAI · Belt 5 — not received' }
      ] },
    { tag: '0157188213', pax: 'Tarek Said', ref: 'L0P2WQ', flight: 'AB118', weight: 16.2, status: 'Arrived',
      history: [
        { status: 'Checked in', at: '2026-10-21T19:30', loc: 'AMM · Counter 22' },
        { status: 'Loaded', at: '2026-10-21T21:02', loc: 'AMM · Stand 8' },
        { status: 'Arrived', at: '2026-10-21T23:05', loc: 'CAI · Belt 2' }
      ] }
  ],

  /* Passenger manifest used by staff seat map / check-in (flight AB101) */
  manifest: [
    { seat: '1A', name: 'Hany Ibrahim', ref: 'T3C7GA', ssr: [], checkedIn: true, online: true },
    { seat: '2C', name: 'Dina Mahmoud', ref: 'G6H2PL', ssr: ['Special meal (VGML)'], checkedIn: false, online: false },
    { seat: '4D', name: 'Mostafa Zaki', ref: 'V7B1QM', ssr: ['Wheelchair (WCHR)'], checkedIn: true, online: false },
    { seat: '8A', name: 'Rania Saad', ref: 'N3K8ZD', ssr: ['Infant (INFT)'], checkedIn: false, online: false },
    { seat: '9F', name: 'Ali Fawzy', ref: 'E5J4RA', ssr: ['Unaccompanied minor (UMNR)'], checkedIn: true, online: true },
    { seat: '14C', name: 'Jumana Hussam', ref: 'K7M2QX', ssr: [], checkedIn: true, online: true },
    { seat: '14D', name: 'Nour Reda', ref: 'P9D4LT', ssr: [], checkedIn: false, online: false },
    { seat: '17B', name: 'Youssef Amr', ref: 'S2C9FH', ssr: [], checkedIn: false, online: false },
    { seat: '22E', name: 'Nour Hamed', ref: 'U8X3MB', ssr: ['Special meal (DBML)'], checkedIn: true, online: true }
  ],

  revenueByMonth: [
    { label: 'Nov', value: 1.82 }, { label: 'Dec', value: 2.41 }, { label: 'Jan', value: 1.96 },
    { label: 'Feb', value: 1.74 }, { label: 'Mar', value: 2.08 }, { label: 'Apr', value: 2.22 },
    { label: 'May', value: 2.37 }, { label: 'Jun', value: 2.91 }, { label: 'Jul', value: 3.28 },
    { label: 'Aug', value: 3.12 }, { label: 'Sep', value: 2.46 }, { label: 'Oct', value: 2.19 }
  ],

  routeRevenue: [
    { route: 'CAI → LHR', flights: 62, pax: 14210, revenue: 7.48, avgFare: 526 },
    { route: 'CAI → DXB', flights: 124, pax: 18904, revenue: 5.62, avgFare: 297 },
    { route: 'CAI → JFK', flights: 26, pax: 6588, revenue: 5.41, avgFare: 821 },
    { route: 'CAI → JED', flights: 118, pax: 16422, revenue: 3.71, avgFare: 226 },
    { route: 'CAI → CDG', flights: 48, pax: 7012, revenue: 3.24, avgFare: 462 },
    { route: 'CAI → IST', flights: 84, pax: 13240, revenue: 3.19, avgFare: 241 },
    { route: 'CAI → HRG', flights: 140, pax: 21870, revenue: 1.82, avgFare: 83 },
    { route: 'RUH → CAI', flights: 72, pax: 9944, revenue: 1.98, avgFare: 199 }
  ],

  notifications: {
    admin: [
      { icon: 'triangle-alert', text: 'AB205 delayed 55 min — 251 passengers notified', time: '12 min ago' },
      { icon: 'circle-x', text: 'AB720 cancelled — 88 rebooking/refund offers sent', time: '1 h ago' },
      { icon: 'tag', text: 'Promo SUMMER25 reached max uses (750)', time: 'Yesterday' }
    ],
    staff: [
      { icon: 'door-open', text: 'AB317 boarding started at gate C7', time: '3 min ago' },
      { icon: 'luggage', text: 'Bag 0157190044 reported missing at CAI belt 5', time: '40 min ago' },
      { icon: 'arrow-left-right', text: 'AB510 gate changed D2 → D9', time: '2 h ago' }
    ],
    passenger: [
      { icon: 'circle-check', text: 'You are checked in for AB101 to Dubai', time: '2 h ago' },
      { icon: 'luggage', text: 'Bag 0157204381 has been loaded', time: '1 h ago' },
      { icon: 'tag', text: 'AUTUMN15: 15% off routes to Europe', time: '2 days ago' }
    ]
  }
};

/* Helpers to look things up */
DB.airport = (code) => DB.airports.find(a => a.code === code) || { code, city: code };
DB.flight = (no) => DB.flights.find(f => f.no === no);

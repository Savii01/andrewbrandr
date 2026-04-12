# Discovery & Scheduling Feature Task List

This document outlines the tasks required to implement a custom discovery and call scheduling system within the Brandr platform, replacing the need for external tools like Cal.com.

## Phase 1: Data Modeling & Firebase Setup
- [ ] Define Firestore schema for `availability`:
    - `workingDays`: Array of days (e.g., `['Monday', 'Tuesday', ...]`).
    - `slots`: Configuration for time slots (start time, end time, duration).
    - `blockedDates`: Specific dates to exclude.
- [ ] Define Firestore schema for `bookings`:
    - `name`: Client name.
    - `email`: Client email.
    - `date`: Selected date.
    - `time`: Selected time slot.
    - `status`: `pending` | `confirmed` | `cancelled`.
- [ ] Set up Firestore security rules to allow public creation of bookings but restricted read/write for availability.

## Phase 2: Dashboard Management UI (Admin)
- [ ] **Availability Settings Page**:
    - [ ] Day-of-week selection toggle.
    - [ ] Time range inputs for each day (e.g., 9:00 AM - 5:00 PM).
    - [ ] Slot duration selector (15m, 30m, 60m).
    - [ ] "Manual Block" calendar to click and disable specific dates.
- [ ] **Bookings Management**:
    - [ ] List view of all scheduled calls.
    - [ ] Actions: Confirm, Reschedule, Cancel.
    - [ ] Integration with dashboard notifications.

## Phase 3: Public Scheduling Interface
- [ ] **Discovery Hero Component**:
    - [ ] Implement the high-impact orange banner layout.
    - [ ] Add "See Pricing" and Social links.
    - [ ] Integrate the Calendar widget on the right.
- [ ] **Custom Calendar Widget**:
    - [ ] Month navigation logic.
    - [ ] Day selection state.
    - [ ] Real-time slot generation based on admin availability settings.
    - [ ] 12h/24h time format toggle.
- [ ] **Booking Flow**:
    - [ ] Confirmation modal/form after selecting a slot.
    - [ ] Success state with calendar invite generation (optional).
    - [ ] EmailJS integration for immediate notifications to both parties.

## Phase 4: Refinement & UX
- [ ] Timezone detection and conversion for international clients.
- [ ] Prevent double-booking (lock slot while form is being filled).
- [ ] Mobile responsive layout for the calendar (accordion or modal view).
- [ ] Success/Error animations using Framer Motion.

## Visual Reference
![Reference UI Layout](https://i.ibb.co/v4m1VQ7/linea-example.png)
*Note: Layout features a bold horizontal split with copy on the left and a clean, elevate calendar widget on the right.*

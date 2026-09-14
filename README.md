# 🎟️ FestPass — College Fest & Hackathon Booking Portal with QR Code Tickets

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript%20ES6%2B%20%7C%20QRCode.js-cyan)](#tech-stack)
[![Security](https://img.shields.io/badge/Check--In-Gatekeeper%20Verification%20Engine-purple)](#gatekeeper-verification)
[![Developer](https://img.shields.io/badge/Developer-Saurabh%20Bapu%20Virkar-orange)](https://github.com/Nesvv)

**FestPass** is a modern, responsive web application engineered to digitize college event ticketing, hackathon registrations, and campus cultural fests. It completely replaces slow paper queues with **client-side dynamic QR code pass generation**, ticket vault storage in `localStorage`, and an integrated **Gatekeeper Check-In Station** that validates passes and prevents duplicate entry at event gates.

---

## 🌟 Key Features

- **🎪 Campus Event Discovery**:
  - Live catalog featuring university hackathons, battle of the bands, robotics arenas, and esports cups.
  - Category filtering (*Hackathons, Cultural, Gaming, Tech, Workshops*) and instant debounced search.
  - Live available seat countdown and pricing badges (*Free Entry / Paid Passes*).
- **🎫 Realistic Perforated Digital Ticket**:
  - Custom perforated concert ticket UI with cutout circular notches, dashed tear line, and event metadata.
  - **Dynamic Scannable QR Code** generated using `qrcode.js` containing encoded attendee and pass details.
  - Single-click **"Print / Save PDF"** export for offline entry passes.
- **🛡️ Organizer Gatekeeper Check-In Station**:
  - Purpose-built admin portal for event volunteers and gatekeepers at the venue entrance.
  - Instantly checks ticket IDs against the verified database:
    - `✅ ENTRY GRANTED` (Verified attendee details & timestamped check-in)
    - `⚠️ ALREADY SCANNED` (Flags duplicate pass attempts with previous scan time)
    - `❌ INVALID TICKET` (Rejects unauthorized ticket IDs)
- **📱 "My Tickets" Slide-Over Vault**:
  - Persistent storage in `localStorage` allowing students to access, inspect, and re-download their event passes at any time.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Semantic HTML5, Modern CSS3 (CSS Variables, Glassmorphism, Flexbox/Grid) |
| **Scripting & State** | Vanilla JavaScript ES6+ (Modular architecture, LocalStorage API) |
| **QR Code Engine** | QRCode.js Library |
| **Typography & Icons** | Space Grotesk, Plus Jakarta Sans, JetBrains Mono, FontAwesome 6 |

---

## 🚀 Running the Project

```bash
# Clone the repository
git clone https://github.com/Nesvv/festpass-portal.git
cd festpass-portal

# Open in browser
python -m http.server 3000
# Or double-click index.html directly!
```

---

## 👨‍💻 Author

**Saurabh Bapu Virkar**  
- 2nd Year Computer Engineering Student, University of Mumbai  
- GitHub: [@Nesvv](https://github.com/Nesvv)

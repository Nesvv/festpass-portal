/**
 * FESTPASS - APPLICATION CONTROLLER
 * Coordinates event browsing, ticket booking, QR generation,
 * ticket vault drawer, and gatekeeper check-in verification
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  let state = {
    events: [...CAMPUS_EVENTS],
    selectedCategory: "all",
    searchQuery: "",
    activeBookingEvent: null,
    recentCheckIns: []
  };

  // DOM Elements
  const eventsGrid = document.getElementById("eventsGrid");
  const categoryFilters = document.getElementById("categoryFilters");
  const eventSearchInput = document.getElementById("eventSearchInput");
  const catalogResultsCount = document.getElementById("catalogResultsCount");
  const bookedTicketsCount = document.getElementById("bookedTicketsCount");

  // Booking Modal Elements
  const bookingModal = document.getElementById("bookingModal");
  const closeBookingBtn = document.getElementById("closeBookingBtn");
  const bookingForm = document.getElementById("bookingForm");
  const bookingEventTag = document.getElementById("bookingEventTag");
  const bookingEventTitle = document.getElementById("bookingEventTitle");
  const bookingEventVenue = document.getElementById("bookingEventVenue");
  const bookingPassPrice = document.getElementById("bookingPassPrice");
  const bookingTotalPrice = document.getElementById("bookingTotalPrice");
  const attPassCount = document.getElementById("attPassCount");

  // Ticket Pass Modal Elements
  const ticketPassModal = document.getElementById("ticketPassModal");
  const closePassBtn = document.getElementById("closePassBtn");
  const doneTicketBtn = document.getElementById("doneTicketBtn");
  const tEventCat = document.getElementById("tEventCat");
  const tEventTitle = document.getElementById("tEventTitle");
  const tEventDate = document.getElementById("tEventDate");
  const tEventVenue = document.getElementById("tEventVenue");
  const tAttendeeName = document.getElementById("tAttendeeName");
  const tAttendeeCollege = document.getElementById("tAttendeeCollege");
  const tPassCount = document.getElementById("tPassCount");
  const tTicketId = document.getElementById("tTicketId");
  const ticketQRCodeContainer = document.getElementById("ticketQRCodeContainer");
  const ticketStatusPill = document.getElementById("ticketStatusPill");

  // Drawer Elements
  const myTicketsBtn = document.getElementById("myTicketsBtn");
  const ticketsDrawer = document.getElementById("ticketsDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const myTicketsList = document.getElementById("myTicketsList");

  // Gatekeeper Station Elements
  const gateStationBtn = document.getElementById("gateStationBtn");
  const gatekeeperModal = document.getElementById("gatekeeperModal");
  const closeGateBtn = document.getElementById("closeGateBtn");
  const scanTicketInput = document.getElementById("scanTicketInput");
  const verifyTicketBtn = document.getElementById("verifyTicketBtn");
  const scanResultAlert = document.getElementById("scanResultAlert");
  const fillSampleTicketBtn = document.getElementById("fillSampleTicketBtn");
  const checkedInHistoryList = document.getElementById("checkedInHistoryList");

  // Initialize
  renderEvents();
  updateTicketsBadge();
  setupEventListeners();

  /* =======================================================
     1. EVENT CATALOG & FILTERING
     ======================================================= */
  function getFilteredEvents() {
    let list = [...state.events];

    // Category filter
    if (state.selectedCategory !== "all") {
      list = list.filter(e => e.category === state.selectedCategory);
    }

    // Search query filter
    if (state.searchQuery) {
      list = list.filter(e =>
        e.title.toLowerCase().includes(state.searchQuery) ||
        e.college.toLowerCase().includes(state.searchQuery) ||
        e.venue.toLowerCase().includes(state.searchQuery) ||
        e.category.toLowerCase().includes(state.searchQuery)
      );
    }

    return list;
  }

  function renderEvents() {
    const items = getFilteredEvents();
    catalogResultsCount.textContent = `Showing ${items.length} Event${items.length === 1 ? "" : "s"}`;

    if (items.length === 0) {
      eventsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-dim);">
          <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-glow);"></i>
          <h3>No campus events found</h3>
          <p>Try searching for "hackathon", "EDM", "RoboWars", or choose another category.</p>
        </div>
      `;
      return;
    }

    eventsGrid.innerHTML = items.map(ev => `
      <article class="event-card">
        <div class="event-banner-wrap">
          <img src="${ev.image}" alt="${ev.title}" class="event-img" loading="lazy" />
          <span class="event-badge-tag">${ev.badge || ev.category.toUpperCase()}</span>
          <span class="event-price-pill ${ev.price > 0 ? "paid" : ""}">
            ${ev.price === 0 ? "FREE ENTRY" : `₹${ev.price}`}
          </span>
        </div>

        <div class="event-card-body">
          <div class="event-meta-top">
            <i class="fa-regular fa-calendar"></i>
            <span>${ev.date} &bull; ${ev.time}</span>
          </div>

          <h3 class="event-title">${ev.title}</h3>

          <div class="event-details-strip">
            <div><i class="fa-solid fa-building-columns"></i> <span>${ev.college}</span></div>
            <div><i class="fa-solid fa-location-dot"></i> <span>${ev.venue}</span></div>
          </div>

          <p class="event-desc">${ev.description}</p>

          <div class="event-card-bottom">
            <span class="seat-counter">
              <i class="fa-solid fa-users"></i> ${ev.seatsRemaining} seats left
            </span>
            <button class="btn btn-primary" onclick="initiateBooking('${ev.id}')">
              <i class="fa-solid fa-ticket"></i>
              <span>Book Pass</span>
            </button>
          </div>
        </div>
      </article>
    `).join("");
  }

  /* =======================================================
     2. BOOKING FLOW & MODALS
     ======================================================= */
  window.initiateBooking = function(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    state.activeBookingEvent = event;
    bookingEventTag.textContent = event.category.toUpperCase();
    bookingEventTitle.textContent = event.title;
    bookingEventVenue.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${event.venue}`;

    attPassCount.value = "1";
    updateBookingPriceBreakdown();

    bookingModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  function updateBookingPriceBreakdown() {
    if (!state.activeBookingEvent) return;
    const count = Number(attPassCount.value) || 1;
    const price = state.activeBookingEvent.price;

    bookingPassPrice.textContent = price === 0 ? "FREE" : `₹${price} / pass`;

    if (price === 0) {
      bookingTotalPrice.textContent = "₹0 (Free Entry)";
      bookingTotalPrice.className = "text-green";
    } else {
      bookingTotalPrice.textContent = `₹${price * count}`;
      bookingTotalPrice.className = "text-purple";
    }
  }

  attPassCount.addEventListener("change", updateBookingPriceBreakdown);

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("attName").value.trim();
    const college = document.getElementById("attCollege").value.trim();
    const department = document.getElementById("attDept").value.trim();
    const email = document.getElementById("attEmail").value.trim();
    const phone = document.getElementById("attPhone").value.trim();
    const passCount = attPassCount.value;

    if (!name || !college || !email || !phone) return;

    // Create ticket via TicketEngine
    const ticket = TicketEngine.createTicket(state.activeBookingEvent, {
      name,
      college,
      department,
      email,
      phone,
      passCount
    });

    // Update remaining seats in local state
    if (state.activeBookingEvent.seatsRemaining > 0) {
      state.activeBookingEvent.seatsRemaining -= Number(passCount);
    }
    renderEvents();

    // Close booking form and open ticket pass modal
    closeBookingModal();
    bookingForm.reset();
    showTicketPass(ticket);
    updateTicketsBadge();
  });

  function closeBookingModal() {
    bookingModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* =======================================================
     3. DIGITAL QR TICKET PASS DISPLAY
     ======================================================= */
  function showTicketPass(ticket) {
    tEventCat.textContent = (ticket.eventCategory || "COLLEGE EVENT").toUpperCase();
    tEventTitle.textContent = ticket.eventTitle;
    tEventDate.textContent = `${ticket.eventDate} • ${ticket.eventTime}`;
    tEventVenue.textContent = ticket.eventVenue;
    tAttendeeName.textContent = ticket.attendeeName;
    tAttendeeCollege.textContent = `${ticket.college} (${ticket.department})`;
    tPassCount.textContent = `${ticket.passCount} Pass${ticket.passCount > 1 ? "es" : ""}`;
    tTicketId.textContent = `#${ticket.ticketId}`;

    ticketStatusPill.textContent = ticket.checkedIn ? "CHECKED IN" : "CONFIRMED";
    ticketStatusPill.style.background = ticket.checkedIn ? "var(--purple)" : "var(--green)";

    // Render actual scannable QR Code
    TicketEngine.renderQRCode(ticketQRCodeContainer, ticket);

    ticketPassModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeTicketPassModal() {
    ticketPassModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /* =======================================================
     4. "MY TICKETS" VAULT DRAWER
     ======================================================= */
  myTicketsBtn.addEventListener("click", () => {
    renderMyTickets();
    ticketsDrawer.classList.add("active");
    drawerOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  function closeDrawer() {
    ticketsDrawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function renderMyTickets() {
    const tickets = TicketEngine.getAllTickets();

    if (tickets.length === 0) {
      myTicketsList.innerHTML = `
        <div class="empty-vault">
          <i class="fa-solid fa-ticket"></i>
          <h4>No passes booked yet</h4>
          <p>Book passes to college hackathons and cultural nights to see them here.</p>
        </div>
      `;
      return;
    }

    myTicketsList.innerHTML = tickets.map(t => `
      <div class="vault-ticket-item">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-family: var(--font-code); font-size: 0.75rem; color: var(--primary);">#${t.ticketId}</span>
          <span style="font-size: 0.7rem; font-weight: 700; color: ${t.checkedIn ? "var(--purple)" : "var(--green)"};">
            ${t.checkedIn ? "CHECKED IN" : "ACTIVE"}
          </span>
        </div>
        <h4>${t.eventTitle}</h4>
        <div class="vault-ticket-meta">
          <i class="fa-regular fa-calendar"></i> ${t.eventDate} &bull; ${t.eventTime}
        </div>
        <div class="vault-ticket-meta">
          <i class="fa-solid fa-user"></i> ${t.attendeeName} (${t.passCount} pass)
        </div>
        <div class="vault-ticket-actions">
          <span style="font-size: 0.8rem; font-weight: 700;">${t.totalPaid === 0 ? "FREE" : `₹${t.totalPaid}`}</span>
          <button class="btn btn-sm btn-secondary" onclick="viewVaultPass('${t.ticketId}')">
            <i class="fa-solid fa-qrcode"></i>
            <span>View QR Pass</span>
          </button>
        </div>
      </div>
    `).join("");
  }

  window.viewVaultPass = function(ticketId) {
    const tickets = TicketEngine.getAllTickets();
    const ticket = tickets.find(t => t.ticketId === ticketId);
    if (!ticket) return;

    closeDrawer();
    showTicketPass(ticket);
  };

  function updateTicketsBadge() {
    const count = TicketEngine.getAllTickets().length;
    bookedTicketsCount.textContent = count;
  }

  /* =======================================================
     5. ORGANIZER GATEKEEPER CHECK-IN STATION
     ======================================================= */
  gateStationBtn.addEventListener("click", () => {
    scanTicketInput.value = "";
    scanResultAlert.className = "scan-result-alert hidden";
    renderCheckedInHistory();
    gatekeeperModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  function closeGatekeeperModal() {
    gatekeeperModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  verifyTicketBtn.addEventListener("click", handleGateVerification);
  scanTicketInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGateVerification();
  });

  function handleGateVerification() {
    const rawId = scanTicketInput.value.trim();
    if (!rawId) {
      showScanAlert("Please enter a Ticket ID to verify.", "invalid");
      return;
    }

    const result = TicketEngine.verifyAndCheckIn(rawId);

    if (result.status === "SUCCESS") {
      showScanAlert(`
        <div><i class="fa-solid fa-circle-check"></i> <strong>ENTRY GRANTED!</strong></div>
        <div style="font-size: 0.85rem; margin-top: 4px;">Attendee: ${result.ticket.attendeeName} (${result.ticket.college})</div>
        <div style="font-size: 0.8rem; opacity: 0.85;">Event: ${result.ticket.eventTitle} &bull; Passes: ${result.ticket.passCount}</div>
      `, "success");
      renderCheckedInHistory();
      updateTicketsBadge();
    } else if (result.status === "ALREADY_USED") {
      showScanAlert(`
        <div><i class="fa-solid fa-triangle-exclamation"></i> <strong>ALREADY USED TICKET!</strong></div>
        <div style="font-size: 0.85rem; margin-top: 4px;">Checked in earlier at ${result.ticket.checkInTime}. Duplicate entry prohibited.</div>
      `, "already_used");
    } else {
      showScanAlert(`
        <div><i class="fa-solid fa-circle-xmark"></i> <strong>INVALID TICKET ID</strong></div>
        <div style="font-size: 0.85rem; margin-top: 4px;">${result.message}</div>
      `, "invalid");
    }
  }

  function showScanAlert(html, type) {
    scanResultAlert.innerHTML = html;
    scanResultAlert.className = `scan-result-alert ${type}`;
  }

  // Shortcut to fill sample ticket for quick demo
  fillSampleTicketBtn.addEventListener("click", () => {
    const tickets = TicketEngine.getAllTickets();
    if (tickets.length > 0) {
      scanTicketInput.value = tickets[0].ticketId;
      handleGateVerification();
    } else {
      alert("Please book a pass first to test the gate scanner!");
    }
  });

  function renderCheckedInHistory() {
    const checkedIn = TicketEngine.getAllTickets().filter(t => t.checkedIn);

    if (checkedIn.length === 0) {
      checkedInHistoryList.innerHTML = `<p class="empty-history">No attendees checked in yet today.</p>`;
      return;
    }

    checkedInHistoryList.innerHTML = checkedIn.map(t => `
      <div class="history-item">
        <div>
          <strong>${t.attendeeName}</strong> &bull; ${t.college}
          <div style="color: var(--text-dim); font-size: 0.75rem;">#${t.ticketId} - ${t.eventTitle}</div>
        </div>
        <span class="history-time"><i class="fa-solid fa-check"></i> ${t.checkInTime}</span>
      </div>
    `).join("");
  }

  /* =======================================================
     6. COMMON LISTENERS
     ======================================================= */
  function setupEventListeners() {
    // Category pills
    categoryFilters.addEventListener("click", (e) => {
      const pill = e.target.closest(".cat-pill");
      if (!pill) return;

      document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      state.selectedCategory = pill.dataset.category;
      renderEvents();
    });

    // Search input
    let searchDebounce;
    eventSearchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        renderEvents();
      }, 200);
    });

    // Close modals
    closeBookingBtn.addEventListener("click", closeBookingModal);
    closePassBtn.addEventListener("click", closeTicketPassModal);
    doneTicketBtn.addEventListener("click", closeTicketPassModal);
    closeGateBtn.addEventListener("click", closeGatekeeperModal);
    closeDrawerBtn.addEventListener("click", closeDrawer);
    drawerOverlay.addEventListener("click", closeDrawer);

    // Click outside modal card to close
    [bookingModal, ticketPassModal, gatekeeperModal].forEach(m => {
      m.addEventListener("click", (e) => {
        if (e.target === m) {
          m.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });
  }
});

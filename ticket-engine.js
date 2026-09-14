/**
 * FESTPASS - DIGITAL QR TICKET & GATEKEEPER VERIFICATION ENGINE
 * Generates scannable QR code passes and manages check-in validation
 */

class TicketEngine {
  static STORAGE_KEY = "festpass_booked_tickets";

  /**
   * Get all booked tickets from LocalStorage
   */
  static getAllTickets() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  /**
   * Save tickets list to LocalStorage
   */
  static saveTickets(tickets) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tickets));
  }

  /**
   * Generate a unique ticket ID: #FP-2026-XXXXX
   */
  static generateTicketId() {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `FP-2026-${randomNum}`;
  }

  /**
   * Create a new confirmed ticket
   */
  static createTicket(event, attendeeData) {
    const ticketId = this.generateTicketId();
    const bookingDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const ticket = {
      ticketId: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventCategory: event.category,
      attendeeName: attendeeData.name,
      college: attendeeData.college,
      department: attendeeData.department || "Computer Engineering",
      email: attendeeData.email,
      phone: attendeeData.phone,
      passCount: Number(attendeeData.passCount) || 1,
      totalPaid: Number(event.price) * (Number(attendeeData.passCount) || 1),
      bookingDate: bookingDate,
      checkedIn: false,
      checkInTime: null
    };

    const tickets = this.getAllTickets();
    tickets.unshift(ticket);
    this.saveTickets(tickets);

    return ticket;
  }

  /**
   * Render real scannable QR code into a DOM container using qrcode.js
   * @param {HTMLElement} containerEl - DOM container element
   * @param {Object} ticket - Ticket data object
   */
  static renderQRCode(containerEl, ticket) {
    if (!containerEl) return;
    containerEl.innerHTML = ""; // Clear existing

    // Payload formatted for quick gate verification
    const payload = JSON.stringify({
      app: "FestPass",
      id: ticket.ticketId,
      event: ticket.eventTitle,
      attendee: ticket.attendeeName,
      college: ticket.college,
      passes: ticket.passCount
    });

    if (typeof QRCode !== "undefined") {
      new QRCode(containerEl, {
        text: payload,
        width: 140,
        height: 140,
        colorDark: "#020617",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } else {
      // Fallback API if CDN delayed
      containerEl.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(payload)}" 
             alt="Ticket QR Code" style="width:140px; height:140px; border-radius:8px;" />
      `;
    }
  }

  /**
   * Gatekeeper Verification Station: Validate and Check-In
   * @param {string} rawTicketId - The ticket ID entered or scanned at the gate
   */
  static verifyAndCheckIn(rawTicketId) {
    const cleanId = rawTicketId.trim().toUpperCase().replace("#", "");
    const tickets = this.getAllTickets();
    const ticketIndex = tickets.findIndex(t => t.ticketId.toUpperCase() === cleanId);

    if (ticketIndex === -1) {
      return {
        status: "INVALID",
        message: `Ticket ID '${cleanId}' was not found in the verified database.`,
        ticket: null
      };
    }

    const ticket = tickets[ticketIndex];

    if (ticket.checkedIn) {
      return {
        status: "ALREADY_USED",
        message: `ALREADY SCANNED! This pass was checked in on ${ticket.checkInTime}. Duplicate entry prohibited.`,
        ticket: ticket
      };
    }

    // Mark as Checked In
    const checkInTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    ticket.checkedIn = true;
    ticket.checkInTime = checkInTime;
    tickets[ticketIndex] = ticket;
    this.saveTickets(tickets);

    return {
      status: "SUCCESS",
      message: `ENTRY GRANTED! Welcome ${ticket.attendeeName} from ${ticket.college}.`,
      ticket: ticket
    };
  }
}

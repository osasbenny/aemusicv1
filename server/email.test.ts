import { describe, expect, it } from "vitest";
import { sendEmail } from "./email";

describe("SMTP Email Configuration", () => {
  it("should validate SMTP credentials by sending a test email", async () => {
    // Test sending email with configured SMTP settings
    const result = await sendEmail({
      to: "admin@aemusic.chevwellconsulting.com", // Send to self for testing
      subject: "AE Music Lab - SMTP Test",
      html: "<p>This is a test email to verify SMTP configuration is working correctly.</p>",
      text: "This is a test email to verify SMTP configuration is working correctly.",
    });

    // Should return true if SMTP is configured and email sent successfully
    expect(result).toBe(true);
  }, 30000); // 30 second timeout for email sending
});

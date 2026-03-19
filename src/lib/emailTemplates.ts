export function generateQuoteEmailHtml(type: 'FLIGHT' | 'HOTEL' | 'CAR', title: string, subtitle: string, price: string, details: Record<string, string>): string {
  
  const detailsHtml = `
    <h3>${type} QUOTE: ${title}</h3>
    <p><em>${subtitle}</em></p>
    <h2 style="color: #d32f2f;">Total Price: $${price}</h2>
    <table style="width: 100%; text-align: left; border-collapse: collapse; margin-top: 10px;">
      ${Object.entries(details).map(([key, value]) => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0; font-weight: bold; color: #555; width: 40%;">${key}</td>
          <td style="padding: 8px 0; color: #222;">${value}</td>
        </tr>
      `).join('')}
    </table>
  `;

  return `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 600px;">
      <p>Hello,</p>
      <p>Thank you for choosing ASAP Tickets! Below is the price quote you requested.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0056b3; margin: 20px 0;">
        ${detailsHtml}
      </div>
      
      <p>If you are ready to proceed with booking or have any questions about this quote, please do not hesitate to reach out.</p>
      <br />
      <p>--</p>
      <p>Kind Regards,</p>
      <p><strong>Lupin.M | Advisor</strong></p>
      <p>Phone: +866 961 7260<br />
      E-mail: <a href="mailto:Lupin.m@asaptickets.com">Lupin.m@asaptickets.com</a></p>
      
      <p>
        <strong>ASAP Tickets is rated "Excellent"</strong><br />
        <a href="https://www.asaptickets.com/reviews" target="_blank" style="color: #0056b3;">trustpilot</a>
      </p>
      <p><em>Gold Medal, Customer Service, Travel<br />asap businessawards</em></p>
      
      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
      
      <p style="font-size: 11px; color: #777;">
        <strong>Confidentiality Notice:</strong> This message contains confidential information and is intended only for the named recipient(s). If you are not the addressee you may not copy, distribute or perform any other activities with this information. If you have received this transmission in error, please notify us by e-mail immediately. E-mail transmission cannot be guaranteed to be secure or error-free as information could be intercepted, corrupted, lost, destroyed, arrive late or incomplete, or contain viruses.
      </p>
    </div>
  `;
}

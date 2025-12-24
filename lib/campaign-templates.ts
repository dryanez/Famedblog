
export const getExamUrgency14Days = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #4f46e5; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
  .content { padding: 40px 30px; }
  .alert-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 4px; }
  .alert-text { color: #b45309; font-weight: 600; margin: 0; }
  .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>FaMED Exam Prep</h1>
    </div>
    <div class="content">
      <div class="alert-box">
        <p class="alert-text">⚠️ High Priority: ${data.daysUntilExam} Days Until Exam</p>
      </div>
      <p>Hi ${data.userName},</p>
      <p>We noticed your exam is scheduled for <strong>${new Date(data.examDate).toLocaleDateString()}</strong>. That is exactly <strong>${data.daysUntilExam} days</strong> from now.</p>
      <p>Typically, these last two weeks are where 80% of candidates make or break their grade. It's not about learning new things anymore—it's about pattern recognition and confidence.</p>
      <p><strong>Are you ready?</strong></p>
      <p>We have a specific "Final Sprint" module designed exactly for this timeframe.</p>
      <a href="https://famed-vorbereitung.com/pricing" class="btn">Access the Final Sprint</a>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getExamUrgencySpecialOffer = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #dc2626; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .content { padding: 40px 30px; }
  .highlight-box { background-color: #fef2f2; border: 2px dashed #dc2626; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0; }
  .price-old { text-decoration: line-through; color: #9ca3af; font-size: 18px; }
  .price-new { color: #dc2626; font-size: 32px; font-weight: 800; margin-left: 10px; }
  .timer { font-size: 14px; color: #ef4444; font-weight: 600; margin-top: 5px; text-transform: uppercase; }
  .btn { display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 18px; margin-top: 10px; width: 100%; text-align: center; box-sizing: border-box; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>LAST MINUTE EXAM RESCUE</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: 600;">Hi ${data.userName},</p>
      <p>Your exam is in less than 2 weeks. The pressure is on.</p>
      <p>We know you don't have time for full courses anymore. You need the <strong>highest yield</strong> information, fast. The cheatsheets, the must-know cases, and the simulation.</p>
      
      <div class="highlight-box">
        <p style="margin:0; font-weight:600; color:#7f1d1d;">SPECIAL "CRUNCH TIME" OFFER</p>
        <div style="margin: 10px 0;">
          <span class="price-old">€69.00</span>
          <span class="price-new">€19.99</span>
        </div>
        <a href="https://buy.stripe.com/9B64gAb4R2YV2sA8Vz7Re0o" class="btn">⚡ UNLOCK NOW - €19.99</a>
        <p class="timer">Offer Expires in 24 Hours</p>
      </div>

      <p><strong>What you get instantly:</strong></p>
      <ul style="padding-left: 20px; margin-bottom: 25px;">
        <li>✅ <strong>Rapid Review Cheatsheets</strong> (PDFs)</li>
        <li>✅ <strong>5 "Must-Know" Clinical Cases</strong></li>
        <li>✅ <strong>Interactive Exam Simulator</strong></li>
      </ul>
      <p>Don't risk your grade to save €20. Give yourself the best chance to pass.</p>
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://buy.stripe.com/9B64gAb4R2YV2sA8Vz7Re0o" style="color: #dc2626; font-weight: 600;">Get Instant Access &rarr;</a>
      </p>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getExamUrgency7Days = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #dc2626; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
  .content { padding: 40px 30px; }
  .btn { display: inline-block; background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>7 Days Left. Don't Panic.</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>This is it. The final week.</p>
      <p>Most students make the mistake of trying to cram <em>everything</em> in the last week. That leads to burnout and forgetting key information.</p>
      <p><strong>You need a strategy.</strong></p>
      <p>Our 7-Day Emergency Plan focuses only on the highest-yield topics that appear on 90% of exams. It's designed to maximize your points in minimum time.</p>
      <a href="https://famed-vorbereitung.com/pricing" class="btn">Get the 7-Day Plan</a>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getExamUrgency3Days = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #7c3aed; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
  .content { padding: 40px 30px; }
  .btn { display: inline-block; background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>72 Hours Remaining</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Relax. Take a deep breath.</p>
      <p>You have prepared for this. The next 3 days are about maintenance and mindset, not heavy lifting.</p>
      <p>We've prepared a <strong>Pre-Exam Checklist</strong> specifically for the FaMED exam to ensure you don't miss any small details on exam day.</p>
      <a href="https://famed-vorbereitung.com/checklist" class="btn">Download Checklist</a>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getWelcomeDay0 = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #2563eb; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
  .content { padding: 40px 30px; }
  .btn { display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>Welcome to FaMED Prep! 🩺</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Thanks for joining us! You've taken the first serious step towards passing your exam.</p>
      <p><strong>Here is what to do next:</strong></p>
      <ol>
        <li>Set your <strong>Exam Date</strong> in the dashboard (so we can build your plan).</li>
        <li>Take the <strong>Diagnostic Test</strong> to see where you stand.</li>
      </ol>
      <p>We are here to guide you every step of the way.</p>
      <a href="https://famed-vorbereitung.com/dashboard" class="btn">Go to Dashboard</a>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getSubscriptionExpiry = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #10b981; padding: 30px; text-align: center; }
  .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; }
  .content { padding: 40px 30px; }
  .btn { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="max-width: 150px; margin-bottom: 20px;">
      <h1>Don't Lose Your Progress</h1>
    </div>
    <div class="content">
      <p>Hi ${data.userName},</p>
      <p>Your Premium subscription is set to expire on <strong>${new Date(data.planExpiry).toLocaleDateString()}</strong>.</p>
      <p>To ensure uninterrupted access to all your study materials, progress tracking, and simulation exams, please renew your subscription today.</p>
      <a href="https://famed-vorbereitung.com/billing" class="btn">Renew Subscription</a>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

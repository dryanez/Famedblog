
export const getWelcomeBundlePromo = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
  .content { padding: 40px 30px; }
  .bundle-box { background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%); border: 3px solid #f59e0b; padding: 30px 20px; text-align: center; border-radius: 16px; margin: 30px 0; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
  .price-tag { color: #dc2626; font-size: 36px; font-weight: 900; margin: 15px 0; }
  .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 20px; margin-top: 20px; box-shadow: 0 6px 0 #047857; transition: all 0.2s; text-transform: uppercase; }
  .footer { background-color: #f9fafb; padding: 25px; text-align: center; font-size: 12px; color: #6b7280; }
  @media only screen and (max-width: 600px) {
    .bundle-images td { display: block !important; width: 100% !important; padding: 10px 0 !important; }
    .plus-sign { display: none !important; }
    .price-tag { font-size: 28px !important; }
    .btn { padding: 14px 30px !important; font-size: 16px !important; }
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 50px; width: auto;">
    </div>
    <div class="content">
      <h2 style="color: #7c3aed; text-align: center; font-size: 28px; margin: 0 0 30px 0;">🚀 Ready to Supercharge Your Preparation?</h2>
      
      <div class="bundle-box">
        <h2 style="color: #b91c1c; margin-top: 0; margin-bottom: 10px; font-size: 28px;">🎁 Special Bundle Offer</h2>
        <p style="margin: 5px 0 25px 0; color: #dc2626; font-size: 20px; font-weight: 800;">Book + App Bundle - Save 60%!</p>
        
        <!-- Visual Bundle Display - Mobile Optimized -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
          <tr>
            <td align="center">
              <table border="0" cellspacing="0" cellpadding="0" class="bundle-images">
                <tr>
                  <td align="center" valign="middle" style="padding: 10px;">
                    <img src="https://famed-vorbereitung.com/book%20mockup%20website%20german%20(1).png" alt="FaMED Protokoll Book" style="max-width: 140px; width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  </td>
                  <td align="center" valign="middle" class="plus-sign" style="padding: 0 15px;">
                    <span style="font-size: 48px; font-weight: 900; color: #dc2626;">+</span>
                  </td>
                  <td align="center" valign="middle" style="padding: 10px;">
                    <table border="0" cellspacing="0" cellpadding="0" style="background: white; border: 3px solid #4f46e5; border-radius: 12px; margin: 0 auto;">
                      <tr>
                        <td style="padding: 25px;">
                          <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED App" style="width: 90px; height: auto; display: block;">
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- What's Included -->
        <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: left;">
          <ul style="margin: 0; padding: 0; list-style: none;">
            <li style="margin: 10px 0; color: #374151; font-size: 16px;">✅ Complete FaMED Protokoll book</li>
            <li style="margin: 10px 0; color: #374151; font-size: 16px;">✅ FaMED App (3-Months access)</li>
            <li style="margin: 10px 0; color: #374151; font-size: 16px;">✅ Personalized 8-week study plan</li>
            <li style="margin: 10px 0; color: #374151; font-size: 16px;">✅ Private community access</li>
            <li style="margin: 10px 0; color: #374151; font-size: 16px;">✅ Email support</li>
          </ul>
        </div>
        
        <!-- Pricing -->
        <div style="margin: 25px 0;">
          <p style="margin: 0; color: #6b7280; font-size: 16px; text-decoration: line-through;">Regular Price: €149.98</p>
          <div class="price-tag" style="margin: 10px 0;">€59.99</div>
          <p style="margin: 0; color: #059669; font-size: 18px; font-weight: 700;">You Save €89.99 (60% OFF!)</p>
        </div>

        <a href="https://buy.stripe.com/14A14o7SF0QN0ks9ZD7Re0t" class="btn">🎯 JETZT KAUFEN →</a>
        
        <p style="margin-top: 15px; font-size: 14px;">
          <a href="https://famedtestprep.com/upgrade" style="color: #6b7280; text-decoration: underline;">Want to learn more? View full pricing details →</a>
        </p>
      </div>

      <p style="font-size: 18px; font-weight: 700; color: #7c3aed; text-align: center; margin-top: 30px;">🚀 Most students who get the bundle pass on their first try!</p>
      
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://buy.stripe.com/14A14o7SF0QN0ks9ZD7Re0t" style="color: #dc2626; font-weight: 600; font-size: 18px;">Click Here to Get Started →</a>
      </p>
      
      <p style="margin-top: 30px; font-size: 16px; line-height: 1.8;">
        Viel Erfolg,<br>
        <strong>The FaMED-Vorbereitung Team</strong>
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} FaMED-Vorbereitung. All rights reserved.</p>
      <p style="margin: 5px 0;">You received this email because you signed up for FaMED.</p>
    </div>
  </div>
</body>
</html>
`;

export const getTextWelcomeBundlePromo = (data: any) => `Hi ${data.userName},

Welcome to FaMED-Vorbereitung! We're excited to help you pass your exam with confidence.

🎁 SPECIAL BUNDLE OFFER - SAVE 60%!

Book + App Bundle - Everything You Need to Pass!

What's Included:
✅ Complete FaMED Protokoll book
✅ FaMED App (3-Months access)
✅ Personalized 8-week study plan
✅ Private community access
✅ Email support

PRICING:
Regular Price: €149.98
Special Price: €59.99
YOU SAVE: €89.99 (60% OFF!)

Get the Complete Bundle Now: https://buy.stripe.com/14A14o7SF0QN0ks9ZD7Re0t

Want to learn more? View full pricing details: https://famedtestprep.com/upgrade

🚀 Most students who get the bundle pass on their first try!

Viel Erfolg,
The FaMED-Vorbereitung Team
`;

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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; vertical-align: middle;">FaMED Exam Prep</span>
          </td>
        </tr>
      </table>
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

export const getTextExamUrgency14Days = (data: any) => `Hi ${data.userName},

We noticed your exam is scheduled for ${new Date(data.examDate).toLocaleDateString()}. That is exactly ${data.daysUntilExam} days from now.

Typically, these last two weeks are where 80% of candidates make or break their grade. It's not about learning new things anymore—it's about pattern recognition and confidence.

Are you ready?
We have a specific "Final Sprint" module designed exactly for this timeframe.

Access the Final Sprint: https://famed-vorbereitung.com/pricing
`;

// ... existing 2-week special code ...
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; vertical-align: middle;">LAST MINUTE EXAM RESCUE</span>
          </td>
        </tr>
      </table>
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

export const getTextExamUrgencySpecialOffer = (data: any) => `Hi ${data.userName},

Your exam is in less than 2 weeks. The pressure is on.
We know you don't have time for full courses anymore. You need the highest yield information, fast.

SPECIAL "CRUNCH TIME" OFFER
Price: €19.99 (was €69.00)
Offer Expires in 24 Hours

What you get instantly:
- Rapid Review Cheatsheets (PDFs)
- 5 "Must-Know" Clinical Cases
- Interactive Exam Simulator

Don't risk your grade to save €20. Give yourself the best chance to pass.

Get Instant Access: https://buy.stripe.com/9B64gAb4R2YV2sA8Vz7Re0o
`;

export const getExamUrgency1WeekSpecial = (data: any) => `
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; vertical-align: middle;">LAST MINUTE EXAM RESCUE</span>
          </td>
        </tr>
      </table>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: 600;">Hi ${data.userName},</p>
      <p>Your exam is in less than 1 week. This is it.</p>
      <p>The last week is about <strong>simulation</strong> – experiencing the test exactly as it will be on exam day. 1-hour full test simulations by sections. Practice until the real exam feels like routine.</p>
      
      <div class="highlight-box">
        <p style="margin:0; font-weight:600; color:#7f1d1d;">SPECIAL "FINAL WEEK" OFFER</p>
        <div style="margin: 10px 0;">
            <span class="price-old">€69.00</span>
            <span class="price-new">€9.99</span>
        </div>
        <a href="https://buy.stripe.com/fZudRafl7gPL5EM9ZD7Re0u" class="btn">⚡ UNLOCK NOW - €9.99</a>
        <p class="timer">Offer Expires in 24 Hours</p>
      </div>

      <p><strong>What you get instantly:</strong></p>
      <ul style="padding-left: 20px; margin-bottom: 25px;">
        <li>✅ <strong>Full 1:1 Test Simulation</strong> (Exactly like the real exam)</li>
        <li>✅ <strong>1-Hour Section Practice</strong> (By topic)</li>
        <li>✅ <strong>Complete Exam Day Preparation</strong></li>
      </ul>
      <p>Don't walk into the exam unprepared. Practice like it's the real thing.</p>
      <p style="text-align: center; margin-top: 30px;">
        <a href="https://buy.stripe.com/fZudRafl7gPL5EM9ZD7Re0u" style="color: #dc2626; font-weight: 600;">Get Instant Access &rarr;</a>
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

export const getTextExamUrgency1WeekSpecial = (data: any) => `Hi ${data.userName},

Your exam is in less than 1 week. This is it.

The last week is about simulation – experiencing the test exactly as it will be on exam day. 1-hour full test simulations by sections. Practice until the real exam feels like routine.

SPECIAL "FINAL WEEK" OFFER
Price: €9.99 (was €69.00)
Offer Expires in 24 Hours

What you get instantly:
- Full 1:1 Test Simulation (Exactly like the real exam)
- 1-Hour Section Practice (By topic)
- Complete Exam Day Preparation

Don't walk into the exam unprepared. Practice like it's the real thing.

Get Instant Access: https://buy.stripe.com/fZudRafl7gPL5EM9ZD7Re0u
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; vertical-align: middle;">7 Days Left. Don't Panic.</span>
          </td>
        </tr>
      </table>
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

export const getTextExamUrgency7Days = (data: any) => `Hi ${data.userName},

This is it. The final week.
Most students make the mistake of trying to cram everything in the last week. That leads to burnout.

You need a strategy.
Our 7-Day Emergency Plan focuses only on the highest-yield topics that appear on 90% of exams.

Get the 7-Day Plan: https://famed-vorbereitung.com/pricing
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; vertical-align: middle;">72 Hours Remaining</span>
          </td>
        </tr>
      </table>
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

export const getTextExamUrgency3Days = (data: any) => `Hi ${data.userName},

Relax. Take a deep breath.
You have prepared for this. The next 3 days are about maintenance and mindset, not heavy lifting.

We've prepared a Pre-Exam Checklist specifically for the FaMED exam to ensure you don't miss any small details on exam day.

Download Checklist: https://famed-vorbereitung.com/checklist
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; vertical-align: middle;">Welcome to FaMED Prep! 🩺</span>
          </td>
        </tr>
      </table>
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

export const getTextWelcomeDay0 = (data: any) => `Hi ${data.userName},

Thanks for joining us! You've taken the first serious step towards passing your exam.

Here is what to do next:
1. Set your Exam Date in the dashboard.
2. Take the Diagnostic Test to see where you stand.

We are here to guide you every step of the way.

Go to Dashboard: https://famed-vorbereitung.com/dashboard
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
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 60px; width: auto; vertical-align: middle; margin-right: 20px;">
            <span style="font-size: 24px; font-weight: 700; color: #ffffff; vertical-align: middle;">Don't Lose Your Progress</span>
          </td>
        </tr>
      </table>
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

export const getTextSubscriptionExpiry = (data: any) => `Hi ${data.userName},

Your Premium subscription is set to expire on ${new Date(data.planExpiry).toLocaleDateString()}.

To ensure uninterrupted access to all your study materials, progress tracking, and simulation exams, please renew your subscription today.


Renew Subscription: https://famed-vorbereitung.com/billing
`;

export const getHolidaySpecial = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0fdf4; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .header { background-color: #15803d; padding: 30px; text-align: center; background-image: linear-gradient(135deg, #15803d 25%, #16a34a 25%, #16a34a 50%, #15803d 50%, #15803d 75%, #16a34a 75%, #16a34a 100%); background-size: 20px 20px; }
  .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  .content { padding: 40px 30px; }
  .gift-box { background-color: #fef2f2; border: 2px dashed #dc2626; padding: 25px; text-align: center; border-radius: 12px; margin: 25px 0; position: relative; }
  .gift-tag { background-color: #dc2626; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; position: absolute; top: -15px; left: 50%; transform: translateX(-50%); }
  .price-old { text-decoration: line-through; color: #9ca3af; font-size: 18px; }
  .price-new { color: #dc2626; font-size: 36px; font-weight: 800; margin-left: 10px; }
  .btn { display: inline-block; background-color: #dc2626; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 20px; margin-top: 15px; width: 100%; text-align: center; box-sizing: border-box; box-shadow: 0 4px 0 #991b1b; transition: all 0.2s; }
  .btn:hover { background-color: #b91c1c; transform: translateY(2px); box-shadow: 0 2px 0 #991b1b; }
  .footer { background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
  .bonus-item { display: flex; align-items: center; justify-content: center; margin-top: 15px; background: white; padding: 10px; border-radius: 8px; font-weight: 600; color: #15803d; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
             <div style="font-size: 48px; margin-bottom: 10px;">🎄</div>
             <h1 style="color: #ffffff; margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">HOLIDAY SPECIAL</h1>
          </td>
        </tr>
      </table>
    </div>
    <div class="content">
      <p style="font-size: 18px;">Hi ${data.userName},</p>
      <p>The holidays are here, and at FaMED, we want to give you the gift of <strong>passing your exam</strong>.</p>
      
      <div class="gift-box">
        <div class="gift-tag">LIMITED TIME OFFER 🎁</div>
        <h2 style="color: #15803d; margin-top: 10px; margin-bottom: 5px;">50% OFF EVERYTHING</h2>
        <p style="margin: 0; color: #6b7280;">Any Subscription Plan</p>
        
        <div class="bonus-item">
          <span style="font-size: 24px; margin-right: 10px;">📚</span>
          PLUS: Free "Protokoll 2006" Book
        </div>

        <a href="https://famedtestprep.com/HolidaySpecial" class="btn">CLAIM MY GIFT 🎁</a>
        <p style="font-size: 12px; color: #ef4444; margin-top: 15px;">*Offer expires soon!</p>
      </div>

      <p><strong>This package gives you:</strong></p>
      <ul style="padding-left: 20px; color: #374151;">
        <li>✅ Full Access to 2,000+ Exam Questions</li>
        <li>✅ The "Protokoll 2006" Book (Physical Copy!)</li>
        <li>✅ Performance Tracking Dashboard</li>
      </ul>
      
      <p>Prepare smarter in 2026.</p>
    </div>
    <div class="footer">
      <p>© 2025 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getTextHolidaySpecial = (data: any) => `Hi ${data.userName},

🎄 HOLIDAY SPECIAL: 50% OFF + FREE BOOK 🎁

The holidays are here, and we want to give you the gift of passing your exam.

For a limited time, get:
- 50% OFF any subscription plan
- PLUS: A Free copy of the "Protokoll 2006" Book

This package includes full access to 2,000+ exam questions and our advanced performance dashboard.

Claim your gift now: https://famedtestprep.com/HolidaySpecial

Prepare smarter in 2026.

--
FaMED Vorbereitung
`;

export const getNewYearSpecial = (data: any) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; position: relative; overflow: hidden; }
  .header::before { content: '✨'; position: absolute; top: 10px; left: 20px; font-size: 30px; animation: sparkle 2s infinite; }
  .header::after { content: '🎉'; position: absolute; top: 10px; right: 20px; font-size: 30px; animation: sparkle 2s infinite 1s; }
  @keyframes sparkle { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
  .header h1 { color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; text-shadow: 0 3px 6px rgba(0,0,0,0.3); letter-spacing: 1px; }
  .content { padding: 40px 30px; }
  .offer-box { background: linear-gradient(135deg, #fef2f2 0%, #fff7ed 100%); border: 3px solid #f59e0b; padding: 30px; text-align: center; border-radius: 16px; margin: 30px 0; position: relative; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2); }
  .last-day-badge { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 8px 20px; border-radius: 25px; font-weight: 800; position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3); }
  .price-old { text-decoration: line-through; color: #9ca3af; font-size: 20px; }
  .price-new { color: #dc2626; font-size: 42px; font-weight: 900; margin-left: 15px; text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2); }
  .btn { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 18px 40px; text-decoration: none; border-radius: 10px; font-weight: 800; font-size: 22px; margin-top: 20px; width: 100%; text-align: center; box-sizing: border-box; box-shadow: 0 6px 0 #047857; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.5px; }
  .btn:hover { background: linear-gradient(135deg, #059669 0%, #047857 100%); transform: translateY(3px); box-shadow: 0 3px 0 #047857; }
  .footer { background-color: #f9fafb; padding: 25px; text-align: center; font-size: 12px; color: #6b7280; }
  .bonus-item { display: flex; align-items: center; justify-content: center; margin-top: 20px; background: white; padding: 15px; border-radius: 10px; font-weight: 700; color: #7c3aed; font-size: 18px; box-shadow: 0 2px 6px rgba(124, 58, 237, 0.1); }
  .motivational { background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 20px; border-radius: 10px; margin: 25px 0; text-align: center; border-left: 4px solid #3b82f6; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
             <img src="https://famed-vorbereitung.com/logo.png" alt="FaMED Logo" style="height: 50px; width: auto; vertical-align: middle; margin-bottom: 20px;">
             <h1 style="color: #ffffff; margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">HAPPY NEW YEAR!</h1>
             <p style="color: #e0e7ff; margin-top: 10px; font-size: 18px; font-weight: 600;">Start 2026 Right - Pass Your FaMED Exam!</p>
          </td>
        </tr>
      </table>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: 600;">Hi ${data.userName},</p>
      <p style="font-size: 16px; line-height: 1.8;">Happy New Year! 🥳 We hope 2026 brings you success, and we want to help make that happen.</p>
      
      <div class="motivational">
        <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1e40af;">💪 Start the Year Right - Study Smart. Pass the Test!</p>
        <p style="margin: 10px 0 0 0; color: #475569; font-size: 14px;">This is YOUR year to succeed. Let's make it count.</p>
      </div>
      
      <div class="offer-box">
        <div class="last-day-badge">⚡ LAST DAY OFFER ⚡</div>
        <h2 style="color: #b91c1c; margin-top: 20px; margin-bottom: 10px; font-size: 28px;">50% OFF EVERYTHING</h2>
        <p style="margin: 5px 0; color: #6b7280; font-size: 16px;">Any Subscription Plan</p>
        
        <div class="bonus-item">
          <span style="font-size: 28px; margin-right: 12px;">📚</span>
          PLUS: Free "Protokoll 2006" Book
        </div>

        <a href="https://famedtestprep.com/HolidaySpecial" class="btn">🎁 CLAIM MY NEW YEAR GIFT 🎁</a>
        <p style="font-size: 13px; color: #ef4444; margin-top: 20px; font-weight: 700;">⏰ Offer ends TONIGHT at midnight!</p>
      </div>

      <p><strong>This package gives you:</strong></p>
      <ul style="padding-left: 20px; color: #374151;">
        <li>✅ Full Simulation of the Test</li>
        <li>✅ Gratis eBook - The "Protokoll 2006" Book</li>
        <li>✅ Full Access to All 76 Official Cases</li>
        <li>✅ Performance Tracking Dashboard</li>
      </ul>
      
      <p style="font-size: 18px; font-weight: 700; color: #7c3aed; text-align: center; margin-top: 30px;">🚀 Make 2026 YOUR breakthrough year!</p>
      <p style="text-align: center; color: #6b7280;">Don't let this opportunity pass. Your future self will thank you.</p>
    </div>
    <div class="footer">
      <p>© 2026 FaMED Vorbereitung. All rights reserved.</p>
      <p><a href="#" style="color: #6b7280;">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`;

export const getTextNewYearSpecial = (data: any) => `Hi ${data.userName},

🎉 HAPPY NEW YEAR! Start 2026 Right - Pass Your FaMED Exam!

Happy New Year! We hope 2026 brings you success, and we want to help make that happen.

💪 Start the Year Right - Study Smart. Pass the Test!

⚡ LAST DAY OFFER ⚡
50% OFF EVERYTHING + FREE BOOK

For TODAY ONLY, get:
- 50% OFF any subscription plan
- PLUS: Gratis eBook - The "Protokoll 2006" Book

This package includes:
✅ Full Simulation of the Test
✅ Gratis eBook - The "Protokoll 2006" Book
✅ Full Access to All 76 Official Cases
✅ Performance Tracking Dashboard

⏰ Offer ends TONIGHT at midnight!

Claim your New Year gift now: https://famedtestprep.com/HolidaySpecial

🚀 Make 2026 YOUR breakthrough year!

--
FaMED Vorbereitung
`;


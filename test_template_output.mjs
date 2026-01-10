import { getExamUrgency1WeekSpecial } from './lib/campaign-templates.js';

const sampleData = {
    userName: 'Dr. Maria Schmidt',
    userEmail: 'test@example.com',
    examDate: '2026-01-15',
    daysUntilExam: 7,
    planExpiry: '2026-02-01',
    accountType: 'free'
};

const output = getExamUrgency1WeekSpecial(sampleData);
console.log('First 500 chars:');
console.log(output.substring(0, 500));
console.log('\n...Has container class:', output.includes('class="container"'));
console.log('Has header styling:', output.includes('background-color: #dc2626'));
console.log('Has PayPal link:', output.includes('paypal.com'));

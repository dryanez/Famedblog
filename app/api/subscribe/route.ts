import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        // TODO: Integrate with your email service (Mailchimp, ConvertKit, etc.)
        // For now, just log it
        console.log('New subscriber:', { email, name });

        // You can add email service integration here
        // Example with Mailchimp:
        // const response = await fetch('https://us1.api.mailchimp.com/3.0/lists/YOUR_LIST_ID/members', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     email_address: email,
        //     status: 'subscribed',
        //     merge_fields: {
        //       FNAME: name.split(' ')[0],
        //       LNAME: name.split(' ').slice(1).join(' '),
        //     },
        //   }),
        // });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}

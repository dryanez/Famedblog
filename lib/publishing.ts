/** Database drafts are an editorial queue; public pages are built from paired Markdown. */
export async function publishScheduledPosts() {
 return {success:false,published:[] as string[],totalFound:0,error:'Database-only publication is disabled. Export reviewed English/Arabic Markdown, commit it and run node scripts/release-blog.mjs --deploy --promote; publication requires verified live URLs.'};
}

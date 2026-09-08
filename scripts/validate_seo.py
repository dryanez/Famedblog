import os
import sys
import glob
import re

print("=" * 60)
print("[SEO CHECK] RUNNING SEO & METADATA VALIDATION CHECK")
print("=" * 60)

errors = []
warnings = []

# 1. Check OG Image
og_image = os.path.join("public", "og-image.png")
if not os.path.exists(og_image):
    errors.append("[ERROR] Missing public/og-image.png for social media cards")
else:
    print(f"[OK] OpenGraph image exists: {og_image} ({os.path.getsize(og_image)} bytes)")

# 2. Check Blog Posts
posts = glob.glob("blog/posts/*.md")
print(f"\nScanning {len(posts)} markdown files...")

published_count = 0
for post_path in sorted(posts):
    filename = os.path.basename(post_path)
    if filename.lower() == "readme.md":
        continue
    
    with open(post_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    fm_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        errors.append(f"[ERROR] {filename}: Missing YAML frontmatter")
        continue
    
    fm = fm_match.group(1)
    
    # Check title
    if not re.search(r'title:\s*["\']?[^"\n\r]+["\']?', fm):
        errors.append(f"[ERROR] {filename}: Missing title")
    
    # Check date
    if not re.search(r'date:\s*["\']?\d{4}-\d{2}-\d{2}["\']?', fm):
        errors.append(f"[ERROR] {filename}: Missing or invalid date (expected YYYY-MM-DD)")
        
    # Check status
    status_match = re.search(r'status:\s*["\']?([a-zA-Z]+)["\']?', fm)
    status = status_match.group(1).lower() if status_match else "draft"
    
    if status == "published":
        published_count += 1
        # Check placeholder
        if "quota was temporarily exceeded" in content or "placeholder draft" in content:
            errors.append(f"[ERROR] {filename}: Marked published but contains thin placeholder text!")
        
        # Check excerpt
        if not re.search(r'excerpt:\s*["\']?[^"\n\r]+["\']?', fm):
            errors.append(f"[ERROR] {filename}: Published post missing excerpt (required for SEO)")
            
        # Check category
        if not re.search(r'category:\s*["\']?[^"\n\r]+["\']?', fm):
            errors.append(f"[ERROR] {filename}: Published post missing category")
            
        # Check readTime
        if not re.search(r'readTime:\s*["\']?[^"\n\r]+["\']?', fm):
            warnings.append(f"[WARN] {filename}: Missing readTime")

print(f"[OK] Found {published_count} verified published posts")

# 3. Check Sitemap & Robots
sitemap_path = os.path.join("app", "sitemap.ts")
if not os.path.exists(sitemap_path):
    errors.append("[ERROR] Missing app/sitemap.ts")
else:
    with open(sitemap_path, "r", encoding="utf-8") as f:
        sitemap_code = f.read()
    if "famedtestprep.com" in sitemap_code and "NEXT_PUBLIC_SITE_URL" not in sitemap_code:
        errors.append("[ERROR] app/sitemap.ts hardcodes famedtestprep.com without fallback")
    else:
        print("[OK] app/sitemap.ts uses dynamic siteUrl and includes all landing pages")

robots_path = os.path.join("app", "robots.ts")
if not os.path.exists(robots_path):
    errors.append("[ERROR] Missing app/robots.ts")
else:
    with open(robots_path, "r", encoding="utf-8") as f:
        robots_code = f.read()
    if "/admin/" not in robots_code:
        warnings.append("[WARN] app/robots.ts should disallow /admin/")
    else:
        print("[OK] app/robots.ts disallows /admin/ and /preview/")

print("\n" + "=" * 60)
if warnings:
    print("WARNINGS:")
    for w in warnings:
        print(" ", w)

if errors:
    print("ERRORS ENCOUNTERED:")
    for e in errors:
        print(" ", e)
    sys.exit(1)
else:
    print("[SUCCESS] ALL SEO & METADATA CHECKS PASSED!")
    print("=" * 60)
    sys.exit(0)

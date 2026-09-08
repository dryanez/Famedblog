#!/bin/bash

# FaMED Blog Automation - Cron Job Setup Script
# This script sets up daily automation for blog posting

echo "🤖 Setting up FaMED Blog Automation..."
echo "======================================"

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PYTHON_SCRIPT="$SCRIPT_DIR/blog_automation_agent.py"
LOG_FILE="/tmp/famed_blog_automation.log"

# Check if Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "❌ Error: blog_automation_agent.py not found!"
    exit 1
fi

# Make Python script execute able
chmod +x "$PYTHON_SCRIPT"

# Create cron job
CRON_COMMAND="0 9 * * * cd \"$SCRIPT_DIR\" && /usr/bin/python3 \"$PYTHON_SCRIPT\" >> \"$LOG_FILE\" 2>&1"

# Check if cron job already exists
(crontab -l 2>/dev/null | grep -q "blog_automation_agent.py") && {
    echo "ℹ️  Cron job already exists. Removing old one..."
    crontab -l | grep -v "blog_automation_agent.py" | crontab -
}

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

echo ""
echo "✅ Cron job created successfully!"
echo ""
echo "📋 Details:"
echo "   - Script: $PYTHON_SCRIPT"
echo "   - Schedule: Every day at 9:00 AM"
echo "   - Log file: $LOG_FILE"
echo ""
echo "🔍 View installed cron jobs:"
echo "   crontab -l"
echo ""
echo "📝 View automation logs:"
echo "   tail -f $LOG_FILE"
echo ""
echo "🧪 Test automation manually:"
echo "   python3 $PYTHON_SCRIPT"
echo ""
echo "======================================"
echo "✅ Setup complete!"

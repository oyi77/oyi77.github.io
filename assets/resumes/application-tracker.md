# Job Application Tracker

**Purpose**: Track all job applications, interviews, and offers  
**Created**: 2025-12-24  
**Instructions**: Copy this to Google Sheets or Excel

---

## SPREADSHEET STRUCTURE

### Sheet 1: Applications

| Date Applied | Company | Position | Application URL | Status | Recruiter Contact | Next Action | Follow-up Date | Salary Range | Remote Policy | Referral Source | Notes |
|--------------|---------|----------|-----------------|--------|-------------------|-------------|----------------|--------------|---------------|-----------------|-------|
| 2025-12-24 | Coinbase | Senior Backend Engineer | https://... | Applied | | Follow up | 2025-12-31 | $120K-$180K | Remote-first | Direct | Applied via careers page |
| 2025-12-24 | Kraken | Software Engineer | https://... | Applied | | Follow up | 2025-12-31 | $100K-$150K | Remote-first | Direct | |
| | | | | | | | | | | | |

**Status Options**:
- Applied
- Screening Call
- Technical Interview
- Final Round
- Offer
- Rejected
- Withdrawn

---

### Sheet 2: Weekly Metrics

| Week Starting | Applications Submitted | Responses Received | Response Rate | Interviews | Offers | Notes |
|---------------|------------------------|-------------------|---------------|------------|--------|-------|
| 2025-12-23 | 7 | 1 | 14% | 0 | 0 | First week |
| 2025-12-30 | 5 | 2 | 40% | 1 | 0 | |
| | | | | | | |

**Formulas**:
- Response Rate = (Responses Received / Applications Submitted) * 100
- Interview Rate = (Interviews / Responses Received) * 100
- Offer Rate = (Offers / Interviews) * 100

---

### Sheet 3: Company Research

| Company | Tier | Industry | Size | Remote Policy | Tech Stack | Glassdoor Rating | Why Target | Application Status | Notes |
|---------|------|----------|------|---------------|------------|------------------|------------|-------------------|-------|
| Coinbase | 1 | Crypto | 3000+ | Remote-first | Python, Go, React | 3.9 | Crypto experience match | Applied | |
| Kraken | 1 | Crypto | 2000+ | Remote-first | Python, Rust | 4.1 | Trading platform exp | Applied | |
| GitLab | 1 | DevTools | 2000+ | Fully remote | Ruby, Go, Vue | 4.3 | Remote culture | Not yet | |

**Tier Definitions**:
- Tier 1: Remote-First Companies (Highest Priority)
- Tier 2: Remote-Friendly Companies
- Tier 3: SEA Tech Hubs

---

### Sheet 4: Interview Prep

| Company | Position | Interview Date | Interview Type | Interviewer | Prep Notes | Questions Asked | Follow-up Sent | Result |
|---------|----------|----------------|----------------|-------------|------------|-----------------|----------------|--------|
| Coinbase | Senior BE | 2026-01-05 | Technical | John Doe | Review system design | | No | |
| | | | | | | | | |

**Interview Types**:
- Screening Call
- Technical Phone Screen
- Coding Challenge
- System Design
- Behavioral
- Final Round
- Team Fit

---

### Sheet 5: Networking

| Date | Contact Name | Company | Position | Connection Type | Platform | Status | Next Action | Notes |
|------|--------------|---------|----------|-----------------|----------|--------|-------------|-------|
| 2025-12-24 | Jane Smith | Coinbase | Recruiter | Cold outreach | LinkedIn | Connected | Send message | |
| 2025-12-24 | Bob Johnson | Kraken | Engineer | Alumni | LinkedIn | Pending | Wait for accept | ITS Surabaya |

**Connection Types**:
- Cold outreach
- Alumni
- Referral
- Mutual connection
- Event/Conference
- Online community

---

### Sheet 6: Offers

| Company | Position | Base Salary | Equity | Bonus | Benefits | Total Comp | Deadline | Decision | Notes |
|---------|----------|-------------|--------|-------|----------|------------|----------|----------|-------|
| | | | | | | | | | |

**Decision Options**:
- Accepted
- Declined
- Negotiating
- Pending

---

## GOOGLE SHEETS SETUP

### Step 1: Create New Spreadsheet
1. Go to Google Sheets
2. Create new spreadsheet
3. Name it "Job Search Tracker 2025"

### Step 2: Create Sheets
1. Rename Sheet1 to "Applications"
2. Add new sheets: "Weekly Metrics", "Company Research", "Interview Prep", "Networking", "Offers"

### Step 3: Format Headers
1. Bold all header rows
2. Freeze header rows (View > Freeze > 1 row)
3. Add filters (Data > Create a filter)
4. Color-code headers (light blue background)

### Step 4: Add Data Validation
1. Status column: Create dropdown with status options
2. Tier column: Create dropdown (1, 2, 3)
3. Remote Policy: Create dropdown (Remote-first, Remote-friendly, Hybrid, Office)

### Step 5: Add Conditional Formatting
1. Status = "Offer": Green background
2. Status = "Rejected": Red background
3. Status = "Interview": Yellow background
4. Follow-up Date < TODAY(): Orange background (overdue)

### Step 6: Create Charts
1. Weekly Metrics: Line chart showing applications over time
2. Status Distribution: Pie chart of application statuses
3. Response Rate Trend: Line chart of response rate over time

---

## TRACKING WORKFLOW

### Daily (5 minutes)
- [ ] Log new applications
- [ ] Update statuses
- [ ] Check for responses
- [ ] Schedule follow-ups

### Weekly (30 minutes)
- [ ] Review metrics
- [ ] Calculate response rates
- [ ] Identify patterns (what's working)
- [ ] Plan next week's applications
- [ ] Follow up on pending applications

### Monthly (1 hour)
- [ ] Analyze overall progress
- [ ] Adjust strategy based on data
- [ ] Update resume if needed
- [ ] Review and refine target companies

---

## KEY METRICS TO TRACK

### Application Metrics
- **Total Applications**: Target 50+ in 8 weeks
- **Weekly Applications**: Target 5-7 per week
- **Response Rate**: Target >10% (industry average 5-10%)
- **Interview Rate**: Target >20% of responses
- **Offer Rate**: Target >30% of final rounds

### Time Metrics
- **Time to First Response**: Average days from application to response
- **Time to Interview**: Average days from application to interview
- **Time to Offer**: Average days from application to offer

### Quality Metrics
- **Tier 1 Applications**: % of applications to top-tier companies
- **Customization Rate**: % of applications with customized cover letters
- **Referral Rate**: % of applications with referrals

---

## SAMPLE DATA (Week 1)

```
Date Applied: 2025-12-24
Company: Coinbase
Position: Senior Backend Engineer
Application URL: https://www.coinbase.com/careers/positions/5678
Status: Applied
Recruiter Contact: 
Next Action: Follow up in 7 days
Follow-up Date: 2025-12-31
Salary Range: $120K-$180K
Remote Policy: Remote-first
Referral Source: Direct application
Notes: Applied via careers page, emphasized crypto mining and trading experience

---

Date Applied: 2025-12-24
Company: Kraken
Position: Software Engineer, Trading Systems
Application URL: https://www.kraken.com/careers/5432
Status: Applied
Recruiter Contact:
Next Action: Follow up in 7 days
Follow-up Date: 2025-12-31
Salary Range: $100K-$150K
Remote Policy: Remote-first
Referral Source: Direct application
Notes: Highlighted AiTradePulse 90%+ win rate and low-latency execution
```

---

## FOLLOW-UP TEMPLATES

### 1 Week Follow-Up
```
Subject: Following up on [Position] application

Hi [Recruiter Name / Hiring Team],

I wanted to follow up on my application for the [Position] role submitted on [Date]. I'm very excited about the opportunity to contribute to [Company] and believe my experience with [relevant skill/project] would be a great fit.

I'd love to discuss how my background in [specific area] aligns with your needs. Would you be available for a brief call?

Thank you for your consideration!

Best regards,
Muchammad Fikri Izzuddin
https://oyi77.github.io
```

### 2 Week Follow-Up
```
Subject: Re: [Position] application - Still interested

Hi [Recruiter Name],

I hope this email finds you well. I wanted to reach out again regarding my application for the [Position] role.

I remain very interested in joining [Company] and would welcome the opportunity to discuss how my [specific achievement] could contribute to your team.

Please let me know if there's any additional information I can provide.

Best regards,
Fikri
```

---

## TIPS FOR SUCCESS

### Application Best Practices
1. **Customize Everything**: Tailor resume and cover letter for each application
2. **Apply Early**: Apply within 24-48 hours of job posting
3. **Follow Up**: Send polite follow-up after 1 week
4. **Track Everything**: Log every application immediately
5. **Quality > Quantity**: Better to send 5 great applications than 20 mediocre ones

### Networking Best Practices
1. **Connect Before Applying**: Connect with recruiters/employees before applying
2. **Personalize Messages**: Reference specific projects or interests
3. **Provide Value**: Share insights, help others, engage authentically
4. **Follow Up**: Thank people for connections and conversations
5. **Build Relationships**: Network is for long-term, not just job search

### Interview Best Practices
1. **Prepare Stories**: Have 10 STAR stories ready
2. **Research Company**: Know products, culture, recent news
3. **Ask Questions**: Show genuine interest and curiosity
4. **Follow Up**: Send thank-you email within 24 hours
5. **Track Feedback**: Note questions asked and feedback received

---

## NEXT STEPS

1. **Create Spreadsheet** (15 minutes)
   - Set up Google Sheets with all tabs
   - Add headers and formatting
   - Create dropdowns and validation

2. **Add Target Companies** (30 minutes)
   - Copy 25 companies from OpenSpec
   - Add to "Company Research" sheet
   - Prioritize by tier

3. **Start Tracking** (5 minutes/day)
   - Log applications as you submit
   - Update statuses daily
   - Review metrics weekly

4. **Share Access** (optional)
   - Share with accountability partner
   - Share with career coach
   - Keep private from current employer

---

**Ready to start tracking?** Create your spreadsheet now! 📊

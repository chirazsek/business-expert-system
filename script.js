// ══════════════════════════════════════════
//  State — all 20 fields with defaults
// ══════════════════════════════════════════
const F = {
    unemployment_rate: 'medium',
    seasonal_business: 'no',
    backup_strategy: 'yes',
    same_type: 'yes',
    online_reviews_competitors: 'good',
    local_trend: 'growing',
    pop_density: 'medium',
    near_university: 'no',
    tourism_area: 'no',
    area_development: 'no',
    near_transport: 'yes',
    security: 'medium',
    uvp: 'yes',
    biz_edu: 'no',
};

async function printReport() {
    const { jsPDF } = window.jspdf;

    const getVIPAdvice = (score) => {
        if (score <= 10) return ["IMMEDIATE PIVOT: Current model shows critical failure risks.", "LEAN START: Reduce all overhead; consider a home-based version first.", "MARKET RESEARCH: Re-validate demand before spending any capital."];
        if (score <= 20) return ["COST CUTTING: Break-even is too high; find a cheaper location.", "REVENUE STREAMS: Add 2+ secondary services to stabilize cash flow.", "COMPETITOR ANALYSIS: Study why others are failing in this zone."];
        if (score <= 30) return ["SECURITY UPGRADE: Invest in better insurance or surveillance.", "BUFFER BUILDING: Do not launch until you have 8 months of reserve.", "NICHE FOCUS: Stop trying to serve everyone; pick one specific target."];
        if (score <= 40) return ["MARKETING PUSH: Your visibility is low; plan a heavy digital launch.", "PARTNERSHIP: Find a local partner to share the operational risk.", "PROTOTYPING: Run a 1-month 'pop-up' to test the location."];
        if (score <= 50) return ["PRICING STRATEGY: Experiment with premium vs. discount tiers.", "STAFFING: Hire based on personality over skill to boost retention.", "FEEDBACK LOOP: Create a system to capture customer complaints early."];
        if (score <= 60) return ["TECH INTEGRATION: Use a POS system to track inventory tightly.", "LOYALTY PROGRAM: Focus on repeat customers to lower acquisition costs.", "SCALABILITY: Document your processes now so you can grow later."];
        if (score <= 70) return ["BRANDING: Move from 'a shop' to 'a brand' with professional design.", "UPSELLING: Train staff to increase the average transaction value.", "COMMUNITY: Sponsor local events to build neighborhood trust."];
        if (score <= 80) return ["EFFICIENCY: Optimize your supply chain to increase margins.", "ONLINE PRESENCE: Your physical spot is good; now dominate Google Maps.", "RETENTION: Focus on 5-star service to keep competitors away."];
        if (score <= 90) return ["EXPANSION: Start looking at a second location within 12 months.", "AUTOMATION: Set up systems so the business runs without you.", "INVESTMENT: Use your high score to negotiate better bank rates."];
        return ["MARKET LEADERSHIP: You are the benchmark; innovate to stay ahead.", "PREMIUM PRICING: You have the leverage to charge a premium.", "ADVISORY: Consider franchising this model once established."];
    };

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    // --- 1. SAFE DATA EXTRACTION ---
    const scoreRaw = document.getElementById('ring-pct')?.textContent || "0%";
    const scoreInt = parseInt(scoreRaw) || 0; // Declared once here
    const bizTypeInput = document.getElementById('business_type');
    const bizType = bizTypeInput ? bizTypeInput.value.replace('_', ' ').toUpperCase() : "BUSINESS";
    const verdict = document.getElementById('v-title')?.textContent || "Analysis Pending";

    const getSummaryVal = (label) => {
        const items = Array.from(document.querySelectorAll('.summary-item'));
        const target = items.find(el => el.innerText.toLowerCase().includes(label.toLowerCase()));
        return target ? target.querySelector('.s-val').textContent : "N/A";
    };

    const getFlagVal = (label) => {
        const flags = Array.from(document.querySelectorAll('.flag'));
        const target = flags.find(el => el.innerText.toLowerCase().includes(label.toLowerCase()));
        return target ? target.querySelector('.flag-val').textContent : "N/A";
    };

    try {
        // --- 2. PAGE 1: PROFESSIONAL COVER & DASHBOARD ---
        doc.setFillColor(11, 17, 32);
        doc.rect(0, 0, 210, 45, 'F');
        doc.setTextColor(232, 192, 74);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("STRATEGIC VIABILITY AUDIT", 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text(`CONFIDENTIAL | ${date} | REF: UBES-${Math.floor(Math.random() * 9000) + 1000}`, 20, 35);

        doc.setDrawColor(201, 162, 39);
        doc.setLineWidth(2);
        doc.circle(170, 85, 20, 'S');
        doc.setFontSize(22);
        doc.setTextColor(11, 17, 32);
        doc.text(`${scoreInt}%`, 162, 88);
        doc.setFontSize(8);
        doc.text("VIABILITY", 162, 110);

        doc.setFontSize(14);
        doc.text("I. OPERATIONAL PROFILE", 20, 65);
        doc.line(20, 68, 80, 68);

        doc.setFontSize(11);
        const dataPoints = [
            ["Business Type:", bizType],
            ["Market Verdict:", verdict],
            ["Monthly Income:", getSummaryVal("Income")],
            ["Break-even:", getSummaryVal("Break-even")],
            ["Security Status:", getFlagVal("Security")]
        ];

        let y = 80;
        dataPoints.forEach(p => {
            doc.setFont("helvetica", "bold");
            doc.text(p[0], 25, y);
            doc.setFont("helvetica", "normal");
            doc.text(p[1], 70, y);
            y += 10;
        });

        // --- 3. SWOT ANALYSIS MATRIX ---
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("II. STRATEGIC SWOT MATRIX", 20, 140);
        doc.setDrawColor(180);
        doc.line(105, 145, 105, 200);
        doc.line(20, 172, 190, 172);

        doc.setFontSize(10);
        doc.setTextColor(46, 184, 122); doc.text("STRENGTHS", 25, 152);
        doc.setTextColor(224, 82, 82); doc.text("WEAKNESSES", 110, 152);
        doc.setTextColor(224, 148, 58); doc.text("OPPORTUNITIES", 25, 180);
        doc.setTextColor(11, 17, 32); doc.text("THREATS", 110, 180);

        doc.setTextColor(80);
        doc.text(scoreInt > 60 ? "- High Logic Score" : "- Tested Concept", 25, 158);
        doc.text(`- ${getFlagVal("Density")}`, 25, 164);
        doc.text(`- Comp: ${getFlagVal("Competitors")}`, 110, 158);
        doc.text(`- ${getFlagVal("Rent")}`, 110, 164);
        doc.text("- Expansion Ready", 25, 186);
        doc.text(`- Security: ${getFlagVal("Security")}`, 110, 186);

        // --- 4. PAGE 2: RECOMMENDATIONS ---
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(11, 17, 32);
        doc.text("III. EXPERT ACTION PLAN", 20, 30);

        const recs = Array.from(document.querySelectorAll('.rec-item span:last-child'));
        y = 45;
        recs.forEach((r, i) => {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, y, 170, 15, 'F');
            doc.setFont("helvetica", "bold");
            doc.text(`${i + 1}.`, 25, y + 10);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text(doc.splitTextToSize(r.textContent, 150), 35, y + 10);
            y += 20;
        });

        // --- 5. VIP ADVICE SECTION ---
        if (y > 220) { // New page if space is tight
            doc.addPage();
            y = 30;
        } else {
            y += 10;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(201, 162, 39);
        doc.text("IV. VIP STRATEGIC ADVISORY", 20, y);
        doc.line(20, y + 2, 90, y + 2);

        y += 15;
        const vipAdvices = getVIPAdvice(scoreInt); // Using the scoreInt from line 22

        vipAdvices.forEach((advice) => {
            doc.setFillColor(11, 17, 32);
            doc.circle(23, y - 1, 0.8, 'F');
            doc.setFont("helvetica", "italic");
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(10);
            const wrappedText = doc.splitTextToSize(advice, 160);
            doc.text(wrappedText, 28, y);
            y += (wrappedText.length * 7);
        });

        doc.save(`Audit_Report_${bizType}.pdf`);

    } catch (err) {
        console.error("PDF Error:", err);
        alert("Error generating report. Make sure you have run the analysis first!");
    }
}

const num = id => parseFloat(document.getElementById(id)?.value) || 0;
const sel = id => document.getElementById(id)?.value || '';

// ══════════════════════════════════════════
//  Navigation (6 steps)
// ══════════════════════════════════════════
const TOTAL = 6;
function goTo(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('s' + n).classList.add('active');
    for (let i = 1; i <= TOTAL; i++) {
        const dot = document.getElementById('dot' + i);
        const line = document.getElementById('line' + i);
        dot.classList.remove('active', 'done');
        if (i < n) { dot.classList.add('done'); dot.textContent = '✓'; }
        else { dot.textContent = i; }
        if (i === n) dot.classList.add('active');
        if (line) line.style.transform = i < n ? 'scaleX(1)' : 'scaleX(0)';
    }
    if (n === TOTAL) buildSummary();
}
// Add this to your <script> section to make buttons interactive
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-btn').forEach(button => {
        button.addEventListener('click', function () {
            const group = this.getAttribute('data-group');
            const value = this.getAttribute('data-val');

            // Update the global state object F
            if (group in F) {
                F[group] = value;
            }

            // Visual update: Deselect others in the group and select this one
            const parent = this.parentElement;
            parent.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});

// ══════════════════════════════════════════
//  Summary
// ══════════════════════════════════════════
function buildSummary() {
    const rentPct = num('income') > 0 ? Math.round((num('rent') / num('income')) * 100) : 0;
    const items = [
        ['Business type', sel('business_type')],
        ['Unemployment', F.unemployment_rate],
        ['Seasonal', F.seasonal_business],
        ['Backup plan', F.backup_strategy],
        ['Competitors', num('competitors')],
        ['Same type', F.same_type],
        ['Reviews', F.online_reviews_competitors],
        ['Local trend', F.local_trend],
        ['Pop. density', F.pop_density],
        ['Youth ratio', num('youth_ratio') + '%'],
        ['Near uni.', F.near_university],
        ['Tourism', F.tourism_area],
        ['Development', F.area_development],
        ['Transport', F.near_transport],
        ['Security', F.security],
        ['Income', num('income').toLocaleString() + ' DZD'],
        ['Break-even', num('bep').toLocaleString() + ' DZD'],
        ['Rent burden', rentPct + '% of income'],
        ['Buffer', num('buffer') + ' months'],
        ['Unique value', F.uvp],
        ['Educational', F.biz_edu],
    ];
    document.getElementById('summary-grid').innerHTML = items.map(([k, v]) =>
        `<div class="summary-item"><div class="s-key">${k}</div><div class="s-val">${v}</div></div>`
    ).join('');
}

// ══════════════════════════════════════════
//  JS Knowledge Base — original rules + new
// ══════════════════════════════════════════

// Original Server.pl rules
const sat_severe = () => num('competitors') > 8 && F.same_type === 'yes';
const dem_low = () => F.pop_density === 'low';
const dem_high_flag = () => F.pop_density === 'high';
const stab_weak = () => num('buffer') < 3;
const inv_high = () => F.security === 'low';
const access_good = () => F.near_transport === 'yes';
const comp_strong = () => F.uvp === 'yes';
const opp_strong = () => num('competitors') === 0 && dem_high_flag();
const cust_low = () => F.local_trend === 'declining';
const fin_fail = () => num('income') < num('bep');
const fail_high = () => fin_fail() || (sat_severe() && dem_low()) || (stab_weak() && inv_high());
const succ_high = () =>
    (F.near_university === 'yes' && F.biz_edu === 'yes') ||
    (access_good() && dem_high_flag()) ||
    (comp_strong() && opp_strong());

// New rules
const unemp_high = () => F.unemployment_rate === 'high';
const unemp_low = () => F.unemployment_rate === 'low';
const seasonal_risk = () => F.seasonal_business === 'yes' && F.backup_strategy === 'no';
const reviews_weak = () => F.online_reviews_competitors === 'poor'; // competitor weakness = opportunity
const tourism_boost = () => F.tourism_area === 'yes';
const dev_boost = () => F.area_development === 'yes';
const youth_high = () => num('youth_ratio') >= 50;
const rent_overload = () => num('income') > 0 && (num('rent') / num('income')) > 0.35;
const edu_location = () => F.near_university === 'yes' && F.biz_edu === 'yes';

function bizTypeModifier() {
    const t = sel('business_type');
    if (t === 'tutoring' && F.near_university === 'yes') return +12;
    if (t === 'gaming_cafe' && youth_high()) return +10;
    if (t === 'grocery') return +5;
    if (t === 'fast_food' && dem_high_flag()) return +8;
    if (t === 'handicraft' && tourism_boost()) return +10;
    if (t === 'luxury' && unemp_high()) return -15;
    if (t === 'luxury' && F.security === 'low') return -10;
    if (t === 'cafe' && sat_severe()) return -8;
    if (t === 'stationery' && F.near_university === 'yes') return +7;
    if (t === 'clothing' && youth_high()) return +6;
    return 0;
}

function jsScore() {
    let s = 50;
    // Original Server.pl scoring
    if (fin_fail()) s -= 25;
    if (sat_severe()) s -= 10;
    if (dem_low()) s -= 10;
    if (cust_low()) s -= 8;
    if (stab_weak()) s -= 5;
    if (inv_high()) s -= 7;
    if (access_good()) s += 8;
    if (comp_strong()) s += 10;
    if (opp_strong()) s += 20;
    if (dem_high_flag()) s += 8;
    if (!stab_weak()) s += 5;
    if (num('buffer') >= 6) s += 5;
    if (num('income') > num('bep') * 1.3) s += 10;
    if (succ_high()) s += 10;
    // New rules
    if (unemp_high()) s -= 6;
    if (unemp_low()) s += 5;
    if (seasonal_risk()) s -= 8;
    if (reviews_weak()) s += 6;
    if (tourism_boost()) s += 7;
    if (dev_boost()) s += 5;
    if (youth_high()) s += 4;
    if (rent_overload()) s -= 10;
    if (edu_location()) s += 12;
    s += bizTypeModifier();
    return Math.max(5, Math.min(95, Math.round(s)));
}

function jsRecs() {
    const r = [];
    // Original Server.pl recommendations
    if (fin_fail()) r.push('Income is below break-even — revisit pricing or reduce costs before launching.');
    if (sat_severe()) r.push('Market is severely saturated — differentiate strongly or target an underserved sub-segment.');
    if (stab_weak()) r.push('Capital buffer under 3 months — secure more financial reserve before starting.');
    if (stab_weak() && inv_high()) r.push('Low security + weak capital buffer is a dangerous combination — address at least one urgently.');
    if (cust_low()) r.push('Local trend is declining — validate whether this is temporary or structural before investing.');
    if (!comp_strong()) r.push('No unique value proposition — identify clearly what makes this business different from competitors.');
    if (access_good()) r.push('Good transport access is a real asset — make it central to your marketing strategy.');
    if (opp_strong()) r.push('Zero competition + high demand is a rare opportunity — move quickly to establish market presence.');
    if (succ_high() && !fail_high()) r.push('Overall conditions are favorable — focus on execution and customer experience.');
    // New rule recommendations
    if (unemp_high()) r.push('High local unemployment may reduce disposable income — consider affordable pricing strategies.');
    if (seasonal_risk()) r.push('Seasonal business with no backup plan — develop off-season revenue streams before launching.');
    if (reviews_weak()) r.push('Competitors have poor reviews — strong customer experience could quickly capture their market share.');
    if (tourism_boost()) r.push('Tourism area is a strong asset — consider multilingual service and tourist-friendly offerings.');
    if (dev_boost()) r.push('Active area development could attract new customers — plan for early-month construction disruption.');
    if (rent_overload()) r.push('Rent exceeds 35% of expected income — renegotiate the lease or consider a lower-cost location.');
    if (edu_location()) r.push('Educational business near a university is a strong fit — target students with tailored packages.');
    const biz = sel('business_type');
    if (biz === 'luxury' && unemp_high()) r.push('Luxury goods in a high-unemployment zone is high risk — consider pivoting to more accessible offerings.');
    if (biz === 'tutoring' && F.near_university === 'yes') r.push('Tutoring near a university is an excellent match — establish partnerships with student associations.');
    if (biz === 'gaming_cafe' && youth_high()) r.push('High youth ratio suits a gaming café well — invest in fast internet and tournament events.');
    if (r.length === 0) r.push('Mixed signals detected — re-evaluate the weakest factors before committing capital.');
    return r;
}

function jsResult() {
    const score = jsScore();
    return {
        score,
        saturation: sat_severe() ? 'severe' : 'acceptable',
        demand_potential: dem_low() ? 'low' : dem_high_flag() ? 'high' : 'medium',
        financial_failure: fin_fail() ? 'yes' : 'no',
        stability: stab_weak() ? 'weak' : 'stable',
        investment_risk: inv_high() ? 'high' : 'low',
        accessibility: access_good() ? 'good' : 'poor',
        competitive_advantage: comp_strong() ? 'strong' : 'weak',
        opportunity: opp_strong() ? 'strong' : 'moderate',
        customer_interest: cust_low() ? 'low' : 'stable',
        failure_risk: fail_high() ? 'high' : 'low',
        success_probability: succ_high() ? 'high' : 'moderate',
        // New fields
        seasonal_risk_flag: seasonal_risk() ? 'high' : 'low',
        tourism_flag: tourism_boost() ? 'yes' : 'no',
        rent_flag: rent_overload() ? 'overloaded' : 'ok',
        unemp_flag: F.unemployment_rate,
        recommendations: jsRecs(),
    };
}

// ══════════════════════════════════════════
//  Analyze — Prolog server first, JS fallback
// ══════════════════════════════════════════
async function analyze() {
    const btn = document.getElementById('analyze-btn');
    btn.textContent = 'Analyzing…';
    btn.disabled = true;

    // Payload matches Server.pl handle_analyze/1 field names exactly,
    // plus extended fields for future Server.pl updates
    const payload = {
        competitors: parseInt(num('competitors')),
        same_type: F.same_type,
        demand_high: dem_high_flag() ? 'yes' : 'no',
        pop_density: F.pop_density,
        income: num('income'),
        bep: num('bep'),
        buffer: parseInt(num('buffer')),
        security: F.security,
        near_transport: F.near_transport,
        near_school: F.near_university,
        uvp: F.uvp,
        trend_declining: F.local_trend === 'declining' ? 'yes' : 'no',
        biz_edu: F.biz_edu,
        // Extended new fields
        business_type: sel('business_type'),
        unemployment_rate: F.unemployment_rate,
        seasonal_business: F.seasonal_business,
        backup_strategy: F.backup_strategy,
        online_reviews_competitors: F.online_reviews_competitors,
        local_trend: F.local_trend,
        youth_ratio: num('youth_ratio'),
        near_university: F.near_university,
        tourism_area: F.tourism_area,
        area_development: F.area_development,
        rent: num('rent'),
    };

    let result;
    try {
        const res = await fetch('http://localhost:8080/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        // JS result covers new fields; Prolog overrides the original base fields
        result = { ...jsResult(), ...data };
    } catch (_) {
        result = jsResult();
    }

    btn.textContent = '⚡ Run Analysis';
    btn.disabled = false;
    renderResults(result);
}

// ══════════════════════════════════════════
//  Render Results
// ══════════════════════════════════════════
function renderResults(d) {
    document.getElementById('form-card').style.display = 'none';
    document.getElementById('tracker').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const score = d.score;
    const isGood = score >= 65, isMid = score >= 40;
    const color = isGood ? '#2eb87a' : isMid ? '#e0943a' : '#e05252';

    document.getElementById('v-title').textContent =
        isGood ? 'Likely to Succeed' : isMid ? 'Moderate Risk' : 'High Failure Risk';
    document.getElementById('v-title').style.color = color;
    document.getElementById('v-desc').textContent =
        isGood ? 'Market conditions and financials align favorably for this venture.'
            : isMid ? 'Several risk factors require attention before proceeding.'
                : 'Critical vulnerabilities detected — significant rethinking required.';

    setTimeout(() => {
        const arc = document.getElementById('ring-arc');
        arc.style.strokeDashoffset = 364.4 - (score / 100) * 364.4;
        arc.setAttribute('stroke', color);
        document.getElementById('ring-pct').textContent = score + '%';
    }, 100);

    const sat = d.saturation === 'severe';
    const fFail = d.financial_failure === 'yes';
    const stabW = d.stability === 'weak';
    const invH = d.investment_risk === 'high';
    const accG = d.accessibility === 'good';
    const compS = d.competitive_advantage === 'strong';
    const oppS = d.opportunity === 'strong';
    const custL = d.customer_interest === 'low';
    const buf = num('buffer');

    // 6 factor bars including new Business–market fit bar
    const factors = [
        {
            label: 'Market demand',
            val: dem_high_flag() ? (custL ? 52 : 82) : F.pop_density === 'medium' ? 48 : 28
        },
        {
            label: 'Financial health',
            val: fFail ? 18 : Math.min(90, Math.round((num('income') / Math.max(num('bep'), 1)) * 55))
        },
        {
            label: 'Location quality',
            val: Math.min(95,
                (accG ? 28 : 0) + (dem_high_flag() ? 22 : F.pop_density === 'medium' ? 11 : 0) +
                (F.near_university === 'yes' ? 18 : 0) + (tourism_boost() ? 14 : 0) +
                (!invH ? 12 : 0) + (dev_boost() ? 7 : 0))
        },
        {
            label: 'Competitive position',
            val: oppS ? 90 : compS ? (sat ? 48 : 72) : sat ? 20 : 50
        },
        {
            label: 'Operational stability',
            val: stabW ? 22 : buf >= 6 ? 90 : 62
        },
        {
            label: 'Business\u2013market fit',
            val: Math.min(95, Math.max(5, 55
                + bizTypeModifier() * 1.5
                + (youth_high() ? 10 : 0)
                + (unemp_low() ? 8 : 0)
                + (unemp_high() ? -10 : 0)
                + (seasonal_risk() ? -12 : 0)
                + (reviews_weak() ? 8 : 0)))
        },
    ].map(f => ({ ...f, val: Math.max(5, Math.min(95, Math.round(f.val))) }));

    document.getElementById('bars').innerHTML = factors.map(f => {
        const c = f.val >= 65 ? '#2eb87a' : f.val >= 40 ? '#e0943a' : '#e05252';
        return `<div class="bar-row">
      <div class="bar-name">${f.label}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${f.val}%;background:${c}"></div></div>
      <div class="bar-pct" style="color:${c}">${f.val}%</div>
    </div>`;
    }).join('');

    // 12 findings flags — original 8 + 4 new
    const flags = [
        { label: 'Market saturation', cls: sat ? 'bad' : 'ok', val: sat ? 'Severe' : 'Acceptable' },
        { label: 'Failure risk', cls: d.failure_risk === 'high' ? 'bad' : 'ok', val: d.failure_risk === 'high' ? 'High' : 'Low' },
        { label: 'Stability', cls: stabW ? 'mid' : 'ok', val: stabW ? 'Weak' : 'Stable' },
        { label: 'Investment risk', cls: invH ? 'mid' : 'ok', val: invH ? 'High' : 'Low' },
        { label: 'Accessibility', cls: accG ? 'ok' : 'mid', val: accG ? 'Good' : 'Poor' },
        { label: 'Competitive edge', cls: compS ? 'ok' : 'mid', val: compS ? 'Strong' : 'Weak' },
        { label: 'Opportunity', cls: oppS ? 'ok' : 'neu', val: oppS ? 'Strong' : 'Moderate' },
        { label: 'Customer interest', cls: custL ? 'bad' : 'ok', val: custL ? 'Declining' : 'Stable' },
        { label: 'Seasonal risk', cls: seasonal_risk() ? 'bad' : 'ok', val: seasonal_risk() ? 'High' : 'Low' },
        { label: 'Tourism advantage', cls: tourism_boost() ? 'ok' : 'neu', val: tourism_boost() ? 'Yes' : 'No' },
        { label: 'Rent burden', cls: rent_overload() ? 'bad' : 'ok', val: rent_overload() ? 'Overloaded' : 'Healthy' },
        { label: 'Unemployment risk', cls: unemp_high() ? 'mid' : unemp_low() ? 'ok' : 'neu', val: F.unemployment_rate.charAt(0).toUpperCase() + F.unemployment_rate.slice(1) },
    ];
    document.getElementById('flags').innerHTML = flags.map(f =>
        `<div class="flag ${f.cls}"><div class="flag-name">${f.label}</div><div class="flag-val">${f.val}</div></div>`
    ).join('');

    const recs = (d.recommendations && d.recommendations.length)
        ? d.recommendations
        : ['Mixed signals detected — re-evaluate the weakest factors before committing capital.'];
    document.getElementById('recs').innerHTML = recs.map((r, i) =>
        `<div class="rec-item"><span class="rec-num">${String(i + 1).padStart(2, '0')}</span><span>${r}</span></div>`
    ).join('');
}

function resetAll() {
    document.getElementById('form-card').style.display = 'block';
    document.getElementById('tracker').style.display = 'flex';
    document.getElementById('results').style.display = 'none';
    goTo(1);
}
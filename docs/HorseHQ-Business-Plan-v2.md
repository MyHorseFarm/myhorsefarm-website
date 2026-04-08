# Horse HQ Biochar Facility — Business Plan v2.0

**Updated March 2026** | Jose Gomez, Founder

---

## Executive Summary

Horse HQ Biochar Facility is an AI-powered ag-tech venture in Palm Beach County, Florida. We convert 30,000+ tons of equine waste annually from the Wellington-Loxahatchee equestrian corridor into high-value biochar and verified carbon-removal credits.

What sets Horse HQ apart from traditional waste-to-biochar operations: **AI runs the entire operation** — from smart hauling routes and predictive waste volume forecasting to real-time pyrolysis optimization and automated carbon credit trading. Each ton of biochar locks away ~3 tons of CO2e, producing 10,000+ tons of permanent carbon removal credits per year.

**Revenue projection: $5.2M Year 1** (up from $4.6M in v1) driven by AI-optimized operations and premium credit pricing.

**Startup investment: $3.5M** (includes AI/IoT infrastructure).

---

## Mission & Vision

**Mission:** Transform equine waste from an environmental liability into a climate asset using AI-driven processes that maximize carbon removal efficiency and economic returns.

**Vision:** Build the most technologically advanced biochar facility in the US — a model for AI-powered waste-to-value operations that can be replicated in equestrian communities worldwide.

---

## Market Opportunity

### The Waste Problem

Wellington's equestrian preserve produces 120+ tons of horse manure daily. Disposal options are limited, enforcement is loose, and dumping in canals and open land is common. Wellington requires registered haulers and approved dump sites — violators face fines up to $5,000. Tipping fees at approved sites start at $25/ton.

### Growing Biochar Market

- Global biochar market projected to exceed $20B by 2030
- Biochar from animal waste fetches premium prices (high nutrient content)
- Major corporate buyers: Microsoft, Stripe, Google, Swiss Re, Shopify
- Long-term contract prices: $100–$400/ton CO2e removed
- 2025-2026 trend: prices rising as voluntary carbon markets mature

### Regulatory Drivers

- Palm Beach County repealed the equestrian-waste recycling pilot in 2017
- New facilities must be on **Industrial future-land-use** parcels
- Horse HQ will locate in an industrial zone near Southern Blvd / SWA complex
- Full compliance with FDEP, county, and Wellington BMP requirements

---

## AI-Powered Technology Stack

### 1. Smart Hauling & Route Optimization

**Problem:** Manure hauling routes are planned manually, wasting fuel and time.

**Solution:** AI route optimization engine that:
- Dynamically routes trucks based on real-time barn fill levels (IoT sensors in manure bins)
- Predicts pickup demand using weather, season, horse show schedules, and historical data
- Reduces fuel costs 20-30% and increases daily loads per truck
- Sends automated pickup confirmations to farm clients

**Tech:** Custom route optimization API, GPS fleet tracking, IoT bin sensors (LoRaWAN), mobile driver app.

### 2. Predictive Waste Volume Forecasting

**Problem:** Feedstock supply fluctuates with equestrian season, shows, and weather.

**Solution:** ML model trained on:
- Historical hauling data from 20 years of My Horse Farm operations
- Wellington show calendar (WEF season: Jan-April = peak)
- Weather patterns (rain = more stall time = more waste)
- Client barn size and horse count data

**Output:** 30-day rolling forecast of incoming feedstock volume, enabling:
- Optimal staffing and equipment scheduling
- Proactive supply contracts during low-volume months
- Buffer stock management to maintain consistent pyrolysis throughput

### 3. AI-Optimized Pyrolysis Control

**Problem:** Pyrolysis efficiency depends on feedstock moisture, composition, and temperature profiles.

**Solution:** Real-time AI control system that:
- Monitors feedstock moisture and composition via near-infrared (NIR) sensors
- Adjusts temperature, feed rate, and residence time automatically
- Maximizes biochar yield and carbon content per ton of feedstock
- Predicts maintenance needs before equipment fails (predictive maintenance)
- Targets optimal 500-600C range based on live sensor data

**Impact:** 15-20% improvement in biochar yield vs. manual operation. Higher carbon content = higher credit value.

### 4. Computer Vision Quality Control

**Problem:** Feedstock quality varies — contamination (plastic, metal, non-organic material) reduces biochar quality.

**Solution:** Camera-based inspection system at the tipping bay:
- AI vision model identifies and flags contaminants in incoming loads
- Automated rejection of non-compliant loads
- Quality grading of each batch for traceability
- Photo documentation for compliance and carbon credit verification

### 5. Carbon Credit Marketplace Automation

**Problem:** Selling carbon credits requires complex verification, documentation, and marketplace navigation.

**Solution:** Automated carbon credit pipeline:
- Real-time tracking of carbon removal per batch (sensor data + mass balance)
- Automated MRV (Monitoring, Reporting, Verification) documentation
- AI-powered pricing engine that monitors Puro.Earth, Verra, and voluntary market prices
- Automated listing and bidding on carbon credit marketplaces
- Smart contract integration for transparent, instant settlement
- Portfolio optimization: hold credits when prices are low, sell when high

**Impact:** Premium pricing through automated verification + optimal timing = 10-15% revenue uplift on credits.

### 6. Client Portal & AI Chatbot

**Problem:** Farm clients want visibility into pickups, invoicing, and scheduling.

**Solution:** Web portal and mobile app (built on My Horse Farm's existing Next.js platform):
- Real-time pickup tracking and scheduling
- Automated invoicing and payment processing (Square integration)
- AI chatbot for client support (schedule changes, billing questions, quotes)
- Environmental impact dashboard — show each farm their carbon offset contribution
- Automated review requests and referral programs

**Already built:** My Horse Farm website already has AI chatbot (Claude Haiku), Square payments, HubSpot CRM, and automated email workflows. Horse HQ extends this stack.

### 7. Digital Twin & Operations Dashboard

**Solution:** Real-time digital twin of the entire facility:
- 3D visualization of pyrolysis process, feedstock levels, biochar output
- Live KPIs: throughput, yield, energy consumption, emissions, revenue
- AI anomaly detection: alerts for any deviation from optimal parameters
- Executive dashboard for investors showing real-time financial metrics

---

## Business Model

### Feedstock Supply

My Horse Farm (Jose's existing company) hauls manure from 20+ barns and will supply feedstock at $25/ton tipping fee. Additional supply from other local haulers. AI forecasting ensures consistent throughput.

### Revenue Streams

| Stream | Year 1 | Notes |
|--------|--------|-------|
| Tipping fees | $750,000 | 30,000 tons x $25/ton |
| Biochar sales | $840,000 | 4,000 tons x $210/ton (AI-optimized higher yield) |
| Carbon credits | $3,360,000 | 12,000 tCO2e x $280/ton (AI-optimized timing) |
| SaaS/data services | $100,000 | Environmental impact reports for farms |
| Client portal subscriptions | $50,000 | Premium features for farm clients |
| Consulting/licensing | $100,000 | Process licensing to other facilities |
| **Total Year 1** | **$5,200,000** | |

### Operating Costs

| Item | Annual Cost |
|------|------------|
| Labour (plant manager, operators, AI/data engineer, maintenance) | $500,000 |
| AI/cloud infrastructure (AWS, sensors, software) | $80,000 |
| Utilities and fuel | $100,000 |
| Maintenance and supplies | $80,000 |
| Insurance, legal, permits | $70,000 |
| Land lease (base + profit share) | $100,000 |
| Odour control and mitigation | $30,000 |
| Marketing and administration | $60,000 |
| **Total OPEX** | **$1,020,000** |

### Startup Costs

| Item | Cost |
|------|------|
| Pyrolysis machinery (continuous system + emissions control) | $2,000,000 |
| AI/IoT infrastructure (sensors, cameras, compute, software) | $250,000 |
| Building construction (5-acre site, enclosed bays, office) | $300,000 |
| Installation & automation | $200,000 |
| Odour control & landscaping | $100,000 |
| Client portal & digital twin development | $100,000 |
| Working capital & pre-launch | $300,000 |
| Permits & fees | $10,000 |
| Contingency (10%) | $240,000 |
| **Total** | **$3,500,000** |

---

## Five-Year Financial Projection

| Year | Revenue | OPEX | EBITDA | Loan Payment | Net Profit | Cumulative | ROI |
|------|---------|------|--------|-------------|------------|------------|-----|
| **1** | **$5.20M** | $1.02M | **$4.18M** | $1.35M | **$2.83M** | $2.83M | 81% |
| **2** | $5.80M | $1.08M | $4.72M | $1.35M | $3.37M | $6.20M | 177% |
| **3** | $6.50M | $1.12M | $5.38M | $1.35M | $4.03M | $10.23M | 292% |
| **4** | $7.20M | $1.18M | $6.02M | — | $6.02M | $16.25M | 464% |
| **5** | $8.00M | $1.25M | $6.75M | — | $6.75M | $22.99M | 657% |

**Key assumptions:**
- Feedstock grows to 40,000 tons by Year 3 (expanded hauling contracts)
- Carbon credit prices appreciate 5-10% annually (market trend)
- AI optimizations increase yield by 15% and reduce waste by 20% over 3 years
- Second pyrolysis unit added in Year 4 ($1.5M capex, funded from profits)
- Licensing revenue begins Year 3 as model is proven

---

## Competitive Advantages

1. **Vertical integration** — My Horse Farm's 20-year hauling business guarantees feedstock supply
2. **AI-first operations** — No other biochar facility in Florida uses AI-optimized pyrolysis, predictive maintenance, or automated carbon credit trading
3. **Existing client base** — 275+ farm contacts already in CRM (HubSpot), ready for upselling
4. **Regulatory compliance** — Industrial-zoned site, proper FDEP permits, enclosed operations
5. **Multiple revenue streams** — Tipping fees, biochar, carbon credits, SaaS, consulting
6. **Scalable model** — AI systems and processes designed to replicate at other locations
7. **20 years of domain expertise** — Jose Gomez knows every barn, hauler, and regulator in Palm Beach County

---

## Location & Site Plan

5-acre parcel with Industrial future land use designation near Southern Boulevard or SWA complex:

- Enclosed tipping pad with AI vision inspection system
- Pyrolysis building with AI-controlled continuous feed unit
- IoT sensor network throughout facility
- Operations command center with digital twin displays
- Biochar storage (covered, ventilated)
- Stormwater and runoff controls
- Vegetative buffer and setback from property boundaries

---

## Permitting & Compliance

- **FDEP solid-waste permits** — Construction ($2,000) and operation ($1,000) permits
- **Palm Beach County** — Annual facility registration ($250) + building permits
- **Wellington BMP compliance** — All hauling registered, tipping fees paid, approved disposal
- **Zoning** — Industrial parcel avoids equestrian-zone restrictions
- **Carbon credit verification** — Puro.Earth or Verra registry certification

---

## Risk Analysis & Mitigation

| Risk | Mitigation |
|------|-----------|
| Regulatory changes | Industrial zoning, full FDEP compliance, legal counsel |
| Feedstock supply fluctuation | AI forecasting, long-term contracts, diversified hauler network |
| Carbon credit price volatility | AI pricing engine, multi-year offtake agreements, diversified revenue |
| Technology failure | Redundant sensors, manual override capability, vendor maintenance contracts |
| Community opposition | Enclosed operations, odour control, community engagement, setbacks |
| Competition | AI moat, vertical integration, 20-year relationships, first-mover in FL |

---

## Ownership & Funding Structure

- **Seeking: $3.5M** ($2.5M debt + $1M equity)
- Debt investors: interest + principal over 3 years at 8% ($1.35M annual payment)
- Equity investors: 25% ownership, annual dividends after loan repayment, carbon credit upside
- Jose Gomez / My Horse Farm: 75% ownership, operational management

---

## Team

- **Jose Gomez** — Founder & CEO. 20 years in equine waste management. Runs My Horse Farm ($250-400K/yr). Serial entrepreneur with 10+ ventures.
- **Johanna Torres-Gomez** — CFO & HR. Accounting, billing, and operations management.
- **[To hire] Plant Manager** — Industrial operations, pyrolysis experience
- **[To hire] AI/Data Engineer** — ML models, IoT infrastructure, automation
- **[To hire] Environmental Compliance Officer** — Permits, monitoring, reporting

---

## Conclusion

Horse HQ Biochar Facility is where 20 years of equestrian waste expertise meets cutting-edge AI technology. We're not just building a biochar plant — we're building an AI-powered climate-tech platform that transforms the economics of waste management.

The numbers are compelling: $5.2M Year 1 revenue, $2.83M net profit, payback in under 2 years. But the real opportunity is the model: prove it in Palm Beach County, then license it to equestrian communities worldwide.

The equestrian waste problem isn't going away. Horse HQ is the solution — and the investment opportunity — that turns that problem into profit.

---

*Contact: Jose Gomez | gomez@myhorsefarm.com | (561) 576-7667*

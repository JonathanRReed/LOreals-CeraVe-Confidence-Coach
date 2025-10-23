# Confidence Coach — Astro One‑Page Prototype: Design Doc v1.0

## 0. Objective and scope

Build a one‑page Astro prototype that guides first‑time skincare users to a 90‑day CeraVe routine with a clear expectation timeline, patch‑test guardrails, and a myth‑check tool. The page runs client‑side islands only where needed.

**In scope:** onboarding form, generated plan, confidence score, expectation timeline, patch‑test modal, reminders stub, myth‑check stub, progress check‑ins.

**Out of scope:** account system, real e‑commerce, medical personalization, server APIs.

**Primary KPI (prototype):** Task success for 3 flows ≥ 80% in hallway tests: Generate plan, Start patch‑test, Run myth check.

 Use Shadcn UI for components.
 
---

## 1. User stories

* As a first‑time user, I can enter skin profile and constraints so I get a simple plan I trust.
* As a cautious user, I can start a patch‑test with clear steps so I reduce risk of irritation.
* As a confused user, I can check a claim and see evidence relevance to me so I decide calmly.
* As a busy user, I can see what to expect by week so I do not churn too early.

---

## 2. IA and flow (one page)

1. Hero + trust statement
2. Onboarding form
3. Plan card (appears after submit)
4. Confidence meter + expectation timeline
5. Patch‑test modal (triggered from plan)
6. Reminders stub (local notification placeholder)
7. Myth Check (paste a claim → static scoring)
8. Progress check‑ins (photo and symptom tracker)
9. Footer legal

---

## 3. Components

* **HeaderBrand**: logo lockup, simple nav anchors.
* **OnboardingForm (island)**: inputs, validation, submit.
* **PlanCard**: AM/PM tabs, products, usage notes.
* **ConfidenceMeter**: bar with numeric percentage and label.
* **ExpectationTimeline**: horizontal steps Day 1, 7, 28, 56, 90.
* **PatchTestModal (island)**: 3‑step wizard + completion state.
* **ReminderSetup (island, stub)**: “Add reminder” triggers a demo toast.
* **MythCheck (island, stub)**: textarea → mock EvidenceCard.
* **ProgressTracker (island)**: check‑in toggles + simple chart placeholder.
* **Toast**: transient feedback.
* **FooterLegal**: disclaimers.

---

## 4. State machine (top‑level UI)

**States:** `idle` → `form_valid` → `plan_generated` → (`patchtest_open` | `mythcheck_fetching` | `reminder_set`) → `done`.

**Events:** `INPUT_CHANGE`, `SUBMIT_FORM`, `PLAN_READY`, `OPEN_PATCHTEST`, `CLOSE_PATCHTEST`, `SUBMIT_MYTHCHECK`, `MYTHCHECK_READY`, `SET_REMINDER`.

**Guards:** form valid, at least 1 concern chosen, sensitivity set.

---

## 5. Data model (TypeScript types)

```ts
export type SkinType = 'dry' | 'oily' | 'combo' | 'normal';
export type Sensitivity = 'low' | 'medium' | 'high';
export type Concern = 'acne' | 'texture' | 'redness' | 'darkspots';

export interface UserProfile {
  skinType: SkinType;
  concerns: Concern[];
  sensitivity: Sensitivity;
  budget: 'low' | 'mid' | 'high';
  preferences: { spfOk: boolean; fragranceFree: boolean; quickAM: boolean };
}

export interface Product {
  id: string; name: string; step: 'cleanse'|'treat'|'moisturize'|'spf';
  skuHint?: string; notes: string;
}

export interface RoutinePlan {
  am: Product[]; pm: Product[]; rampNotes: string[];
}

export interface Milestone { day: number; title: string; note: string; }

export interface EvidenceCard {
  claim: string; confidence: number; appliesTo: string; sources: string[]; summary: string;
}
```

**Mock products (non‑final names):**

* Hydrating Facial Cleanser
* Foaming Facial Cleanser
* AM Facial Moisturizing Lotion with SPF
* PM Facial Moisturizing Lotion
* Resurfacing Retinol Serum

---

## 6. Mapping rules (simple, deterministic)

* **Cleanser**

  * dry/normal/combo → Hydrating Cleanser
  * oily → Foaming Cleanser
* **SPF (AM)**

  * If preferences.spfOk → AM Moisturizing Lotion with SPF; otherwise Moisturizing Lotion + “separate SPF recommended”.
* **Treat**

  * acne → Retinol Serum; if sensitivity = high → 2x/week ramp; else 3x/week ramp
  * darkspots → Retinol Serum with note on gradual tone evening
  * redness/texture → treat optional, prioritize moisturization
* **Moisturize**

  * PM Moisturizing Lotion always at night

**Ramp schedule example:** Week 1: retinol 2x/week; Week 2: 3x/week; Week 3+: adjust per tolerance.

---

## 7. Confidence score formula

Return 0–100 with labels Low, Moderate, High.

```
base = 60
profileMatch = +10 if cleanser matches skinType else 0
routineCompleteness = +10 if AM has cleanse+spf+moisturize, +10 if PM has cleanse+moisturize
sensitivityPenalty = -10 if sensitivity = high and treat included
educationBoost = +10 if user opens patch‑test modal
score = clamp(base + profileMatch + routineCompleteness + sensitivityPenalty + educationBoost, 0, 100)
label: <50 Low, 50–74 Moderate, ≥75 High
```

---

## 8. Expectation timeline content (draft copy)

* **Day 1–3:** Skin may feel the same. Focus on consistency.
* **Day 7:** Texture and hydration awareness may improve slightly. No rushing.
* **Day 28:** First cycle checkpoint. Small gains more likely. Adjust only if persistent irritation.
* **Day 56:** Trend check. Compare photos in similar lighting.
* **Day 90:** Outcome review. Consider targeted additions if goals unmet.

---

## 9. Patch‑test wizard (safety guardrail)

Steps:

1. Apply a small amount of the new product to the inner forearm or behind the ear.
2. Wait 24–48 hours. Monitor for redness, itching, or swelling.
3. If clear, introduce into the routine per ramp schedule. If irritation occurs, stop and consider alternatives.

CTA progression: Start → Timer tips → Mark as done. Show a reminder option.

---

## 10. Myth Check (stubbed logic)

* Input: free‑text claim or pasted URL.
* Output: `EvidenceCard` with mock confidence and applicability string tied to the user’s sensitivity and concerns.
* Sources: placeholder list like “Dermatology guidelines (summary)”.

---

## 11. Accessibility

* Form inputs use `<label for=...>` and visible helper text.
* Keyboard: focus ring, ESC closes modal, TAB order logical.
* Color contrast: tokens must meet WCAG AA.
* Copy avoids jargon, includes examples for skin type.

---

## 12. Visual design tokens

Brand tokens use placeholders. Replace with approved CeraVe hex values if available.

```css
:root{
  --brand-primary: #2a66b8; /* TBD confirm */
  --brand-accent: #1f4f8c; /* TBD confirm */
  --bg: #ffffff;
  --bg-alt: #f6f8fb;
  --text: #0f172a;
  --muted: #475569;
  --border: #e2e8f0;
  --success: #16a34a;
  --warn: #f59e0b;
}

@media (prefers-color-scheme: dark){
  :root{
    --bg:#0b1220; --bg-alt:#0f172a; --text:#e5e7eb; --muted:#94a3b8; --border:#1f2937;
  }
}
```

Typography: system UI stack for speed. Optional: Nebula Sans if available on your site.

---

## 13. Analytics (prototype stub)

Track console events: `plan_generated`, `patchtest_started`, `patchtest_completed`, `mythcheck_submitted`, `reminder_set` with timestamp and profile hash.

---

## 14. QA checklist and acceptance criteria

* Form validation blocks submit until required fields set.
* Plan renders AM and PM with 3–4 steps each.
* Confidence score visible with label and tooltip on calculation.
* Timeline shows 5 milestones and scrolls on small screens.
* Patch‑test modal opens, supports keyboard, and closes.
* Myth Check returns a deterministic card from input.
* No console errors. Lighthouse Performance ≥ 90 on desktop.

---

## 15. File structure

```
project/
  package.json
  astro.config.mjs
  src/
    pages/
      index.astro
    components/
      HeaderBrand.astro
      PlanCard.astro
      ConfidenceMeter.astro
      ExpectationTimeline.astro
      FooterLegal.astro
    islands/
      OnboardingForm.tsx
      PatchTestModal.tsx
      MythCheck.tsx
      ProgressTracker.tsx
      ReminderSetup.tsx
    lib/
      mapping.ts
      types.ts
      confidence.ts
      mock.ts
  public/
    logo.svg
```

---

## 16. Code skeletons

**src/lib/types.ts**

```ts
export type SkinType = 'dry'|'oily'|'combo'|'normal';
export type Sensitivity = 'low'|'medium'|'high';
export type Concern = 'acne'|'texture'|'redness'|'darkspots';
export interface UserProfile{ skinType:SkinType; concerns:Concern[]; sensitivity:Sensitivity; budget:'low'|'mid'|'high'; preferences:{spfOk:boolean; fragranceFree:boolean; quickAM:boolean}; }
export interface Product{ id:string; name:string; step:'cleanse'|'treat'|'moisturize'|'spf'; notes:string; }
export interface RoutinePlan{ am:Product[]; pm:Product[]; rampNotes:string[]; }
export interface Milestone{ day:number; title:string; note:string; }
export interface EvidenceCard{ claim:string; confidence:number; appliesTo:string; sources:string[]; summary:string; }
```

**src/lib/mapping.ts**

```ts
import {UserProfile, RoutinePlan, Product} from './types';
export function buildPlan(p:UserProfile):RoutinePlan{
  const am:Product[]=[]; const pm:Product[]=[];
  const cleanser = p.skinType==='oily' ? {id:'cleanser2',name:'Foaming Facial Cleanser',step:'cleanse',notes:'AM/PM'} : {id:'cleanser1',name:'Hydrating Facial Cleanser',step:'cleanse',notes:'AM/PM'};
  am.push(cleanser); pm.push(cleanser);
  if(p.preferences.spfOk){ am.push({id:'spf1',name:'AM Moisturizing Lotion SPF',step:'spf',notes:'Apply generously'}); }
  am.push({id:'moistam',name:'AM Moisturizing Lotion',step:'moisturize',notes:'If no SPF, use separate sunscreen'});
  pm.push({id:'moistpm',name:'PM Facial Moisturizing Lotion',step:'moisturize',notes:'Nightly'});
  const needsRetinol = p.concerns.includes('acne') || p.concerns.includes('darkspots');
  if(needsRetinol){ pm.splice(1,0,{id:'retinol',name:'Resurfacing Retinol Serum',step:'treat',notes: p.sensitivity==='high'?'Use 2x/week':'Use 3x/week'}); }
  const rampNotes = [p.sensitivity==='high'?'Week 1: 2x/week retinol':'Week 1: 3x/week retinol','Increase only if tolerated'];
  return {am, pm, rampNotes};
}
```

**src/lib/confidence.ts**

```ts
import {UserProfile, RoutinePlan} from './types';
export function scoreConfidence(p:UserProfile, r:RoutinePlan){
  let base=60; let profileMatch=0; let completeness=0; let penalty=0; let edu=0;
  const cleanserOk = (p.skinType==='oily' && r.am[0].name.includes('Foaming')) || (p.skinType!=='oily' && r.am[0].name.includes('Hydrating'));
  if(cleanserOk) profileMatch+=10;
  const amSteps = new Set(r.am.map(s=>s.step)); const pmSteps = new Set(r.pm.map(s=>s.step));
  if(amSteps.has('cleanse') && (amSteps.has('spf')||amSteps.has('moisturize'))) completeness+=10;
  if(pmSteps.has('cleanse') && pmSteps.has('moisturize')) completeness+=10;
  if(p.sensitivity==='high' && pmSteps.has('treat')) penalty-=10;
  const score = Math.max(0, Math.min(100, base+profileMatch+completeness+penalty+edu));
  const label = score>=75?'High': score>=50?'Moderate':'Low';
  return {score,label};
}
```

**src/pages/index.astro**

```astro
---
import HeaderBrand from '../components/HeaderBrand.astro';
import PlanCard from '../components/PlanCard.astro';
import ConfidenceMeter from '../components/ConfidenceMeter.astro';
import ExpectationTimeline from '../components/ExpectationTimeline.astro';
import FooterLegal from '../components/FooterLegal.astro';
import OnboardingForm from '../islands/OnboardingForm';
import PatchTestModal from '../islands/PatchTestModal';
import MythCheck from '../islands/MythCheck';
import ProgressTracker from '../islands/ProgressTracker';
import ReminderSetup from '../islands/ReminderSetup';
import {buildPlan} from '../lib/mapping';
import {scoreConfidence} from '../lib/confidence';
const initial = undefined;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confidence Coach</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <style>:root{--brand-primary:#2a66b8;--bg:#fff;--text:#0f172a;--border:#e2e8f0} body{background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui} .container{max-width:1000px;margin:0 auto;padding:24px}</style>
  </head>
  <body>
    <HeaderBrand />
    <main class="container">
      <section id="hero"><h1>Build a routine you can trust</h1><p>Simple steps. Clear expectations. Safer starts.</p></section>
      <section id="form"><OnboardingForm client:load /></section>
      <section id="plan"><PlanCard /></section>
      <section id="confidence"><ConfidenceMeter /></section>
      <section id="timeline"><ExpectationTimeline /></section>
      <section id="patch"><PatchTestModal client:idle /></section>
      <section id="reminders"><ReminderSetup client:idle /></section>
      <section id="myth"><MythCheck client:idle /></section>
      <section id="progress"><ProgressTracker client:idle /></section>
    </main>
    <FooterLegal />
  </body>
</html>
```

**src/islands/OnboardingForm.tsx** (minimal)

```tsx
import {useState} from 'react';
import type {UserProfile} from '../lib/types';
import {buildPlan} from '../lib/mapping';
import {scoreConfidence} from '../lib/confidence';

export default function OnboardingForm(){
  const [p,setP]=useState<UserProfile>({skinType:'combo',concerns:[],sensitivity:'medium',budget:'mid',preferences:{spfOk:true,fragranceFree:true,quickAM:true}});
  const [out,setOut]=useState<any>(null);
  const submit=(e:any)=>{e.preventDefault(); const plan=buildPlan(p); const conf=scoreConfidence(p,plan); setOut({plan,conf}); (window as any).dispatchEvent(new CustomEvent('plan-ready',{detail:{plan,conf}})); console.log('plan_generated', {conf}); };
  return (
    <form onSubmit={submit}>
      <fieldset>
        <legend>Your profile</legend>
        <label>Skin type
          <select value={p.skinType} onChange={e=>setP({...p,skinType:e.target.value as any})}>
            <option value="dry">Dry</option><option value="oily">Oily</option><option value="combo">Combo</option><option value="normal">Normal</option>
          </select>
        </label>
        <label>Sensitivity
          <select value={p.sensitivity} onChange={e=>setP({...p,sensitivity:e.target.value as any})}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </label>
        <label>Concerns
          <div>
            {['acne','texture','redness','darkspots'].map(c=>
              <label key={c}><input type="checkbox" checked={p.concerns.includes(c as any)} onChange={e=>{
                const set=new Set(p.concerns); e.target.checked?set.add(c as any):set.delete(c as any); setP({...p,concerns:[...set]});}}/> {c}</label>
            )}
          </div>
        </label>
        <button type="submit">Build my routine</button>
      </fieldset>
    </form>
  );
}
```

Other islands can listen for the `plan-ready` event to render content.

---

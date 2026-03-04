# Project: AuraPay EasyBuy Application

## Current Stack
- React SPA
- Hosted on Vercel
- Node + Express backend (Render)
- MongoDB (Mongoose)

## Current URL
https://aurapaytracker.vercel.app/apply

## Current Problem
The apply form is a single long page.
Testers say:
- Clarity: Very clear
- Flow: Smooth
- Length: Just right
- Weakness: Trust signals not strong enough
- Design: 7–8/10

Main improvement needed:
Increase trust perception and professionalism.

## Goals

1. Break form into 4-step multi-step flow:
   - Step 1: Basic Info (Name, Phone)
   - Step 2: Plan Selection (Device, Duration, Down payment)
   - Step 3: Verification (NIN, Address, Occupation)
   - Step 4: Review & Submit (summary + computed payment)

2. Add:
   - Progress bar (Step X of 4)
   - Step validation
   - Preserve state when going back
   - Autosave in localStorage
   - Smooth step transitions

3. Add Trust UI Enhancements:
   - Lock icon near sensitive inputs
   - “Your data is encrypted” text
   - Support contact section
   - Company identity footer

4. Do NOT change:
   - Backend structure
   - Metadata for WhatsApp preview (for now)

5. Keep code clean and modular.

## Architecture Preference
Component structure:

ApplyPage
 ├── StepOneBasicInfo
 ├── StepTwoPlan
 ├── StepThreeVerification
 ├── StepFourReview
 ├── ProgressBar
 └── FormLayout
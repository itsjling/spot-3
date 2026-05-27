---
name: Spot
last_updated: 2026-05-23
---

# Spot Strategy

## Target problem

It's hard to keep track of and organize interesting places you want to visit — local spots someone told you about, places you've seen online. The crux: when you encounter a cool place in the wild, the friction between _encountering it_ and _having it in a form you can act on later_ is too high, so it gets lost.

## Our approach

Spot is built on three load-bearing bets: (1) make capture frictionless from any context — share sheet, link paste, anywhere the user encounters a spot; (2) make retrieval trustworthy through categories as the primary surface; (3) treat the social graph as both a capture channel (friends' recs flow in) and a destination (community activity is part of how you find places). Location-aware and AI-driven retrieval are supporting surfaces, not the default.

## Who it's for

**Primary:** Foodies who love to travel — they're hiring Spot as an intelligent record-keeper of interesting places, so they can try new spots around town and plan trips around the spots they've already saved.

## Key metrics

- **Time-to-save** — median seconds from share-sheet open to save complete (analytics). Tests the capture bet.
- **Marked-visited rate** — % of saved spots that get marked visited per user (analytics). Loop-closing signal: saved → actually went there.
- **Spots revisited after saving** — saved spots viewed again later (analytics). Tests retrieval trust.
- **Trips planned with pre-saved spots** — trips containing ≥1 pre-saved spot (analytics; tighten definition). Tests the second JTBD.
- **Monthly active retention** — % of users active month-over-month (analytics). Lagging trust signal.

## Tracks

### Capturing experience

All the surfaces through which a user turns an encounter into a saved spot: share sheet, link paste, voice, manual entry, friend's share, and any future capture channel.

_Why it serves the approach:_ this track is the capture bet — without low-friction capture from anywhere, the rest of the product has nothing to organize.

### Category & search intelligence

Auto-categorization of saved spots, the category browsing surface, search, and the supporting retrieval mechanisms (location-aware, AI ask-bar).

_Why it serves the approach:_ categories are the primary retrieval surface; this track makes the trust bet ("I'll find it when I need it") real.

### Trip planning

Surfaces for assembling saved spots into trips — itinerary building, map view of trip spots, sharing/exporting a trip, pre-trip prep flows.

_Why it serves the approach:_ the second JTBD ("plan trips where I've saved lots of spots") only works if there's a dedicated planning surface that knows about the saved collection.

### Social & community

Friends' recommendations as a capture source, sharing flows, community activity nearby, social signals on spots. The social graph as both an input to retrieval and a destination in its own right.

_Why it serves the approach:_ promoted from "supporting surface" to a peer of the other two — saved spots gain meaning from who recommended them and what others are doing nearby.

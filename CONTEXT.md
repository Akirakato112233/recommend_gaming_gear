# Mouse Fit Analysis

This context exists to describe a mouse-first recommendation product that matches a player to a gaming mouse using their profile and observed aim behavior.

## Language

**Mouse Fit Analysis**:
A recommendation flow that evaluates whether a gaming mouse matches a player's hand, grip, sensitivity, and aim behavior.
_Avoid_: Gaming gear recommendation, generic gear matcher

**Aim Behavior Test**:
An interactive test that observes how a player moves, stops, corrects, and clicks while aiming so the product can infer mouse fit. It does not grade the player's aim skill, and its MVP duration should total roughly 120 to 200 seconds.
_Avoid_: Aim trainer, benchmark, aim skill test, mini game

**Diagnostic Tool**:
The user-facing style of the Aim Behavior Test: a focused mouse-fit diagnostic experience with clear task feedback and no leaderboards, ranks, or skill scores.
_Avoid_: Aim trainer interface, leaderboard, ranked benchmark

**Task Feedback**:
Short confirmation shown after each Aim Behavior Test task to tell the player that a signal was captured without revealing Behavior Labels or recommendations before the full test is complete.
_Avoid_: Interim score, live diagnosis, task ranking

**Task Warm-Up**:
A short practice period before an Aim Behavior Test task that helps the player understand the interaction before real capture begins.
_Avoid_: Training round, score practice

**Limited Redo**:
A restricted retry option for the full Aim Behavior Test when a technical or comprehension issue affects capture. It is not an unlimited way to optimize results.
_Avoid_: Unlimited retry, best run selection

**Tracking Task**:
An Aim Behavior Test task that observes smoothness, shakiness, and consistency while the player follows a moving target.
_Avoid_: Tracking score

**Flick Task**:
An Aim Behavior Test task that observes movement speed, overshoot, and stopping control when the player snaps to a target.
_Avoid_: Flick score

**Click Reaction Task**:
An Aim Behavior Test task that observes click timing and target acquisition after a target appears.
_Avoid_: Reaction benchmark

**Micro-Adjustment Task**:
An Aim Behavior Test task that observes small corrections, jitter, and fine control near the target.
_Avoid_: Precision score

**Aim Metric**:
A raw measured value captured during an Aim Behavior Test, such as overshoot rate, correction distance, shakiness, time to target, click delay, or consistency variance.
_Avoid_: Aim score, skill score

**Test Summary**:
The persisted summary of an Aim Behavior Test, including Aim Metrics, Behavior Labels, Mouse Trait Match, and Mouse Recommendation results. It excludes full raw cursor paths, detailed click timelines, and gameplay replays in the MVP.
_Avoid_: Raw movement history, cursor replay, aim recording

**Shareable Result**:
A privacy-safe public summary of a Test Summary that can be shared after analysis. It may include Behavior Labels, Mouse Trait Match, Recommendation Confidence, recommended mice, and limited profile context, but not sensitive exact setup details or raw movement data.
_Avoid_: Public raw test data, editable session link

**Anonymous Session**:
The low-friction MVP identity model for completing Quick Profile, Aim Behavior Test, and recommendations without requiring login. It may support saving or sharing a result later without becoming a full account.
_Avoid_: Required login, account-first onboarding

**Behavior Label**:
A human-readable interpretation inferred from Aim Metrics, such as aggressive flicker, unstable micro-adjustment, low stopping control, smooth tracker, or high wrist aim tendency.
_Avoid_: Player rank, skill label

**Fit Explanation**:
A Thai-first natural-language explanation of a Mouse Recommendation generated from Player Profile, Aim Metrics, Behavior Labels, Mouse Trait Match, and Mouse Catalog facts. It may keep common English mouse and aim terms when Thai-only wording would be less natural, and it explains known fit evidence rather than making the recommendation decision itself.
_Avoid_: AI decision, AI verdict, black-box recommendation

**Mouse Recommendation**:
A ranked mouse suggestion produced from a player's profile and aim behavior.
_Avoid_: Gear recommendation, product listing

**Product Link**:
An optional link from a Mouse Recommendation to a place where the player can inspect or buy the mouse. It is secondary to fit evidence and must not drive ranking.
_Avoid_: Affiliate-first ranking, commerce pick

**Thailand Availability Filter**:
An optional post-analysis filter that narrows Mouse Recommendations to products available in Thailand and within the player's budget. It does not override the underlying Mouse Trait Match.
_Avoid_: Region-first ranking, budget-first ranking, global availability

**Optional Budget Range**:
The player's optional Thai baht budget range used by the Thailand Availability Filter after fit analysis. It is a range rather than an exact price.
_Avoid_: Exact budget, price-first filter

**Recommendation Confidence**:
A human-readable confidence level for a Mouse Recommendation, such as high, medium, or experimental, supported by a trait-level breakdown rather than a precise numeric score.
_Avoid_: Match score, product rating, accuracy score

**No Perfect Match**:
A Mouse Recommendation result state used when no available mouse strongly satisfies the player's Mouse Trait Match after filters. It should explain the closest compromise and its trade-offs instead of forcing a false best pick.
_Avoid_: Forced top pick, best overall fallback

**Mouse Trait Match**:
The intermediate fit result that describes the mouse traits a player needs before choosing specific products, such as size, shape, weight, hump position, support, grip surface, and click feel.
_Avoid_: Direct product match, product guess

**Mouse Catalog**:
The structured collection of gaming mice and their matchable traits, including size class, shape, dimensions, weight, hump position, grip compatibility, aim style compatibility, pros, and cons.
_Avoid_: Product descriptions, product feed, gear catalog

**Player Profile**:
The player's declared setup and preferences, including sensitivity setup, grip, hand size, current mouse, and likes or dislikes.
_Avoid_: User profile, account profile

**Quick Profile**:
The short Player Profile step completed before the Aim Behavior Test so aim behavior can be interpreted with setup, grip, hand size, and current mouse context.
_Avoid_: Onboarding survey, account setup

**Sensitivity Setup**:
The player's primary game, optional secondary games, in-game sensitivity, and mouse DPI captured together. Sensitivity without game and DPI is considered incomplete, and analysis is weighted toward the primary game.
_Avoid_: Sensitivity, eDPI-only setup

**Grip Style**:
The player's primary grip type and grip intensity captured together. Primary grip is one of palm, claw, fingertip, or hybrid; grip intensity is relaxed, neutral, or aggressive.
_Avoid_: Grip, hand position

**Hand Size**:
The player's measured hand length and hand width in millimeters, with a coarse small, medium, large, or not sure fallback when measurement is unavailable.
_Avoid_: Hand size label, glove size

**Current Mouse Feedback**:
The player's current mouse model and structured feedback about what feels good, what feels bad, discomfort areas, and desired changes.
_Avoid_: Current mouse, owned mouse

## Example Dialogue

Developer: "Should this recommend keyboards and headsets too?"

Domain expert: "No. The first product should focus on Mouse Fit Analysis because the mouse is where player behavior is easiest to observe directly."

Developer: "So the Aim Behavior Test is not a generic aim trainer?"

Domain expert: "Correct. It exists to infer mouse fit, not to rank the player's aim skill."

Developer: "Should the interactive test look like an aim trainer?"

Domain expert: "No. It should feel like a Diagnostic Tool for mouse fit, with no leaderboard, rank, or skill score language."

Developer: "Should the result say whether the player is good at aiming?"

Domain expert: "No. It should describe what mouse traits fit the player's behavior, not score the player's skill."

Developer: "Which tasks make up the Aim Behavior Test?"

Domain expert: "The MVP test should include tracking, flick, click reaction, and micro-adjustment tasks because each reveals a different mouse fit signal."

Developer: "How long should the full Aim Behavior Test take?"

Domain expert: "The MVP should take roughly 120 to 200 seconds total so it can capture meaningful patterns without feeling like a long training session."

Developer: "Should players be able to practice or redo tests?"

Domain expert: "Each task should have a short Task Warm-Up, and the full test can have Limited Redo for issues, but players should not be able to rerun indefinitely to optimize the result."

Developer: "Should each task show diagnostic results immediately?"

Domain expert: "No. Each task should show short Task Feedback that confirms capture, while Behavior Labels and recommendations wait until the full test is complete."

Developer: "Should the system keep raw measurements or only the AI-friendly labels?"

Domain expert: "It should keep both. Aim Metrics make the system testable and debuggable, while Behavior Labels make the recommendation explanation readable."

Developer: "Should the product store the full cursor movement timeline?"

Domain expert: "No. The MVP should persist Test Summary data only because full raw movement history is more sensitive and heavier than needed for mouse fit."

Developer: "Should players have to log in before testing?"

Domain expert: "No. The MVP should use Anonymous Session first so players can complete the flow before deciding whether to save or share results."

Developer: "Can players share their result?"

Domain expert: "Yes. The result can be a Shareable Result after analysis, but it should expose only a privacy-safe summary and never raw movement data or an editable session."

Developer: "Should the AI recommend a product directly from behavior?"

Domain expert: "No. The system should infer Mouse Trait Match first, then map those traits to specific mouse recommendations."

Developer: "Should AI decide the recommendation by itself?"

Domain expert: "No. Rules should infer Behavior Labels, Mouse Trait Match, and product ranking first; AI should write the Fit Explanation from those facts."

Developer: "Should the explanation be Thai or English?"

Domain expert: "Use Thai-first mixed English so the explanation feels local while preserving familiar mouse and aim terms like grip, overshoot, stopping control, shape, and hump."

Developer: "Can the catalog store only product descriptions?"

Domain expert: "No. The Mouse Catalog should store structured traits because matching must be explainable, testable, and debuggable."

Developer: "Should the result show only the picks?"

Domain expert: "No. It should show Recommendation Confidence and a trait-level breakdown so the player understands why each mouse matches or where it may be risky."

Developer: "Should the system always force a top recommendation?"

Domain expert: "No. If no mouse fits well after the Thailand Availability Filter or budget range, the result should use No Perfect Match and explain the closest compromise."

Developer: "Should buying links drive the recommendation?"

Domain expert: "No. Product Links may appear as optional follow-up actions, but fit evidence and Mouse Trait Match must drive ranking."

Developer: "Should budget and region decide the best mouse?"

Domain expert: "No. The system should find the best mouse fit first, then apply a Thailand Availability Filter for budget and local availability."

Developer: "Should the player enter an exact budget?"

Domain expert: "No. Budget should be an Optional Budget Range in Thai baht because local mouse prices change and fit should remain the primary recommendation driver."

Developer: "Can we ask for sensitivity as one number?"

Domain expert: "No. The system needs the game, in-game sensitivity, and DPI together because a sensitivity number has no meaning by itself."

Developer: "Should games be treated equally when a player plays several?"

Domain expert: "No. The player should choose one primary game and optional secondary games, with analysis weighted toward the primary game."

Developer: "Should the player test first and fill the profile later?"

Domain expert: "No. The player should complete a Quick Profile before the Aim Behavior Test because the same aim behavior can mean different mouse fit problems depending on setup and hand context."

Developer: "Is palm, claw, or fingertip enough for grip?"

Domain expert: "No. The system should capture both primary grip and intensity because relaxed claw and aggressive claw can fit different mouse shapes."

Developer: "Can hand size just be small, medium, or large?"

Domain expert: "Measured hand length and width should be preferred because mouse fit can differ for long narrow hands and short wide hands. A coarse size choice is only a fallback."

Developer: "Is the current mouse model enough?"

Domain expert: "No. The current mouse is a baseline, but the system also needs structured feedback about comfort, control, discomfort, and desired changes."

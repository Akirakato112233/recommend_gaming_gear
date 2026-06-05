# Gaming Mouse RAG Research Document

เอกสารนี้แปลงจาก research chunks ให้เป็น human-readable document สำหรับอ่านก่อนนำไปทำ RAG ingestion. ข้อมูลแต่ละรุ่นเน้น grip suitability, shape feel, aim feel, hand-size fit, common complaints, และ source confidence. รุ่นที่ source ยังบางจะระบุ confidence ต่ำไว้ชัดเจนเพื่อกันระบบ RAG ตอบเกินหลักฐาน.

- จำนวนรุ่นทั้งหมด: 35
- จำนวน research notes/chunks เดิม: 70
- Grip vocabulary หลัก: palm, claw, fingertip
- Aim vocabulary หลัก: tracking, flicking, micro-adjustment, stopping power, stability, agility

## How To Use For RAG
ใช้แต่ละ section เป็น source document แยกตาม `mouse_id` ได้เลย หรือจะ split ย่อยตามหัวข้อ `Shape`, `Grip`, `Aim feel`, `Complaints`, `Sources` ก็ได้. ถ้าใช้ semantic chunking แนะนำให้ chunk ละ 1-2 หัวข้อ ไม่ควรรวมทั้งไฟล์เป็น chunk เดียว เพราะคำถามผู้ใช้มักเฉพาะ เช่น “เหมาะกับ claw ไหม”, “มือเล็กได้ไหม”, “มีปัญหา QC ไหม”.

---
## 1. Attack Shark X3

- `mouse_id`: `attack_shark_x3`
- Brand: Attack Shark
- Model: X3
- Source confidence mix: medium: 2
- Key tags: symmetrical, small_hands, claw_grip, fingertip, agile, budget, qc_issue, mixed_opinion, common_complaint

### Summary
Attack Shark X3 is a small lightweight symmetrical mouse that is usually discussed as a budget claw or fingertip option. Its compact body gives finger freedom and quick aim movement, but users with large hands or palm-heavy grips may find it too small and not supportive enough. Attack Shark X3 is attractive as a low-price wireless FPS mouse, but RAG should treat build quality, coating consistency, and long-term switch feel as lower-confidence than Logitech or Razer. It is a good value candidate, not a safest-pick recommendation for users who prioritize QC.

### Shape และ in-hand feel
Attack Shark X3 is a small lightweight symmetrical mouse that is usually discussed as a budget claw or fingertip option. Its compact body gives finger freedom and quick aim movement, but users with large hands or palm-heavy grips may find it too small and not supportive enough.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/attack-shark/x3)

### Common complaints / QC
Attack Shark X3 is attractive as a low-price wireless FPS mouse, but RAG should treat build quality, coating consistency, and long-term switch feel as lower-confidence than Logitech or Razer. It is a good value candidate, not a safest-pick recommendation for users who prioritize QC.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/attack-shark/x3)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `small_hands`, `claw_grip`, `fingertip`, `agile`, `budget`, `qc_issue`, `mixed_opinion`, `common_complaint`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/attack-shark/x3

---
## 2. Logitech G305 Lightspeed

- `mouse_id`: `logitech_g305_lightspeed`
- Brand: Logitech
- Model: G305 Lightspeed
- Source confidence mix: high: 2
- Key tags: symmetrical, small_hands, medium_hands, claw_grip, fingertip, rear_weight, budget, battery_life, common_complaint, not_ultralight, flicking

### Summary
Logitech G305 Lightspeed has an egg-like symmetrical shape that works well for claw and fingertip users who like a narrow, compact shell. The AA-battery weight makes it feel more rear-heavy than modern ultralight mice, so it can feel stable but less effortless for fast flicking. The most common practical drawback of the G305 Lightspeed is its AA battery design: it adds weight and makes the mouse feel less modern than rechargeable ultralight FPS mice. Users who are sensitive to weight balance may perceive it as rear-heavy or slower for fast low-sensitivity flicks.

### Shape และ in-hand feel
Logitech G305 Lightspeed has an egg-like symmetrical shape that works well for claw and fingertip users who like a narrow, compact shell. The AA-battery weight makes it feel more rear-heavy than modern ultralight mice, so it can feel stable but less effortless for fast flicking.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g305-lightspeed)

### Common complaints / QC
The most common practical drawback of the G305 Lightspeed is its AA battery design: it adds weight and makes the mouse feel less modern than rechargeable ultralight FPS mice. Users who are sensitive to weight balance may perceive it as rear-heavy or slower for fast low-sensitivity flicks.

Confidence: `high` | Source: [professional_review](https://www.tomsguide.com/computing/peripherals/Logitech-G305-Lightspeed-review)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `symmetrical`, `small_hands`, `medium_hands`, `claw_grip`, `fingertip`, `rear_weight`, `budget`, `battery_life`, `common_complaint`, `not_ultralight`, `flicking`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g305-lightspeed
- professional_review: https://www.tomsguide.com/computing/peripherals/Logitech-G305-Lightspeed-review

---
## 3. Logitech G502 Lightspeed

- `mouse_id`: `logitech_g502_lightspeed`
- Brand: Logitech
- Model: G502 Lightspeed
- Source confidence mix: high: 2
- Key tags: ergonomic, palm_grip, relaxed_claw, large_hands, heavy, control, not_ultralight, micro_adjustment, common_complaint

### Summary
Logitech G502 Lightspeed is a feature-heavy ergonomic mouse with many buttons, a thumb rest, and a heavier body. It is comfortable for palm or relaxed claw and productivity/MMO-style use, but it is not ideal for users who want a light FPS mouse for quick micro-adjustment and low-effort tracking. G502 Lightspeed is often a poor match for users asking for light competitive FPS aim because the shape is large and feature-heavy. Its weight and thumb-rest ergonomics can feel grounded and controlled, but not agile for repeated micro-adjustments.

### Game fit
Logitech G502 Lightspeed is a feature-heavy ergonomic mouse with many buttons, a thumb rest, and a heavier body. It is comfortable for palm or relaxed claw and productivity/MMO-style use, but it is not ideal for users who want a light FPS mouse for quick micro-adjustment and low-effort tracking.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g502-lightspeed)

### Common complaints / QC
G502 Lightspeed is often a poor match for users asking for light competitive FPS aim because the shape is large and feature-heavy. Its weight and thumb-rest ergonomics can feel grounded and controlled, but not agile for repeated micro-adjustments.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g502-lightspeed)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `ergonomic`, `palm_grip`, `relaxed_claw`, `large_hands`, `heavy`, `control`, `not_ultralight`, `micro_adjustment`, `common_complaint`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g502-lightspeed

---
## 4. Razer DeathAdder V3 Pro Wireless

- `mouse_id`: `razer_deathadder_v3_pro_wireless`
- Brand: Razer
- Model: DeathAdder V3 Pro Wireless
- Source confidence mix: high: 1, medium: 1
- Key tags: ergonomic, palm_grip, relaxed_claw, large_hands, stability, stopping_power, tactical_fps, zowie_ec2, finger_freedom, shape_comparison

### Summary
Razer DeathAdder V3 Pro Wireless is a large right-handed ergonomic shape with strong palm contact and a high, comfortable shell. It is a strong fit for palm and relaxed claw users who want stability and stopping power in tactical FPS, but small-hand fingertip users may find it too bulky. DeathAdder V3 Pro is frequently compared to Zowie EC-style ergonomic mice because it gives strong right-handed palm support with a competitive FPS weight. Compared with symmetrical mice like Viper or GPX, it feels more guided and stable but gives less finger freedom.

### Palm grip fit
Razer DeathAdder V3 Pro Wireless is a large right-handed ergonomic shape with strong palm contact and a high, comfortable shell. It is a strong fit for palm and relaxed claw users who want stability and stopping power in tactical FPS, but small-hand fingertip users may find it too bulky.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/razer/deathadder-v3-pro)

### Shape comparison
DeathAdder V3 Pro is frequently compared to Zowie EC-style ergonomic mice because it gives strong right-handed palm support with a competitive FPS weight. Compared with symmetrical mice like Viper or GPX, it feels more guided and stable but gives less finger freedom.

Confidence: `medium` | Source: [reddit](https://www.reddit.com/r/MouseReview/comments/wv3drb)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ palm หรือ palm-claw; เกม tactical FPS เช่น Valorant / CS2.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `ergonomic`, `palm_grip`, `relaxed_claw`, `large_hands`, `stability`, `stopping_power`, `tactical_fps`, `zowie_ec2`, `finger_freedom`, `shape_comparison`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/razer/deathadder-v3-pro
- reddit: https://www.reddit.com/r/MouseReview/comments/wv3drb

---
## 5. Razer Viper V3 Pro Wireless

- `mouse_id`: `razer_viper_v3_pro_wireless`
- Brand: Razer
- Model: Viper V3 Pro Wireless
- Source confidence mix: high: 1, medium: 1
- Key tags: symmetrical, safe_shape, claw_grip, relaxed_claw, flicking, stopping_power, valorant, cs2, medium_hands, large_hands, center_hump, fingertip, mixed_opinion

### Summary
Razer Viper V3 Pro Wireless is a lightweight symmetrical FPS mouse with a safer, taller shape than older low-profile Vipers. It suits claw and relaxed claw users who want fast flicking with enough hump support to stop the mouse cleanly, while pure fingertip users may prefer something smaller. Viper V3 Pro is not a tiny fingertip-only mouse; community feedback often frames it as a medium-to-large symmetrical shape with a higher center hump than older Vipers. Small or narrow-hand users may prefer smaller shapes if the front flare or overall size feels awkward.

### Shape และ in-hand feel
Razer Viper V3 Pro Wireless is a lightweight symmetrical FPS mouse with a safer, taller shape than older low-profile Vipers. It suits claw and relaxed claw users who want fast flicking with enough hump support to stop the mouse cleanly, while pure fingertip users may prefer something smaller.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/razer/viper-v3-pro)

### Hand size fit
Viper V3 Pro is not a tiny fingertip-only mouse; community feedback often frames it as a medium-to-large symmetrical shape with a higher center hump than older Vipers. Small or narrow-hand users may prefer smaller shapes if the front flare or overall size feels awkward.

Confidence: `medium` | Source: [reddit](https://www.reddit.com/r/MouseReview/comments/1cdwgwc/viper_v3_pro_review_the_new_standard_in_mice/)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; เกม tactical FPS เช่น Valorant / CS2.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `safe_shape`, `claw_grip`, `relaxed_claw`, `flicking`, `stopping_power`, `valorant`, `cs2`, `medium_hands`, `large_hands`, `center_hump`, `fingertip`, `mixed_opinion`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/razer/viper-v3-pro
- reddit: https://www.reddit.com/r/MouseReview/comments/1cdwgwc/viper_v3_pro_review_the_new_standard_in_mice/

---
## 6. Logitech G Pro X Superlight 2

- `mouse_id`: `logitech_g_pro_x_superlight_2`
- Brand: Logitech
- Model: G Pro X Superlight 2
- Source confidence mix: high: 1, medium: 1
- Key tags: symmetrical, safe_shape, center_hump, medium_hands, palm_grip, claw_grip, flexible_grip, wide_grip, mixed_opinion, finger_freedom, not_locked_in

### Summary
Logitech G Pro X Superlight 2 keeps the safe GPX symmetrical shape with a centered hump and moderate palm contact. It is flexible across palm, claw, and relaxed claw for medium hands, but it does not strongly lock the hand into a single grip style. The GPX 2 safe shape is also its main complaint: some users find it too generic, wide, or not locked-in enough for a specific grip. For users who want a strong rear hump or a narrow fingertip shell, the GPX 2 may feel comfortable but not precise enough in hand placement.

### Shape และ in-hand feel
Logitech G Pro X Superlight 2 keeps the safe GPX symmetrical shape with a centered hump and moderate palm contact. It is flexible across palm, claw, and relaxed claw for medium hands, but it does not strongly lock the hand into a single grip style.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g-pro-x-superlight-2)

### Common complaints / QC
The GPX 2 safe shape is also its main complaint: some users find it too generic, wide, or not locked-in enough for a specific grip. For users who want a strong rear hump or a narrow fingertip shell, the GPX 2 may feel comfortable but not precise enough in hand placement.

Confidence: `medium` | Source: [reddit](https://www.reddit.com/r/MouseReview/comments/1ppc9wi/g_pro_x_superlight_2_feels_too_big_for_narrow/)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `safe_shape`, `center_hump`, `medium_hands`, `palm_grip`, `claw_grip`, `flexible_grip`, `wide_grip`, `mixed_opinion`, `finger_freedom`, `not_locked_in`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g-pro-x-superlight-2
- reddit: https://www.reddit.com/r/MouseReview/comments/1ppc9wi/g_pro_x_superlight_2_feels_too_big_for_narrow/

---
## 7. Razer Basilisk V3 Pro 35K Wireless

- `mouse_id`: `razer_basilisk_v3_pro_35k_wireless`
- Brand: Razer
- Model: Basilisk V3 Pro 35K Wireless
- Source confidence mix: high: 2
- Key tags: ergonomic, palm_grip, large_hands, heavy, software, productivity, not_ultralight, side_buttons, scroll_wheel

### Summary
Razer Basilisk V3 Pro 35K Wireless is an ergonomic feature mouse with a thumb rest, heavier body, and many controls. It is better for comfort, productivity, and casual gaming than pure competitive FPS where low weight and fast micro-adjustment matter most. Basilisk V3 Pro 35K is a better RAG match when the user asks for features, comfort, wheel modes, and programmable controls rather than pure aim speed. Its value is versatility and ergonomics, not ultralight competitive minimalism.

### Game fit
Razer Basilisk V3 Pro 35K Wireless is an ergonomic feature mouse with a thumb rest, heavier body, and many controls. It is better for comfort, productivity, and casual gaming than pure competitive FPS where low weight and fast micro-adjustment matter most.

Confidence: `high` | Source: [official](https://www.razer.com/gaming-mice/razer-basilisk-v3-pro-35k)

### Software / controls
Basilisk V3 Pro 35K is a better RAG match when the user asks for features, comfort, wheel modes, and programmable controls rather than pure aim speed. Its value is versatility and ergonomics, not ultralight competitive minimalism.

Confidence: `high` | Source: [official](https://www.razer.com/gaming-mice/razer-basilisk-v3-pro-35k)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `ergonomic`, `palm_grip`, `large_hands`, `heavy`, `software`, `productivity`, `not_ultralight`, `side_buttons`, `scroll_wheel`

### Sources
- official: https://www.razer.com/gaming-mice/razer-basilisk-v3-pro-35k

---
## 8. Razer DeathAdder V4 Pro Wireless

- `mouse_id`: `razer_deathadder_v4_pro_wireless`
- Brand: Razer
- Model: DeathAdder V4 Pro Wireless
- Source confidence mix: low: 2
- Key tags: ergonomic, palm_grip, relaxed_claw, stability, large_hands, tactical_fps, medium_hands, not_fingertip, low_confidence

### Summary
Razer DeathAdder V4 Pro Wireless continues the DeathAdder ergonomic family, so the expected fit is palm and relaxed claw with strong right-side hand support. Use it for users who want a stable ergo FPS feel, but keep confidence lower until more long-term community feedback is available. DeathAdder V4 Pro should be considered a safer recommendation for medium-to-large hands than small hands because the DeathAdder family is built around palm contact and ergonomic support. If a user reports fingertip grip or short hand length, recommend testing smaller alternatives first.

### Shape และ in-hand feel
Razer DeathAdder V4 Pro Wireless continues the DeathAdder ergonomic family, so the expected fit is palm and relaxed claw with strong right-side hand support. Use it for users who want a stable ergo FPS feel, but keep confidence lower until more long-term community feedback is available.

Confidence: `low` | Source: [official](https://www.razer.com/gaming-mice/razer-deathadder-v4-pro)

### Hand size fit
DeathAdder V4 Pro should be considered a safer recommendation for medium-to-large hands than small hands because the DeathAdder family is built around palm contact and ergonomic support. If a user reports fingertip grip or short hand length, recommend testing smaller alternatives first.

Confidence: `low` | Source: [official](https://www.razer.com/gaming-mice/razer-deathadder-v4-pro)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ palm หรือ palm-claw; เกม tactical FPS เช่น Valorant / CS2.

ควรระวัง: grip style ที่ source บอกว่าไม่เหมาะ; main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `ergonomic`, `palm_grip`, `relaxed_claw`, `stability`, `large_hands`, `tactical_fps`, `medium_hands`, `not_fingertip`, `low_confidence`

### Sources
- official: https://www.razer.com/gaming-mice/razer-deathadder-v4-pro

---
## 9. Logitech G Pro 2 Lightspeed

- `mouse_id`: `logitech_g_pro_2_lightspeed`
- Brand: Logitech
- Model: G Pro 2 Lightspeed
- Source confidence mix: medium: 2
- Key tags: symmetrical, safe_shape, medium_hands, g_pro_wireless, claw_grip, palm_grip, shape_comparison, side_buttons, software, not_ultralight

### Summary
Logitech G Pro 2 Lightspeed uses the familiar G Pro Wireless family shape rather than the lower-weight Superlight shell. It is safer for users who like a fuller ambidextrous body and optional side-button layout, but it feels less specialized for ultralight FPS than GPX-style mice. G Pro 2 Lightspeed is useful when the user wants the G Pro Wireless style with modern internals and modular side-button flexibility. It should not be treated as the lightest esports pick; GPX 2 remains a better fit for weight-sensitive FPS players.

### Shape comparison
Logitech G Pro 2 Lightspeed uses the familiar G Pro Wireless family shape rather than the lower-weight Superlight shell. It is safer for users who like a fuller ambidextrous body and optional side-button layout, but it feels less specialized for ultralight FPS than GPX-style mice.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g-pro-2-lightspeed)

### Software / controls
G Pro 2 Lightspeed is useful when the user wants the G Pro Wireless style with modern internals and modular side-button flexibility. It should not be treated as the lightest esports pick; GPX 2 remains a better fit for weight-sensitive FPS players.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g-pro-2-lightspeed)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `symmetrical`, `safe_shape`, `medium_hands`, `g_pro_wireless`, `claw_grip`, `palm_grip`, `shape_comparison`, `side_buttons`, `software`, `not_ultralight`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g-pro-2-lightspeed

---
## 10. LAMZU Maya X

- `mouse_id`: `lamzu_maya_x`
- Brand: LAMZU
- Model: Maya X
- Source confidence mix: medium: 2
- Key tags: symmetrical, safe_shape, medium_hands, large_hands, claw_grip, palm_grip, agile, gpx, shape_comparison

### Summary
LAMZU Maya X is a lightweight symmetrical mouse with a larger Maya-style safe shape. It is useful for medium to large hands that want GPX-like flexibility with a lighter, more agile feel for tracking and flick-heavy FPS. Maya X should be compared against GPX-style safe symmetrical mice, but with a more enthusiast lightweight feel. It is useful for users who like the idea of a safe shape but want something less mainstream and more agile for FPS.

### Shape และ in-hand feel
LAMZU Maya X is a lightweight symmetrical mouse with a larger Maya-style safe shape. It is useful for medium to large hands that want GPX-like flexibility with a lighter, more agile feel for tracking and flick-heavy FPS.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=Lamzu%20Maya%20X)

### Shape comparison
Maya X should be compared against GPX-style safe symmetrical mice, but with a more enthusiast lightweight feel. It is useful for users who like the idea of a safe shape but want something less mainstream and more agile for FPS.

Confidence: `medium` | Source: [official](https://lamzu.com/products/lamzu-maya-x)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `safe_shape`, `medium_hands`, `large_hands`, `claw_grip`, `palm_grip`, `agile`, `gpx`, `shape_comparison`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=Lamzu%20Maya%20X
- official: https://lamzu.com/products/lamzu-maya-x

---
## 11. MCHOSE L7 Ultra

- `mouse_id`: `mchose_l7_ultra`
- Brand: MCHOSE
- Model: L7 Ultra
- Source confidence mix: medium: 2
- Key tags: symmetrical, small_hands, claw_grip, fingertip, agile, micro_adjustment, medium_hands, budget

### Summary
MCHOSE L7 Ultra is a small lightweight symmetrical mouse that should mainly be considered for claw and fingertip grip users. Its smaller shell supports agile aiming and quick corrections, but it is not a strong palm-support recommendation. MCHOSE L7 Ultra should be routed toward small-to-medium hands rather than large palm users. Its RAG role is a compact value mouse for claw/fingertip users who want low inertia and quick corrections.

### Fingertip fit
MCHOSE L7 Ultra is a small lightweight symmetrical mouse that should mainly be considered for claw and fingertip grip users. Its smaller shell supports agile aiming and quick corrections, but it is not a strong palm-support recommendation.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/mchose/l7-ultra)

### Hand size fit
MCHOSE L7 Ultra should be routed toward small-to-medium hands rather than large palm users. Its RAG role is a compact value mouse for claw/fingertip users who want low inertia and quick corrections.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/mchose/l7-ultra)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `small_hands`, `claw_grip`, `fingertip`, `agile`, `micro_adjustment`, `medium_hands`, `budget`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/mchose/l7-ultra

---
## 12. Logitech G502 X Plus

- `mouse_id`: `logitech_g502x_plus`
- Brand: Logitech
- Model: G502 X Plus
- Source confidence mix: high: 2
- Key tags: ergonomic, palm_grip, large_hands, heavy, control, software, not_ultralight, common_complaint, micro_adjustment

### Summary
Logitech G502 X Plus is a large ergonomic wireless mouse with RGB, a thumb rest, and many buttons. It is comfortable for palm grip and mixed gaming/productivity, but its weight and shape make it less ideal for users seeking a pure competitive FPS mouse. G502 X Plus can be too heavy and bulky for users coming from lightweight FPS mice. It is better described as comfortable and feature-rich than fast, so avoid recommending it to users who complain about heavy mice or slow micro-adjustment.

### Game fit
Logitech G502 X Plus is a large ergonomic wireless mouse with RGB, a thumb rest, and many buttons. It is comfortable for palm grip and mixed gaming/productivity, but its weight and shape make it less ideal for users seeking a pure competitive FPS mouse.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g502-x-plus)

### Common complaints / QC
G502 X Plus can be too heavy and bulky for users coming from lightweight FPS mice. It is better described as comfortable and feature-rich than fast, so avoid recommending it to users who complain about heavy mice or slow micro-adjustment.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g502-x-plus)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `ergonomic`, `palm_grip`, `large_hands`, `heavy`, `control`, `software`, `not_ultralight`, `common_complaint`, `micro_adjustment`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g502-x-plus

---
## 13. Corsair Sabre V2 Pro

- `mouse_id`: `corsair_sabre_v2_pro`
- Brand: Corsair
- Model: Sabre V2 Pro
- Source confidence mix: medium: 2
- Key tags: symmetrical, ultralight, flicking, agile, fps, claw_grip, fingertip, speed, not_locked_in

### Summary
Corsair Sabre V2 Pro is positioned as an ultralight FPS mouse with a simple shape and very low weight. It should feel fast and easy to start/stop for flicking, but shape confidence should stay medium until more long-term community feedback is available. Sabre V2 Pro's main retrieval value is very low weight in a simple FPS-focused shell. This makes it a good candidate for users who want speed and low fatigue, while users who need a locked-in hump should compare it with claw-focused shapes first.

### Aim feel
Corsair Sabre V2 Pro is positioned as an ultralight FPS mouse with a simple shape and very low weight. It should feel fast and easy to start/stop for flicking, but shape confidence should stay medium until more long-term community feedback is available.

Confidence: `medium` | Source: [professional_review](https://www.tomshardware.com/peripherals/gaming-mice/corsair-sabre-v2-pro-review)

### Weight balance
Sabre V2 Pro's main retrieval value is very low weight in a simple FPS-focused shell. This makes it a good candidate for users who want speed and low fatigue, while users who need a locked-in hump should compare it with claw-focused shapes first.

Confidence: `medium` | Source: [professional_review](https://www.tomshardware.com/peripherals/gaming-mice/corsair-sabre-v2-pro-review)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `ultralight`, `flicking`, `agile`, `fps`, `claw_grip`, `fingertip`, `speed`, `not_locked_in`

### Sources
- professional_review: https://www.tomshardware.com/peripherals/gaming-mice/corsair-sabre-v2-pro-review

---
## 14. ASUS ROG Harpe II Ace

- `mouse_id`: `asus_rog_harpe_2_ace`
- Brand: ASUS ROG
- Model: Harpe II Ace
- Source confidence mix: medium: 2
- Key tags: symmetrical, claw_grip, fingertip, agile, fps, medium_hands, flicking, tracking, not_productivity

### Summary
ASUS ROG Harpe II Ace is a lightweight symmetrical FPS mouse intended for speed and competitive aim. It fits claw and fingertip-style users who want a narrow, agile shell, while palm users should verify hand comfort because the shape is not a large ergo support mouse. ROG Harpe II Ace is best matched to competitive FPS users who want a light symmetrical mouse with high-end wireless performance. It is not a feature mouse like Basilisk or G502, so the RAG should frame it around aim speed and grip fit rather than productivity controls.

### Shape และ in-hand feel
ASUS ROG Harpe II Ace is a lightweight symmetrical FPS mouse intended for speed and competitive aim. It fits claw and fingertip-style users who want a narrow, agile shell, while palm users should verify hand comfort because the shape is not a large ergo support mouse.

Confidence: `medium` | Source: [official](https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-harpe-ii-ace/)

### Game fit
ROG Harpe II Ace is best matched to competitive FPS users who want a light symmetrical mouse with high-end wireless performance. It is not a feature mouse like Basilisk or G502, so the RAG should frame it around aim speed and grip fit rather than productivity controls.

Confidence: `medium` | Source: [official](https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-harpe-ii-ace/)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; เกมหรือ aim style ที่ต้อง tracking.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `claw_grip`, `fingertip`, `agile`, `fps`, `medium_hands`, `flicking`, `tracking`, `not_productivity`

### Sources
- official: https://rog.asus.com/mice-mouse-pads/mice/wireless/rog-harpe-ii-ace/

---
## 15. Logitech G Pro Wireless

- `mouse_id`: `logitech_g_pro`
- Brand: Logitech
- Model: G Pro Wireless
- Source confidence mix: high: 2
- Key tags: symmetrical, safe_shape, medium_hands, palm_grip, claw_grip, g_pro_wireless, common_complaint, not_ultralight, side_buttons, budget

### Summary
Logitech G Pro Wireless has a fuller symmetrical shape than the Superlight series and supports a flexible grip range. It is still safe for claw and palm-claw users, but its older weight and clicks can feel less modern than GPX 2 or current ultralight options. G Pro Wireless is still a safe symmetrical shape, but its older weight and design can feel dated beside GPX 2 and newer ultralights. Recommend it when price is good or side-button flexibility matters, not when the user asks for the lightest modern FPS feel.

### Shape และ in-hand feel
Logitech G Pro Wireless has a fuller symmetrical shape than the Superlight series and supports a flexible grip range. It is still safe for claw and palm-claw users, but its older weight and clicks can feel less modern than GPX 2 or current ultralight options.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g-pro-wireless)

### Common complaints / QC
G Pro Wireless is still a safe symmetrical shape, but its older weight and design can feel dated beside GPX 2 and newer ultralights. Recommend it when price is good or side-button flexibility matters, not when the user asks for the lightest modern FPS feel.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/logitech/g-pro-wireless)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ palm หรือ palm-claw; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: คนที่ต้องการ ultralight FPS mouse.

Retrieval tags: `symmetrical`, `safe_shape`, `medium_hands`, `palm_grip`, `claw_grip`, `g_pro_wireless`, `common_complaint`, `not_ultralight`, `side_buttons`, `budget`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/logitech/g-pro-wireless

---
## 16. LAMZU Maya X 8K

- `mouse_id`: `maya_x_8k`
- Brand: LAMZU
- Model: Maya X 8K
- Source confidence mix: medium: 2
- Key tags: symmetrical, safe_shape, claw_grip, palm_grip, sensor, polling_8k, battery_life, fps, latency, mixed_opinion

### Summary
Maya X 8K should be treated as the high-polling Maya X variant for RAG matching: the shape remains the main fit factor, while 8K polling is a performance feature that may improve responsiveness but also increases battery drain. Recommend it mainly when the user already likes the Maya X shape and wants high polling. For Maya X 8K, treat 8K polling as a responsiveness feature with a battery tradeoff rather than a universal upgrade. RAG should only prioritize 8K if the user explicitly cares about polling rate or competitive latency.

### Sensor / polling
Maya X 8K should be treated as the high-polling Maya X variant for RAG matching: the shape remains the main fit factor, while 8K polling is a performance feature that may improve responsiveness but also increases battery drain. Recommend it mainly when the user already likes the Maya X shape and wants high polling.

Confidence: `medium` | Source: [official](https://lamzu.com/products/lamzu-maya-x)

### Battery
For Maya X 8K, treat 8K polling as a responsiveness feature with a battery tradeoff rather than a universal upgrade. RAG should only prioritize 8K if the user explicitly cares about polling rate or competitive latency.

Confidence: `medium` | Source: [official](https://lamzu.com/products/lamzu-maya-x)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `safe_shape`, `claw_grip`, `palm_grip`, `sensor`, `polling_8k`, `battery_life`, `fps`, `latency`, `mixed_opinion`

### Sources
- official: https://lamzu.com/products/lamzu-maya-x

---
## 17. Ajazz AJ159 Apex

- `mouse_id`: `ajazz_aj159_apex`
- Brand: Ajazz
- Model: AJ159 Apex
- Source confidence mix: medium: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, agile, mixed_opinion, qc_issue, coating, clicks

### Summary
Ajazz AJ159 Apex is a budget lightweight symmetrical mouse commonly considered for claw and fingertip grip. Treat it as a value option for users who want modern wireless performance cheaply, but keep build-quality confidence below premium brands until more long-term feedback is collected. AJ159 Apex should be treated as a value-first recommendation where specs may look strong for the price, but long-term coating, buttons, and QC deserve caution. It is useful for budget claw/fingertip matching, not for users asking for the safest premium build.

### Shape และ in-hand feel
Ajazz AJ159 Apex is a budget lightweight symmetrical mouse commonly considered for claw and fingertip grip. Treat it as a value option for users who want modern wireless performance cheaply, but keep build-quality confidence below premium brands until more long-term feedback is collected.

Confidence: `medium` | Source: [professional_review](https://gearmetrix.com/mice/ajazz-aj159-apex)

### Common complaints / QC
AJ159 Apex should be treated as a value-first recommendation where specs may look strong for the price, but long-term coating, buttons, and QC deserve caution. It is useful for budget claw/fingertip matching, not for users asking for the safest premium build.

Confidence: `medium` | Source: [professional_review](https://gearmetrix.com/mice/ajazz-aj159-apex)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `agile`, `mixed_opinion`, `qc_issue`, `coating`, `clicks`

### Sources
- professional_review: https://gearmetrix.com/mice/ajazz-aj159-apex

---
## 18. Razer Viper V4 Pro

- `mouse_id`: `razer_viper_v4_pro`
- Brand: Razer
- Model: Viper V4 Pro
- Source confidence mix: medium: 2
- Key tags: symmetrical, claw_grip, fingertip, flicking, agile, fps, high_polling, sensor, tracking

### Summary
Razer Viper V4 Pro is a competitive symmetrical FPS mouse aimed at fast aim, low weight, and high polling. It should be matched to claw and fingertip-leaning users who want an agile mouse, while users who need more palm fill may prefer Viper V3 Pro or GPX-style shapes. Viper V4 Pro should be retrieved for users who ask for top-tier sensor, high polling, and competitive FPS responsiveness. As with other Viper shapes, grip fit matters more than raw specs, so avoid recommending it if the user dislikes symmetrical low-support mice.

### Shape และ in-hand feel
Razer Viper V4 Pro is a competitive symmetrical FPS mouse aimed at fast aim, low weight, and high polling. It should be matched to claw and fingertip-leaning users who want an agile mouse, while users who need more palm fill may prefer Viper V3 Pro or GPX-style shapes.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/razer/viper-v4-pro)

### Sensor / polling
Viper V4 Pro should be retrieved for users who ask for top-tier sensor, high polling, and competitive FPS responsiveness. As with other Viper shapes, grip fit matters more than raw specs, so avoid recommending it if the user dislikes symmetrical low-support mice.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/razer/viper-v4-pro)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; เกมหรือ aim style ที่ต้อง tracking.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `claw_grip`, `fingertip`, `flicking`, `agile`, `fps`, `high_polling`, `sensor`, `tracking`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/razer/viper-v4-pro

---
## 19. Attack Shark X3 Pro

- `mouse_id`: `attack_shark_x3_pro`
- Brand: Attack Shark
- Model: X3 Pro
- Source confidence mix: low: 2
- Key tags: symmetrical, budget, small_hands, claw_grip, fingertip, agile, qc_issue, clicks, coating, common_complaint

### Summary
Attack Shark X3 Pro should be treated as a related X3-family compact symmetrical mouse for claw and fingertip users. Use it as a budget alternative when the user wants an agile small shell, but do not overstate QC or long-term durability without more community evidence. Attack Shark X3 Pro should be handled as a budget performance mouse where the price is the main appeal. For RAG, surface it when users accept some QC risk, but avoid it for users who strongly care about coating consistency, warranty, or premium click feel.

### Shape comparison
Attack Shark X3 Pro should be treated as a related X3-family compact symmetrical mouse for claw and fingertip users. Use it as a budget alternative when the user wants an agile small shell, but do not overstate QC or long-term durability without more community evidence.

Confidence: `low` | Source: [official](https://attackshark.com/products/attack-shark-x3-pro)

### Common complaints / QC
Attack Shark X3 Pro should be handled as a budget performance mouse where the price is the main appeal. For RAG, surface it when users accept some QC risk, but avoid it for users who strongly care about coating consistency, warranty, or premium click feel.

Confidence: `low` | Source: [official](https://attackshark.com/products/attack-shark-x3-pro)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `small_hands`, `claw_grip`, `fingertip`, `agile`, `qc_issue`, `clicks`, `coating`, `common_complaint`

### Sources
- official: https://attackshark.com/products/attack-shark-x3-pro

---
## 20. MCHOSE A7 Ultra

- `mouse_id`: `mchose_a7_ultra`
- Brand: MCHOSE
- Model: A7 Ultra
- Source confidence mix: low: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, low_confidence, needs_verification, qc_issue

### Summary
MCHOSE A7 Ultra appears to target users who want a lightweight wireless symmetrical mouse at a lower price than major brands. Use low confidence for grip fit until stronger shape reviews are available, but claw and fingertip are safer assumptions than full palm support. MCHOSE A7 Ultra needs cautious retrieval because model-specific English long-term feedback is thin. If recommended, pair it with wording that it is a budget/experimental pick rather than a proven safe choice like GPX 2 or Viper V3 Pro.

### Shape และ in-hand feel
MCHOSE A7 Ultra appears to target users who want a lightweight wireless symmetrical mouse at a lower price than major brands. Use low confidence for grip fit until stronger shape reviews are available, but claw and fingertip are safer assumptions than full palm support.

Confidence: `low` | Source: [other](https://www.techxreviews.com/mchose-a7-ultra-review/)

### Common complaints / QC
MCHOSE A7 Ultra needs cautious retrieval because model-specific English long-term feedback is thin. If recommended, pair it with wording that it is a budget/experimental pick rather than a proven safe choice like GPX 2 or Viper V3 Pro.

Confidence: `low` | Source: [other](https://www.techxreviews.com/mchose-a7-ultra-review/)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม; ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `low_confidence`, `needs_verification`, `qc_issue`

### Sources
- other: https://www.techxreviews.com/mchose-a7-ultra-review/

---
## 21. ATK / VXE MAD R

- `mouse_id`: `atk_vxe_mad_r`
- Brand: ATK / VXE
- Model: MAD R
- Source confidence mix: low: 2
- Key tags: symmetrical, claw_grip, fingertip, fps, budget, mixed_opinion, agile

### Summary
VXE MAD R is generally discussed as a lightweight modern wireless mouse for FPS users, with claw and fingertip being the safer fit targets. Because official and long-term English feedback is less consistent than for Logitech/Razer, treat build-quality and shape claims as medium to low confidence. VXE MAD R should be indexed as an agile value FPS mouse for users who want modern light wireless performance without flagship pricing. Keep shape and QC confidence medium-low unless the user already knows they like VXE-style compact symmetrical mice.

### Shape และ in-hand feel
VXE MAD R is generally discussed as a lightweight modern wireless mouse for FPS users, with claw and fingertip being the safer fit targets. Because official and long-term English feedback is less consistent than for Logitech/Razer, treat build-quality and shape claims as medium to low confidence.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20MAD%20R)

### Agility
VXE MAD R should be indexed as an agile value FPS mouse for users who want modern light wireless performance without flagship pricing. Keep shape and QC confidence medium-low unless the user already knows they like VXE-style compact symmetrical mice.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20MAD%20R)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `claw_grip`, `fingertip`, `fps`, `budget`, `mixed_opinion`, `agile`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=VXE%20MAD%20R

---
## 22. VXE Dragonfly R1 Pro

- `mouse_id`: `vxe_dragonfly_r1_pro`
- Brand: VXE
- Model: Dragonfly R1 Pro
- Source confidence mix: medium: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, agile, fps, common_praise, qc_issue, coating

### Summary
VXE Dragonfly R1 Pro is a lightweight budget symmetrical mouse often compared with other small-to-medium Chinese FPS mice. It should fit claw and fingertip users who value agility, but RAG should surface it as a value pick rather than a premium build-quality pick. VXE Dragonfly R1 Pro is commonly valued for price-to-performance, but RAG should not overclaim premium coating or flawless QC. It fits users willing to trade brand polish for low cost and agile FPS handling.

### Shape และ in-hand feel
VXE Dragonfly R1 Pro is a lightweight budget symmetrical mouse often compared with other small-to-medium Chinese FPS mice. It should fit claw and fingertip users who value agility, but RAG should surface it as a value pick rather than a premium build-quality pick.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20Dragonfly%20R1%20Pro)

### Common complaints / QC
VXE Dragonfly R1 Pro is commonly valued for price-to-performance, but RAG should not overclaim premium coating or flawless QC. It fits users willing to trade brand polish for low cost and agile FPS handling.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20Dragonfly%20R1%20Pro)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `agile`, `fps`, `common_praise`, `qc_issue`, `coating`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=VXE%20Dragonfly%20R1%20Pro

---
## 23. Endgame Gear XM2w 4K Wireless

- `mouse_id`: `endgame_gear_xm2w_4k_wireless`
- Brand: Endgame Gear
- Model: XM2w 4K Wireless
- Source confidence mix: high: 2
- Key tags: symmetrical, rear_hump, claw_grip, relaxed_claw, aggressive_claw, locked_in, stopping_power, control, flicking

### Summary
Endgame Gear XM2w 4K Wireless follows the XM shape family with a rear-hump, claw-focused design. It is strong for relaxed and aggressive claw users who want locked-in stopping power, but the shape can feel restrictive for fingertip users who want maximum finger movement. XM2w 4K is especially useful for users who overshoot and need more locked-in stopping power from the rear hump. The shape supports claw anchoring and controlled flick stops better than very flat fingertip-focused mice.

### Claw grip fit
Endgame Gear XM2w 4K Wireless follows the XM shape family with a rear-hump, claw-focused design. It is strong for relaxed and aggressive claw users who want locked-in stopping power, but the shape can feel restrictive for fingertip users who want maximum finger movement.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/endgame-gear/xm2w-4k)

### Stopping power
XM2w 4K is especially useful for users who overshoot and need more locked-in stopping power from the rear hump. The shape supports claw anchoring and controlled flick stops better than very flat fingertip-focused mice.

Confidence: `high` | Source: [professional_review](https://www.rtings.com/mouse/reviews/endgame-gear/xm2w-4k)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `rear_hump`, `claw_grip`, `relaxed_claw`, `aggressive_claw`, `locked_in`, `stopping_power`, `control`, `flicking`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/endgame-gear/xm2w-4k

---
## 24. Logitech Pro X2 Super Strike

- `mouse_id`: `logitech_pro_x2_super_strike`
- Brand: Logitech
- Model: Pro X2 Super Strike
- Source confidence mix: medium: 1, low: 1
- Key tags: low_confidence, needs_verification, logitech, fps, gpx, symmetrical, safe_shape, clicks, shape_comparison, claw_grip

### Summary
Logitech Pro X2 Super Strike has limited verified public review data compared with GPX 2 and G Pro 2 Lightspeed. Treat it as a low-confidence Logitech pro-series entry until official specs and long-term shape feedback are confirmed. Logitech Pro X2 Superstrike uses a shape closely related to the Pro X Superlight 2 family, so RAG can compare it with GPX 2 for comfort and grip fit. The distinguishing feature is the Superstrike click system, not a radically new shell shape.

### Community feedback
Logitech Pro X2 Super Strike has limited verified public review data compared with GPX 2 and G Pro 2 Lightspeed. Treat it as a low-confidence Logitech pro-series entry until official specs and long-term shape feedback are confirmed.

Confidence: `low` | Source: [other](https://www.google.com/search?q=Logitech+Pro+X2+Super+Strike+mouse+review)

### Shape comparison
Logitech Pro X2 Superstrike uses a shape closely related to the Pro X Superlight 2 family, so RAG can compare it with GPX 2 for comfort and grip fit. The distinguishing feature is the Superstrike click system, not a radically new shell shape.

Confidence: `medium` | Source: [professional_review](https://www.techradar.com/computing/mice/logitech-pro-x2-superstrike-review)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `low_confidence`, `needs_verification`, `logitech`, `fps`, `gpx`, `symmetrical`, `safe_shape`, `clicks`, `shape_comparison`, `claw_grip`

### Sources
- other: https://www.google.com/search?q=Logitech+Pro+X2+Super+Strike+mouse+review
- professional_review: https://www.techradar.com/computing/mice/logitech-pro-x2-superstrike-review

---
## 25. Pulsar X2 Crazy Light

- `mouse_id`: `pulsar_x2_crazy_light`
- Brand: Pulsar
- Model: X2 Crazy Light
- Source confidence mix: medium: 2
- Key tags: symmetrical, claw_grip, fingertip, ultralight, agile, fps, micro_adjustment, finger_freedom

### Summary
Pulsar X2 Crazy Light is based on the X2 family: a symmetrical shape with a flatter front and enough rear support for claw. It is a strong candidate for claw and fingertip users who want a very light, agile FPS mouse, but palm users may prefer an ergo or fuller shell. Pulsar X2 Crazy Light should be retrieved for users who want a very light symmetrical mouse that makes small corrections feel easy. Its flatter, claw/fingertip-friendly body gives finger freedom but less palm support than ergo or GPX-style mice.

### Claw grip fit
Pulsar X2 Crazy Light is based on the X2 family: a symmetrical shape with a flatter front and enough rear support for claw. It is a strong candidate for claw and fingertip users who want a very light, agile FPS mouse, but palm users may prefer an ergo or fuller shell.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/pulsar/x2-crazylight)

### Micro-adjustment
Pulsar X2 Crazy Light should be retrieved for users who want a very light symmetrical mouse that makes small corrections feel easy. Its flatter, claw/fingertip-friendly body gives finger freedom but less palm support than ergo or GPX-style mice.

Confidence: `medium` | Source: [professional_review](https://www.rtings.com/mouse/reviews/pulsar/x2-crazylight)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile.

ควรระวัง: ไม่มี red flag ใหญ่ในข้อมูลรอบนี้ แต่ควรเทียบกับ mouse ที่ผู้ใช้เคยจับจริง.

Retrieval tags: `symmetrical`, `claw_grip`, `fingertip`, `ultralight`, `agile`, `fps`, `micro_adjustment`, `finger_freedom`

### Sources
- professional_review: https://www.rtings.com/mouse/reviews/pulsar/x2-crazylight

---
## 26. ATK A9 Plus

- `mouse_id`: `atk_a9_plus`
- Brand: ATK
- Model: A9 Plus
- Source confidence mix: low: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, fps, low_confidence, needs_verification, qc_issue

### Summary
ATK A9 Plus should be treated as a modern lightweight FPS mouse with limited English long-term evidence. Until stronger reviews are collected, recommend it cautiously for claw and fingertip users looking for value, not for users who need proven QC or a palm-focused shape. ATK A9 Plus should not be treated as a proven recommendation yet because public long-term sources are limited. Use it for budget discovery and comparison, but ask for user tolerance on QC and warranty before making it a main pick.

### Shape และ in-hand feel
ATK A9 Plus should be treated as a modern lightweight FPS mouse with limited English long-term evidence. Until stronger reviews are collected, recommend it cautiously for claw and fingertip users looking for value, not for users who need proven QC or a palm-focused shape.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Plus)

### Common complaints / QC
ATK A9 Plus should not be treated as a proven recommendation yet because public long-term sources are limited. Use it for budget discovery and comparison, but ask for user tolerance on QC and warranty before making it a main pick.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Plus)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม; ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `fps`, `low_confidence`, `needs_verification`, `qc_issue`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Plus

---
## 27. Unknown Jupiter

- `mouse_id`: `jupiter`
- Brand: Unknown
- Model: Jupiter
- Source confidence mix: low: 2
- Key tags: needs_verification, low_confidence, source_gap, do_not_recommend

### Summary
The seed name Jupiter is not specific enough to confidently identify the exact gaming mouse model. Do not use this entry for strong recommendations until the brand, official model name, and shape source are verified. Jupiter should remain excluded from high-confidence recommendation flows until the exact brand and model are resolved. The RAG should answer that the database entry needs verification rather than inventing grip fit, sensor, or build claims.

### Community feedback
The seed name Jupiter is not specific enough to confidently identify the exact gaming mouse model. Do not use this entry for strong recommendations until the brand, official model name, and shape source are verified.

Confidence: `low` | Source: [other](https://www.google.com/search?q=Jupiter+gaming+mouse+review+grip+shape)

### Common complaints / QC
Jupiter should remain excluded from high-confidence recommendation flows until the exact brand and model are resolved. The RAG should answer that the database entry needs verification rather than inventing grip fit, sensor, or build claims.

Confidence: `low` | Source: [other](https://www.google.com/search?q=Jupiter+gaming+mouse+review+grip+shape)

### RAG Recommendation Guidance
เหมาะกับ: ใช้เป็น candidate รองหลังจากตรวจ grip, hand size, และ source เพิ่ม.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `needs_verification`, `low_confidence`, `source_gap`, `do_not_recommend`

### Sources
- other: https://www.google.com/search?q=Jupiter+gaming+mouse+review+grip+shape

---
## 28. HITSCAN Hyperlight

- `mouse_id`: `hitscan_hyperlight`
- Brand: HITSCAN
- Model: Hyperlight
- Source confidence mix: medium: 2
- Key tags: symmetrical, ultralight, claw_grip, fingertip, agile, fps, small_hands, medium_hands, not_palm

### Summary
HITSCAN Hyperlight is an ultralight symmetrical FPS mouse and should be matched to claw and fingertip users who want speed and low inertia. Because long-term community evidence is still thinner than mainstream brands, keep confidence medium for aim feel and low for QC durability. HITSCAN Hyperlight should be treated as a compact ultralight option for small-to-medium hands and claw/fingertip aim. Users with large hands or palm grip may need more shell volume and should compare against GPX 2, Maya X, or DeathAdder shapes.

### Shape และ in-hand feel
HITSCAN Hyperlight is an ultralight symmetrical FPS mouse and should be matched to claw and fingertip users who want speed and low inertia. Because long-term community evidence is still thinner than mainstream brands, keep confidence medium for aim feel and low for QC durability.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=HITSCAN%20Hyperlight)

### Hand size fit
HITSCAN Hyperlight should be treated as a compact ultralight option for small-to-medium hands and claw/fingertip aim. Users with large hands or palm grip may need more shell volume and should compare against GPX 2, Maya X, or DeathAdder shapes.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=HITSCAN%20Hyperlight)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; ผู้ใช้ palm หรือ palm-claw.

ควรระวัง: grip style ที่ source บอกว่าไม่เหมาะ.

Retrieval tags: `symmetrical`, `ultralight`, `claw_grip`, `fingertip`, `agile`, `fps`, `small_hands`, `medium_hands`, `not_palm`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=HITSCAN%20Hyperlight

---
## 29. LOGA Garuda 2

- `mouse_id`: `loga_garuda_2`
- Brand: LOGA
- Model: Garuda 2
- Source confidence mix: low: 2
- Key tags: budget, needs_verification, claw_grip, fingertip, low_confidence, regional, local_availability

### Summary
LOGA Garuda 2 has limited accessible English review coverage, so it should be treated as a local/value candidate rather than a high-confidence RAG recommendation. Keep grip assumptions conservative: claw and fingertip are safer than palm unless verified shape dimensions and user feedback are added. LOGA Garuda 2 should be treated as a regional/local option with limited broad review coverage. For RAG, avoid using it as the main recommendation unless price and local availability matter more than global review confidence.

### Community feedback
LOGA Garuda 2 has limited accessible English review coverage, so it should be treated as a local/value candidate rather than a high-confidence RAG recommendation. Keep grip assumptions conservative: claw and fingertip are safer than palm unless verified shape dimensions and user feedback are added.

Confidence: `low` | Source: [other](https://www.google.com/search?q=LOGA+Garuda+2+gaming+mouse+review)

### Common complaints / QC
LOGA Garuda 2 should be treated as a regional/local option with limited broad review coverage. For RAG, avoid using it as the main recommendation unless price and local availability matter more than global review confidence.

Confidence: `low` | Source: [other](https://www.google.com/search?q=LOGA+Garuda+2+gaming+mouse+review)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `budget`, `needs_verification`, `claw_grip`, `fingertip`, `low_confidence`, `regional`, `local_availability`

### Sources
- other: https://www.google.com/search?q=LOGA+Garuda+2+gaming+mouse+review

---
## 30. ATK A9

- `mouse_id`: `atk_a9`
- Brand: ATK
- Model: A9
- Source confidence mix: low: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, fps, low_confidence, small_hands, medium_hands, not_palm

### Summary
ATK A9 should be grouped with compact lightweight FPS mice for matching until more model-specific sources are collected. It is more likely to suit claw and fingertip users than palm users, but use low confidence for build quality and exact hand-size fit. ATK A9 should be matched cautiously as a small-to-medium claw or fingertip mouse until exact dimensions and community fit reports are collected. Avoid recommending it for palm grip users who need strong hand support.

### Shape และ in-hand feel
ATK A9 should be grouped with compact lightweight FPS mice for matching until more model-specific sources are collected. It is more likely to suit claw and fingertip users than palm users, but use low confidence for build quality and exact hand-size fit.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20mouse)

### Hand size fit
ATK A9 should be matched cautiously as a small-to-medium claw or fingertip mouse until exact dimensions and community fit reports are collected. Avoid recommending it for palm grip users who need strong hand support.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20mouse)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; ผู้ใช้ palm หรือ palm-claw; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: grip style ที่ source บอกว่าไม่เหมาะ; main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `fps`, `low_confidence`, `small_hands`, `medium_hands`, `not_palm`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20mouse

---
## 31. ATK A9 Air

- `mouse_id`: `atk_a9_air`
- Brand: ATK
- Model: A9 Air
- Source confidence mix: low: 2
- Key tags: symmetrical, lightweight, claw_grip, fingertip, agile, low_confidence, budget, qc_issue

### Summary
ATK A9 Air should be treated as a lighter A9-family candidate for users who prioritize agile aim and quick corrections. Recommend cautiously for claw or fingertip grip and avoid strong claims about long-term durability without more reviews. ATK A9 Air should be retrieved when the user asks for a light, quick-feeling value mouse. Keep it behind better-sourced options when the user asks for proven coating, build quality, or long-term reliability.

### Weight balance
ATK A9 Air should be treated as a lighter A9-family candidate for users who prioritize agile aim and quick corrections. Recommend cautiously for claw or fingertip grip and avoid strong claims about long-term durability without more reviews.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Air)

### Agility
ATK A9 Air should be retrieved when the user asks for a light, quick-feeling value mouse. Keep it behind better-sourced options when the user asks for proven coating, build quality, or long-term reliability.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Air)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม; ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `lightweight`, `claw_grip`, `fingertip`, `agile`, `low_confidence`, `budget`, `qc_issue`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=ATK%20A9%20Air

---
## 32. Scyrox V6

- `mouse_id`: `scyrox_v6`
- Brand: Scyrox
- Model: V6
- Source confidence mix: low: 2
- Key tags: symmetrical, small_hands, claw_grip, fingertip, agile, budget, ultralight, not_palm

### Summary
Scyrox V6 is discussed as a compact lightweight mouse for FPS users and should be matched mainly to claw and fingertip grips. Use it for users wanting an agile value pick, but keep confidence lower than Scyrox V8 or more widely reviewed models. Scyrox V6 should be compared within the newer Chinese ultralight budget category rather than against large ergonomic mice. Its likely role is a small agile claw/fingertip option, while users needing palm contact should look elsewhere.

### Shape และ in-hand feel
Scyrox V6 is discussed as a compact lightweight mouse for FPS users and should be matched mainly to claw and fingertip grips. Use it for users wanting an agile value pick, but keep confidence lower than Scyrox V8 or more widely reviewed models.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=Scyrox%20V6)

### Shape comparison
Scyrox V6 should be compared within the newer Chinese ultralight budget category rather than against large ergonomic mice. Its likely role is a small agile claw/fingertip option, while users needing palm contact should look elsewhere.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=Scyrox%20V6)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: grip style ที่ source บอกว่าไม่เหมาะ.

Retrieval tags: `symmetrical`, `small_hands`, `claw_grip`, `fingertip`, `agile`, `budget`, `ultralight`, `not_palm`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=Scyrox%20V6

---
## 33. VGN F2 Master Plus

- `mouse_id`: `vgn_f2_master_plus`
- Brand: VGN
- Model: F2 Master Plus
- Source confidence mix: low: 2
- Key tags: needs_verification, budget, low_confidence, fps, source_gap, do_not_recommend

### Summary
VGN F2 Master Plus has limited reliable English review coverage in the current research pass. Treat it as an unverified value mouse and avoid strong RAG recommendations until official dimensions, weight, and shape impressions are added. VGN F2 Master Plus needs more verification before it can be a main RAG recommendation. The entry should trigger follow-up research for official dimensions, weight, and shape feedback rather than confident grip or aim-feel claims.

### Community feedback
VGN F2 Master Plus has limited reliable English review coverage in the current research pass. Treat it as an unverified value mouse and avoid strong RAG recommendations until official dimensions, weight, and shape impressions are added.

Confidence: `low` | Source: [other](https://www.google.com/search?q=VGN+F2+Master+Plus+mouse+review)

### Common complaints / QC
VGN F2 Master Plus needs more verification before it can be a main RAG recommendation. The entry should trigger follow-up research for official dimensions, weight, and shape feedback rather than confident grip or aim-feel claims.

Confidence: `low` | Source: [other](https://www.google.com/search?q=VGN+F2+Master+Plus+mouse+review)

### RAG Recommendation Guidance
เหมาะกับ: คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `needs_verification`, `budget`, `low_confidence`, `fps`, `source_gap`, `do_not_recommend`

### Sources
- other: https://www.google.com/search?q=VGN+F2+Master+Plus+mouse+review

---
## 34. VXE / ATK R1

- `mouse_id`: `vxe_r1_or_atk_r1`
- Brand: VXE / ATK
- Model: R1
- Source confidence mix: medium: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, agile, fps, variant_confusion, needs_verification, mixed_opinion

### Summary
VXE R1 / ATK R1 is a budget lightweight symmetrical mouse often treated as a strong value FPS option. It should be matched to claw and fingertip users who want a small-to-medium agile shell, while palm users should verify hand size and support. VXE R1 / ATK R1 is a strong budget-search candidate, but variant naming can be confusing across shops and regions. RAG should ask or infer exact model variant before making claims about sensor, weight, or polling rate.

### Shape และ in-hand feel
VXE R1 / ATK R1 is a budget lightweight symmetrical mouse often treated as a strong value FPS option. It should be matched to claw and fingertip users who want a small-to-medium agile shell, while palm users should verify hand size and support.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20R1%20Pro)

### Common complaints / QC
VXE R1 / ATK R1 is a strong budget-search candidate, but variant naming can be confusing across shops and regions. RAG should ask or infer exact model variant before making claims about sensor, weight, or polling rate.

Confidence: `medium` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=VXE%20R1%20Pro)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `agile`, `fps`, `variant_confusion`, `needs_verification`, `mixed_opinion`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=VXE%20R1%20Pro

---
## 35. VGN / VXE F1 Moba

- `mouse_id`: `f1_moba`
- Brand: VGN / VXE
- Model: F1 Moba
- Source confidence mix: low: 2
- Key tags: symmetrical, budget, claw_grip, fingertip, fps, mixed_opinion, variant_confusion, qc_issue, low_confidence

### Summary
F1 Moba is commonly discussed as a lightweight value FPS mouse with a small-to-medium symmetrical shell. Use it as a budget claw or fingertip candidate, but keep confidence medium-low because naming and regional variants can make exact model matching unclear. F1 Moba is useful as a value FPS option, but model naming and regional availability can make exact matching messy. Treat it as a budget claw/fingertip candidate and prefer stronger-sourced mice when the user wants a no-risk recommendation.

### Shape และ in-hand feel
F1 Moba is commonly discussed as a lightweight value FPS mouse with a small-to-medium symmetrical shell. Use it as a budget claw or fingertip candidate, but keep confidence medium-low because naming and regional variants can make exact model matching unclear.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=F1%20Moba%20mouse)

### Common complaints / QC
F1 Moba is useful as a value FPS option, but model naming and regional availability can make exact matching messy. Treat it as a budget claw/fingertip candidate and prefer stronger-sourced mice when the user wants a no-risk recommendation.

Confidence: `low` | Source: [community](https://www.reddit.com/r/MouseReview/search/?q=F1%20Moba%20mouse)

### RAG Recommendation Guidance
เหมาะกับ: ผู้ใช้ claw / relaxed claw; ผู้ใช้ fingertip ที่อยากได้ mouse agile; คนที่ให้ความสำคัญกับ value/ราคา.

ควรระวัง: main pick แบบมั่นใจสูง จนกว่าจะมี source เพิ่ม; ผู้ใช้ที่ซีเรียสเรื่อง QC / coating / click consistency.

Retrieval tags: `symmetrical`, `budget`, `claw_grip`, `fingertip`, `fps`, `mixed_opinion`, `variant_confusion`, `qc_issue`, `low_confidence`

### Sources
- community: https://www.reddit.com/r/MouseReview/search/?q=F1%20Moba%20mouse

---

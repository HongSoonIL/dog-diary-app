/**
 * 강아지 그림일기 이미지 생성 프롬프트
 * 환경 데이터(온도, 습도, 미세먼지)에 따라 적절한 프롬프트를 선택합니다.
 */

// 🌟 기본 프롬프트 - 쾌적한 환경
export const DEFAULT_DOG_PROMPT = `
Create a flat digital illustration in a warm pastel color palette.

Main subject:
A golden retriever dog lying comfortably on a rectangular brown cushion.
The dog is positioned horizontally, facing slightly to the right.
Its front legs are stretched forward, hind legs tucked to the side.
The dog is smiling with its mouth open and tongue slightly out.
Facial expression is calm, friendly, and relaxed.

Style:
Clean flat illustration style.
Soft gradients, no texture, no brush strokes.
Rounded shapes, smooth edges.
Not realistic, not anime, not cartoon exaggeration.

Environment:
A cozy indoor living room.
Wooden floor with warm tones.
A large window on the left side letting in soft sunlight.
Several green indoor plants in simple pots near the window and behind the dog.
A sofa on the right side of the image.
Minimal framed wall art in the background.

Lighting and mood:
Soft natural daylight coming from the left.
Overall warm, cozy, and calm atmosphere.

Composition:
Eye-level view.
The dog is centered as the main focus.
Circular infographic-style elements partially visible around the dog,
with soft pastel background colors (light green, beige, light blue).
The circles overlap the background but do not cover the dog.

Constraints:
- Match proportions and layout as closely as possible
- Do not add new objects
- Do not change the pose or expression
- No text, no numbers, no icons
- No watermark, no logo
`;

// 😢 슬픈 강아지 - 건조하거나 너무 습한 환경
export const SAD_DOG_PROMPT = `
Create a flat digital illustration in a warm pastel color palette.

Main subject:
A golden retriever dog lying on a rectangular brown cushion.
The dog is positioned horizontally, facing slightly to the right.
Front legs stretched forward, hind legs tucked to the side.
The dog has a sad expression:
- mouth closed
- eyes slightly drooped and half-open
- eyebrows subtly angled upward toward the center
- ears relaxed and slightly lowered
No tongue visible.

Style:
Clean flat digital illustration.
Soft gradients, no texture, no brush strokes.
Rounded shapes, smooth edges.
Not realistic, not anime, not exaggerated cartoon style.

Environment:
A cozy indoor living room.
Warm wooden floor.
A large window on the left side with soft daylight.
Several green indoor plants in simple pots near the window and behind the dog.
A sofa on the right side.
Minimal framed wall art in the background.

Lighting and mood:
Soft natural daylight from the left.
Overall muted, calm, slightly melancholic atmosphere.
Colors are slightly less saturated than a happy version.

Composition:
Eye-level view.
The dog is centered as the main focus.
Rounded circular infographic-style background elements around the dog,
using soft pastel colors (light green, beige, light blue).
The circles do not overlap the dog's face.

Constraints:
- Keep the same pose, proportions, and layout as the original version
- Only change facial expression and mood
- No text, no numbers, no icons
- No watermark, no logo
`;

// 🌫️ 미세먼지 강아지 - 공기질이 나쁜 환경
export const DUST_DOG_PROMPT = `
Create a flat digital illustration in a warm pastel color palette.

Main subject:
A golden retriever dog lying on a rectangular brown cushion.
The dog is positioned horizontally, facing slightly to the right.
Front legs stretched forward, hind legs tucked to the side.
The dog has a sad and tired expression:
- mouth closed
- eyes slightly drooped and half-open
- eyebrows gently angled upward toward the center
- ears relaxed and lowered
No tongue visible.

Style:
Clean flat digital illustration.
Soft gradients, no texture, no brush strokes.
Rounded shapes, smooth edges.
Not realistic, not anime, not exaggerated cartoon style.

Environment:
A cozy indoor living room.
Warm wooden floor.
A large window on the left side.
Outside the window, the weather is hazy and overcast due to fine dust.
Indoor plants appear slightly dull and desaturated.
A sofa on the right side.
Minimal framed wall art in the background.

Lighting and atmosphere:
Soft daylight filtered through fine dust.
Overall atmosphere feels heavy and gloomy.
Slightly desaturated colors to convey poor air quality.

Composition:
Eye-level view.
The dog is centered as the main focus.
Rounded circular infographic-style background elements around the dog,
using muted pastel colors.
The circles do not overlap the dog's face or body.

Constraints:
- Keep the same pose, proportions, and layout as the original image
- Only change facial expression and environmental mood
- No text, no numbers, no icons
- No watermark, no logo
`;

// 🥵 더운 강아지 - 높은 온도 환경
export const HOT_DOG_PROMPT = `
Create a flat digital illustration in a warm pastel color palette.

Main subject:
A golden retriever dog lying on a rectangular brown cushion.
The dog is positioned horizontally, facing slightly to the right.
Front legs stretched forward, hind legs tucked to the side.
The dog looks overheated and tired:
- mouth wide open, panting heavily
- tongue hanging out
- small sweat droplets on the face
- eyes half-open and tired
- ears relaxed and lowered

Style:
Clean flat digital illustration.
Soft gradients, no texture, no brush strokes.
Rounded shapes, smooth edges.
Not realistic, not anime, not exaggerated cartoon style.

Environment:
A cozy indoor living room.
Warm wooden floor.
A large window on the left side.
Bright and hot weather outside with intense sunlight.
Indoor plants look slightly droopy and wilted.
A sofa on the right side.
Minimal framed wall art in the background.

Lighting and atmosphere:
Strong natural daylight creating a hot feeling.
Overall hot and stuffy atmosphere.
Warmer color tones to emphasize heat.

Composition:
Eye-level view.
The dog is centered as the main focus.
Rounded circular background elements in warm pastel tones (orange, yellow, light red).

Constraints:
- Keep the same pose, proportions, and layout
- Only change facial expression and environmental mood
- No text, no numbers, no icons
- No watermark, no logo
`;

/**
 * 환경 데이터에 따라 적절한 이미지 프롬프트 선택
 * @param {Object} params - 환경 데이터
 * @param {number} params.temperature - 온도 (°C)
 * @param {number} params.humidity - 습도 (%)
 * @param {number} params.dust - 미세먼지 (μg/m³)
 * @returns {string} 선택된 프롬프트
 */
export function selectImagePrompt({ temperature, humidity, dust }) {
    // 1️⃣ 더운 경우 (28도 이상)
    if (temperature >= 28) {
        return HOT_DOG_PROMPT;
    }

    // 2️⃣ 미세먼지 나쁨 (76 이상)
    if (dust >= 76) {
        return DUST_DOG_PROMPT;
    }

    // 3️⃣ 쾌적한 환경
    // 온도: 18-28도, 습도: 30-60%, 미세먼지: 16-75
    if (
        temperature >= 18 &&
        temperature < 28 &&
        humidity >= 30 &&
        humidity <= 60 &&
        dust >= 16 &&
        dust <= 75
    ) {
        return DEFAULT_DOG_PROMPT;
    }

    // 4️⃣ 나머지 (건조하거나 습한 환경)
    return SAD_DOG_PROMPT;
}

/**
 * 환경 데이터에 따른 강아지 상태 설명 생성
 * @param {Object} params - 환경 데이터
 * @param {number} params.temperature - 온도 (°C)
 * @param {number} params.humidity - 습도 (%)
 * @param {number} params.dust - 미세먼지 (μg/m³)
 * @returns {string} 강아지 상태 설명
 */
export function getDogMoodDescription({ temperature, humidity, dust }) {
    if (temperature >= 28) {
        return "너무 더워서 힘들어해요 🥵";
    }

    if (dust >= 76) {
        return "미세먼지 때문에 답답해해요 😷";
    }

    if (
        temperature >= 18 &&
        temperature < 28 &&
        humidity >= 30 &&
        humidity <= 60 &&
        dust >= 16 &&
        dust <= 75
    ) {
        return "기분 좋게 편안히 쉬고 있어요 😊";
    }

    return "조금 불편해 보여요 😔";
}

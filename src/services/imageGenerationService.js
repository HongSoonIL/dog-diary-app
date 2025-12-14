/**
 * Pollinations.ai를 사용한 무료 AI 이미지 생성 서비스
 * API 키 불필요, 완전 무료
 */

/**
 * AI 이미지 생성 (Pollinations.ai)
 * @param {string} prompt - 이미지 생성 프롬프트
 * @returns {string} 생성된 이미지 URL
 */
export async function generateDogImage(prompt) {
    try {
        // 프롬프트를 간단하게 최적화
        const optimizedPrompt = optimizePrompt(prompt);

        // Pollinations.ai URL 생성
        // 파라미터:
        // - width/height: 이미지 크기
        // - nologo: 워터마크 제거
        // - enhance: 품질 향상
        // - seed: 일관성을 위한 시드값 (선택사항)
        const encodedPrompt = encodeURIComponent(optimizedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&enhance=true`;

        console.log('🎨 AI 이미지 생성:', optimizedPrompt);

        return imageUrl;
    } catch (error) {
        console.error('이미지 생성 실패:', error);
        throw error;
    }
}

/**
 * 프롬프트 최적화
 * Pollinations는 간결하고 명확한 프롬프트를 선호합니다.
 * @param {string} rawPrompt - 원본 프롬프트
 * @returns {string} 최적화된 프롬프트
 */
function optimizePrompt(rawPrompt) {
    // 너무 긴 프롬프트는 핵심 키워드만 추출
    // Pollinations는 간단한 설명을 선호

    // 기본 구조는 유지하되, 불필요한 설명 제거
    let optimized = rawPrompt
        .replace(/\n\n/g, ' ') // 이중 줄바꿈 제거
        .replace(/\n/g, ' ')   // 줄바꿈을 공백으로
        .replace(/\s+/g, ' ')  // 다중 공백 제거
        .trim();

    // 너무 길면 앞부분만 사용 (Pollinations는 짧은 프롬프트 선호)
    if (optimized.length > 500) {
        optimized = optimized.substring(0, 500);
    }

    return optimized;
}

/**
 * 이미지 미리 로드 (선택사항)
 * Pollinations는 URL 접근 시 이미지를 생성하므로
 * 미리 로드하면 사용자 경험이 개선됩니다.
 * @param {string} imageUrl - 이미지 URL
 * @returns {Promise<void>}
 */
export async function preloadImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
    });
}

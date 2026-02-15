/**
 * Google Analytics 4 カスタムイベント
 * Phase 6.4.2で作成
 */

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config',
      eventName: string,
      params?: Record<string, string | number | boolean>
    ) => void;
  }
}

/**
 * カスタムイベントを送信
 */
function sendEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log('[Analytics]', eventName, params);
  }
}

/**
 * ジャンル選択イベント
 */
export function trackGenreSelect(genreId: string) {
  sendEvent('genre_select', {
    genre_id: genreId,
  });
}

/**
 * GPU検出成功イベント
 */
export function trackGpuDetected(
  gpuName: string,
  vendor: string,
  confidence: number,
  isLaptop: boolean
) {
  sendEvent('gpu_detected', {
    gpu_name: gpuName,
    vendor,
    confidence: Math.round(confidence * 100),
    is_laptop: isLaptop,
  });
}

/**
 * GPU検出失敗イベント
 */
export function trackGpuDetectionFailed(reason: string) {
  sendEvent('gpu_detection_failed', {
    reason,
  });
}

/**
 * 速度測定開始イベント
 */
export function trackSpeedTestStart() {
  sendEvent('speed_test_start');
}

/**
 * 速度測定完了イベント
 */
export function trackSpeedTestComplete(
  uploadMbps: number,
  tier: string,
  duration: number
) {
  sendEvent('speed_test_complete', {
    upload_mbps: Math.round(uploadMbps * 10) / 10,
    tier,
    duration_seconds: Math.round(duration),
  });
}

/**
 * 速度測定失敗イベント
 */
export function trackSpeedTestFailed(reason: string) {
  sendEvent('speed_test_failed', {
    reason,
  });
}

/**
 * 設定確認画面到達イベント
 */
export function trackConfigConfirmReached(
  genre: string,
  encoder: string,
  bitrate: number,
  resolution: string,
  fps: number
) {
  sendEvent('config_confirm_reached', {
    genre,
    encoder,
    bitrate,
    resolution,
    fps,
  });
}

/**
 * 詳細設定開始イベント
 */
export function trackAdvancedSettingsStart() {
  sendEvent('advanced_settings_start');
}

/**
 * 詳細設定完了イベント
 */
export function trackAdvancedSettingsComplete(answers: {
  viewerDevice: string;
  streamDuration: string;
  connectionType: string;
  recordingPreference: string;
}) {
  sendEvent('advanced_settings_complete', {
    viewer_device: answers.viewerDevice,
    stream_duration: answers.streamDuration,
    connection_type: answers.connectionType,
    recording_preference: answers.recordingPreference,
  });
}

/**
 * 設定ファイル生成開始イベント
 */
export function trackConfigGenerationStart() {
  sendEvent('config_generation_start');
}

/**
 * 設定ファイルダウンロードイベント
 */
export function trackConfigDownload(
  genre: string,
  encoder: string,
  bitrate: number,
  useAdvancedSettings: boolean
) {
  sendEvent('config_download', {
    genre,
    encoder,
    bitrate,
    use_advanced_settings: useAdvancedSettings,
  });
}

/**
 * ガイド閲覧イベント
 */
export function trackGuideViewed(category: 'required' | 'performance' | 'optional') {
  sendEvent('guide_viewed', {
    category,
  });
}

/**
 * ガイド項目完了イベント
 */
export function trackGuideItemComplete(itemId: string, category: string) {
  sendEvent('guide_item_complete', {
    item_id: itemId,
    category,
  });
}

/**
 * ガイド完了イベント
 */
export function trackGuideComplete(
  requiredCount: number,
  performanceCount: number,
  optionalCount: number
) {
  sendEvent('guide_complete', {
    required_count: requiredCount,
    performance_count: performanceCount,
    optional_count: optionalCount,
  });
}

/**
 * FAQページ閲覧イベント
 */
export function trackFaqViewed() {
  sendEvent('faq_viewed');
}

/**
 * FAQ検索イベント
 */
export function trackFaqSearch(query: string, resultsCount: number) {
  sendEvent('faq_search', {
    query,
    results_count: resultsCount,
  });
}

/**
 * FAQカテゴリーフィルターイベント
 */
export function trackFaqCategoryFilter(category: string) {
  sendEvent('faq_category_filter', {
    category,
  });
}

/**
 * FAQ項目展開イベント
 */
export function trackFaqItemExpanded(itemId: string, question: string) {
  sendEvent('faq_item_expanded', {
    item_id: itemId,
    question,
  });
}

/**
 * エラーイベント
 */
export function trackError(
  errorType: string,
  errorMessage: string,
  step: string
) {
  sendEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage.substring(0, 100), // 最大100文字
    step,
  });
}

/**
 * ページ離脱イベント
 */
export function trackAbandon(step: string, timeSpent: number) {
  sendEvent('user_abandon', {
    step,
    time_spent_seconds: Math.round(timeSpent),
  });
}

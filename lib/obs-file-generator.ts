/**
 * OBSファイル生成機能
 * basic.ini/service.json生成、ZIP圧縮
 */

import JSZip from 'jszip';
import type { ObsConfig, ServiceConfig } from './types';

/**
 * basic.iniファイル生成
 */
export function generateBasicIni(config: ObsConfig): string {
  const {
    encoder,
    preset,
    bitrate,
    fps,
    outputResolution,
    keyframeInterval,
  } = config;

  const [outputCX, outputCY] =
    outputResolution === '1920x1080'
      ? ['1920', '1080']
      : ['1280', '720'];

  return `[General]
Name=オートOBS設定

[Video]
BaseCX=1920
BaseCY=1080
OutputCX=${outputCX}
OutputCY=${outputCY}
FPSType=0
FPSCommon=${fps}
ScaleType=bicubic

[Output]
Mode=Simple

[SimpleOutput]
StreamEncoder=${encoder}
StreamEncoderPreset=${preset}
VBitrate=${bitrate}
KeyframeInterval=${keyframeInterval}
${generateEncoderSpecificSettings(config)}

[Audio]
SampleRate=48000
ChannelSetup=stereo

[AdvOut]
RecEncoder=${encoder}
RecRB=false
RecRBTime=20
RecRBSize=512
`;
}

/**
 * エンコーダ固有設定
 */
function generateEncoderSpecificSettings(config: ObsConfig): string {
  const {
    encoder,
    bFrames,
    lookahead,
    psychoVisualTuning,
    gpuScheduling,
  } = config;

  if (encoder === 'ffmpeg_nvenc') {
    return `# NVIDIA NVENC設定
bf=${bFrames}
lookahead=${lookahead ? '1' : '0'}
psycho_aq=${psychoVisualTuning ? '1' : '0'}
gpu=${gpuScheduling ? '0' : '-1'}`;
  }

  if (encoder === 'ffmpeg_amf') {
    return `# AMD AMF設定
bf=${bFrames}`;
  }

  if (encoder === 'ffmpeg_qsv') {
    return `# Intel QSV設定
bf=${bFrames}
look_ahead=${lookahead ? '1' : '0'}`;
  }

  if (encoder === 'obs_x264') {
    return `# x264設定
x264opts=bframes=${bFrames}`;
  }

  return '';
}

/**
 * service.jsonファイル生成（YouTube設定）
 */
export function generateServiceJson(): string {
  const serviceConfig: ServiceConfig = {
    type: 'rtmp_custom',
    settings: {
      server: 'rtmp://a.rtmp.youtube.com/live2',
      key: 'YOUR_STREAM_KEY_HERE', // プレースホルダー
      use_auth: false,
    },
  };

  return JSON.stringify(serviceConfig, null, 2);
}

/**
 * README.txtファイル生成
 */
export function generateReadme(config: ObsConfig): string {
  return `オートOBS設定ファイル
生成日時: ${new Date().toLocaleString('ja-JP')}

【設定内容】
- エンコーダ: ${config.encoder}
- 解像度: ${config.outputResolution}
- フレームレート: ${config.fps} FPS
- ビットレート: ${config.bitrate} kbps

【インポート手順】
1. OBSを起動
2. メニュー > プロファイル > インポート
3. このフォルダを選択

【必ず手動で設定してください】
□ マイクデバイスの選択（設定 > 音声）
□ YouTube配信キーの入力（設定 > 配信）

詳しくは https://obs.auto/guide を参照してください。
`;
}

/**
 * 設定ファイルをZIP化
 */
export async function generateConfigZip(
  config: ObsConfig
): Promise<Blob> {
  const zip = new JSZip();

  // basic.ini
  const basicIni = generateBasicIni(config);
  zip.file('obs-config/basic.ini', basicIni);

  // service.json
  const serviceJson = generateServiceJson();
  zip.file('obs-config/service.json', serviceJson);

  // README.txt（使い方説明）
  const readme = generateReadme(config);
  zip.file('obs-config/README.txt', readme);

  return await zip.generateAsync({ type: 'blob' });
}

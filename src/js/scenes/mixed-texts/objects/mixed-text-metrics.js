import { TextMetrics } from 'pixi.js';

export default class MixedTextMetrics {
  static measureText(mixedText) {
    let { text, style, style: { wordWrap }, canvas } = mixedText;
    canvas = canvas || TextMetrics._canvas;

    wordWrap = wordWrap === undefined || wordWrap === null ? style.wordWrap : wordWrap;
    const font = style.toFontString();
    const fontProperties = TextMetrics.measureFont(font);
    const context = canvas.getContext('2d');

    context.font = font;

    const outputText = wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text;
    const lines = outputText.split(/(?:\r\n|\r|\n)/);
    const lineWidths = new Array(lines.length);
    let maxLineWidth = 0;

    for (let i = 0; i < lines.length; i++) {
      const imagesSize = { width: 0 };
      const line = lines[i].replace(mixedText.imageRegex, MixedTextMetrics.measureMatch.bind(null, mixedText, imagesSize));

      const lineWidth = context.measureText(line).width + (line.length - 1) * style.letterSpacing + imagesSize.width;

      lineWidths[i] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    let width = maxLineWidth + style.strokeThickness;

    if (style.dropShadow) {
      width += style.dropShadowDistance;
    }

    const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
    let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * (lineHeight + style.leading);

    if (style.dropShadow) {
      height += style.dropShadowDistance;
    }

    return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
  }

  static measureMatch(mixedText, imagesSize, match) {
    const { texturesCache, getImageFrame, style: { fontSize } } = mixedText;
    const frame = getImageFrame.call(mixedText, match);
    const image = texturesCache[frame] || MixedTextMetrics.createImage(frame, texturesCache);

    imagesSize.width += image.width * fontSize / image.height;

    return '';
  }

  static createImage(frame, cache) {
    const texture = PIXI.Texture.fromFrame(frame);
    cache[frame] = cache[frame] || [];
    cache[frame] = texture;

    return texture;
  }
}

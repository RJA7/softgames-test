import MixedTextMetrics from './mixed-text-metrics';

export default class MixedText extends PIXI.Text {
  constructor(text, style, canvas) {
    super(text, style, canvas);

    this.imageRegex = /\$IMAGE\(.+?\)END\$/g;
    this.texturesCache = {};
    this.imageOffset = new PIXI.Point(0, 0);
  }

  getImageFrame(match) {
    return match.slice(7, -5);
  }

  updateText(respectDirty) {
    const style = this._style;

    // check if style has changed..
    if (this.localStyleID !== style.styleID) {
      this.dirty = true;
      this.localStyleID = style.styleID;
    }

    if (!this.dirty && respectDirty) {
      return;
    }

    this._font = this._style.toFontString();

    const context = this.context;
    const measured = MixedTextMetrics.measureText(this);
    const width = measured.width;
    const height = measured.height;
    const lines = measured.lines;
    const lineHeight = measured.lineHeight;
    const lineWidths = measured.lineWidths;
    const maxLineWidth = measured.maxLineWidth;
    const fontProperties = measured.fontProperties;

    const linesParts = [];
    const linesMatches = [];

    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i];
      linesParts.push(line.split(this.imageRegex));
      linesMatches.push(line.match(this.imageRegex));
    }

    this.canvas.width = Math.ceil((Math.max(1, width) + style.padding * 2) * this.resolution);
    this.canvas.height = Math.ceil((Math.max(1, height) + style.padding * 2) * this.resolution);

    context.scale(this.resolution, this.resolution);

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    context.font = this._font;
    context.strokeStyle = style.stroke;
    context.lineWidth = style.strokeThickness;
    context.textBaseline = style.textBaseline;
    context.lineJoin = style.lineJoin;
    context.miterLimit = style.miterLimit;

    let linePositionX = void 0;
    let linePositionY = void 0;

    if (style.dropShadow) {
      context.fillStyle = style.dropShadowColor;
      context.globalAlpha = style.dropShadowAlpha;
      context.shadowBlur = style.dropShadowBlur;

      if (style.dropShadowBlur > 0) {
        context.shadowColor = style.dropShadowColor;
      }

      const xShadowOffset = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
      const yShadowOffset = Math.sin(style.dropShadowAngle) * style.dropShadowDistance;

      for (let i = 0; i < lines.length; i++) {
        linePositionX = style.strokeThickness / 2;
        linePositionY = style.strokeThickness / 2 + i * lineHeight + fontProperties.ascent;

        if (style.align === 'right') {
          linePositionX += maxLineWidth - lineWidths[i];
        } else if (style.align === 'center') {
          linePositionX += (maxLineWidth - lineWidths[i]) / 2;
        }

        const parts = linesParts[i];
        const matches = linesMatches[i];

        if (style.fill) {
          for (let j = 0, partX = 0; j < parts.length; j++) {
            const part = parts[j];
            const match = matches && matches[j];
            const texture = match && this.texturesCache[this.getImageFrame(match)];

            this.drawLetterSpacing(part, linePositionX + xShadowOffset + style.padding + partX, linePositionY + yShadowOffset + style.padding);

            if (style.stroke && style.strokeThickness) {
              context.strokeStyle = style.dropShadowColor;
              this.drawLetterSpacing(part, linePositionX + xShadowOffset + style.padding + partX, linePositionY + yShadowOffset + style.padding, true);
              context.strokeStyle = style.stroke;
            }

            partX += context.measureText(part).width + (part.length - 1) * style.letterSpacing;

            if (texture) {
              const matchHeight = style.fontSize;
              const matchWidth = texture.width * matchHeight / texture.height;
              partX += matchWidth;
            }
          }
        }
      }
    }

    // reset the shadow blur and alpha that was set by the drop shadow, for the regular text
    context.shadowBlur = 0;
    context.globalAlpha = 1;

    // set canvas text styles
    context.fillStyle = this._generateFillStyle(style, lines);

    // draw lines line by line
    for (let _i = 0; _i < lines.length; _i++) {
      linePositionX = style.strokeThickness / 2;
      linePositionY = style.strokeThickness / 2 + _i * lineHeight + fontProperties.ascent;

      if (style.align === 'right') {
        linePositionX += maxLineWidth - lineWidths[_i];
      } else if (style.align === 'center') {
        linePositionX += (maxLineWidth - lineWidths[_i]) / 2;
      }

      const parts = linesParts[_i];
      const matches = linesMatches[_i];

      for (let j = 0, partX = 0; j < parts.length; j++) {
        const part = parts[j];
        const match = matches && matches[j];
        const texture = match && this.texturesCache[this.getImageFrame(match)];

        if (style.stroke && style.strokeThickness) {
          this.drawLetterSpacing(part, linePositionX + style.padding + partX, linePositionY + style.padding, true);
        }

        if (style.fill) {
          this.drawLetterSpacing(part, linePositionX + style.padding + partX, linePositionY + style.padding);
        }

        partX += context.measureText(part).width + (part.length - 1) * style.letterSpacing;

        if (texture) {
          const matchHeight = style.fontSize;
          const matchWidth = texture.width * matchHeight / texture.height;

          const { frame, trim } = texture;
          const cx = frame.x;
          const cy = frame.y;
          const cw = frame.width;
          const ch = frame.height;
          const trimX = trim ? trim.x : 0;
          const trimY = trim ? trim.y : 0;
          const x = linePositionX + style.padding + partX + trimX + this.imageOffset.x;
          const y = linePositionY + style.padding + trimY - fontProperties.ascent + this.imageOffset.y;

          context.drawImage(texture.baseTexture.source, cx, cy, cw, ch, x, y, matchWidth, matchHeight);

          partX += matchWidth;
        }
      }
    }

    this.updateTexture();
  }
}

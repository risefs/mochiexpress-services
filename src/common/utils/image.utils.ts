export class ImageUtils {
  private static readonly MAX_SIZE_MB = 5;
  private static readonly MAX_SIZE_BYTES = ImageUtils.MAX_SIZE_MB * 1024 * 1024;
  private static readonly ALLOWED_TYPES = ['jpeg', 'jpg', 'png', 'webp'];

  static isValidBase64Image(base64String: string): boolean {
    try {
      const matches = base64String.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return false;
      }

      const fileExtension = matches[1].toLowerCase();
      const base64Data = matches[2];

      // Check if file type is allowed
      if (!this.ALLOWED_TYPES.includes(fileExtension)) {
        return false;
      }

      // Check base64 validity
      if (!this.isValidBase64(base64Data)) {
        return false;
      }

      // Check file size
      const sizeInBytes = this.getBase64SizeInBytes(base64Data);
      if (sizeInBytes > this.MAX_SIZE_BYTES) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  static isValidBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }

  static getBase64SizeInBytes(base64String: string): number {
    const padding = (base64String.match(/=/g) || []).length;
    return (base64String.length * 3) / 4 - padding;
  }

  static getImageMimeType(base64String: string): string | null {
    const matches = base64String.match(/^data:image\/([a-zA-Z+]+);base64,/);
    return matches ? `image/${matches[1]}` : null;
  }

  static validateImageConstraints(base64Image: string): { isValid: boolean; error?: string } {
    if (!base64Image) {
      return { isValid: false, error: 'Image is required' };
    }

    if (!this.isValidBase64Image(base64Image)) {
      return { isValid: false, error: 'Invalid image format or unsupported file type' };
    }

    const matches = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    const base64Data = matches![2];
    const sizeInBytes = this.getBase64SizeInBytes(base64Data);

    if (sizeInBytes > this.MAX_SIZE_BYTES) {
      return { 
        isValid: false, 
        error: `Image size exceeds maximum allowed size of ${this.MAX_SIZE_MB}MB` 
      };
    }

    return { isValid: true };
  }
}

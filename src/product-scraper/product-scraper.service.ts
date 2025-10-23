import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ProductScraperService {
  private readonly logger = new Logger(ProductScraperService.name);

  async extractProductInfo(url: string) {
    try {
      this.logger.debug(`Scraping product from: ${url}`);

      const { data } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 15000,
        maxRedirects: 5,
      });

      const $ = cheerio.load(data);

      const name = this.extractNameMultiStrategy($);
      const price = this.extractPriceMultiStrategy($);
      const description = this.extractDescriptionMultiStrategy($);

      const success = !!(name || price || description);

      this.logger.debug(
        `Scraping result - Name: ${!!name}, Price: ${!!price}, Description: ${!!description}`,
      );

      return {
        name,
        price,
        description,
        url,
        success,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(`Error scraping ${url}: ${err.message}`);
      return {
        name: '',
        price: '',
        description: '',
        url,
        success: false,
      };
    }
  }

  private extractNameMultiStrategy($: cheerio.CheerioAPI): string {
    const strategies = [
      () => $('meta[property="og:title"]').attr('content'),
      () => $('meta[name="twitter:title"]').attr('content'),
      () => $('[itemprop="name"]').first().text(),
      () => $('[itemprop="name"]').first().attr('content'),
      () => $('h1.product-title').first().text(),
      () => $('h1[class*="product"]').first().text(),
      () => $('h1[class*="Product"]').first().text(),
      () => $('.product-name').first().text(),
      () => $('.productName').first().text(),
      () => $('#productTitle').first().text(),
      () => $('h1').first().text(),
      () => $('title').text().split('|')[0].split('-')[0],
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy()?.trim();
        if (result && result.length > 0 && result.length < 500) {
          this.logger.debug(`Name found using strategy`);
          return result;
        }
      } catch (e) {
        continue;
      }
    }

    return '';
  }

  private extractPriceMultiStrategy($: cheerio.CheerioAPI): string {
    const strategies = [
      () => $('meta[property="product:price:amount"]').attr('content'),
      () => $('meta[property="og:price:amount"]').attr('content'),
      () => $('[itemprop="price"]').first().attr('content'),
      () => $('[itemprop="price"]').first().text(),
      () => $('.price').first().text(),
      () => $('[class*="price"]').first().text(),
      () => $('[class*="Price"]').first().text(),
      () => $('#priceblock_ourprice').first().text(),
      () => $('#priceblock_dealprice').first().text(),
      () => $('.a-price .a-offscreen').first().text(),
      () => this.extractJsonLdPrice($),
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy()?.trim();
        if (result) {
          const cleanPrice = this.cleanPrice(result);
          if (cleanPrice) {
            this.logger.debug(`Price found: ${cleanPrice}`);
            return cleanPrice;
          }
        }
      } catch (e) {
        continue;
      }
    }

    return '';
  }

  private extractDescriptionMultiStrategy($: cheerio.CheerioAPI): string {
    const strategies = [
      () => $('meta[property="og:description"]').attr('content'),
      () => $('meta[name="twitter:description"]').attr('content'),
      () => $('meta[name="description"]').attr('content'),
      () => $('[itemprop="description"]').first().text(),
      () => $('.product-description').first().text(),
      () => $('.productDescription').first().text(),
      () => $('[class*="description"]').first().text(),
      () => $('[class*="Description"]').first().text(),
      () => $('#productDescription').first().text(),
      () => this.extractJsonLdDescription($),
    ];

    for (const strategy of strategies) {
      try {
        const result = strategy()?.trim();
        if (result && result.length > 20 && result.length < 5000) {
          this.logger.debug(
            `Description found, length: ${result.length} chars`,
          );
          return result.substring(0, 1000);
        }
      } catch (e) {
        continue;
      }
    }

    return '';
  }

  private extractJsonLdPrice($: cheerio.CheerioAPI): string {
    try {
      const scripts = $('script[type="application/ld+json"]');
      for (let i = 0; i < scripts.length; i++) {
        try {
          const jsonLd = $(scripts[i]).html();
          if (jsonLd) {
            const data = JSON.parse(jsonLd);

            if (data['@type'] === 'Product' || data.offers) {
              const price =
                data.offers?.price ||
                data.offers?.[0]?.price ||
                data.offers?.lowPrice;
              if (price) return String(price);
            }
          }
        } catch (e) {
          return '';
        }
      }
    } catch (e) {
      return '';
    }
    return '';
  }

  private extractJsonLdDescription($: cheerio.CheerioAPI): string {
    try {
      const scripts = $('script[type="application/ld+json"]');
      scripts.each((_, element) => {
        try {
          const jsonLd = $(element).html();
          if (jsonLd) {
            const data = JSON.parse(jsonLd);
            if (data['@type'] === 'Product' && data.description) {
              return data.description;
            }
          }
        } catch (e) {
          return '';
        }
      });
    } catch (e) {
      return '';
    }
    return '';
  }

  private cleanPrice(priceStr: string): string {
    const cleaned = priceStr
      .replace(/[^\d.,]/g, '')
      .replace(/,(\d{3})/g, '$1')
      .trim();

    if (cleaned && /^\d+\.?\d*$/.test(cleaned)) {
      return cleaned;
    }

    return '';
  }
}

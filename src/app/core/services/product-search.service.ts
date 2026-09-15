import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { categories } from '../data/mock-data';

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const NON_SEARCH_CHARACTERS = /[^\p{L}\p{N}\s]/gu;

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase('ar')
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ـ/g, '')
    .replace(NON_SEARCH_CHARACTERS, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function productSearchDocument(product: Product): string {
  const category = categories.find((item) => item.slug === product.category);

  return normalizeSearchText(
    [
      product.nameAr,
      product.nameEn,
      product.descAr,
      product.descEn,
      product.category,
      category?.nameAr,
      category?.nameEn,
      product.sizes?.join(' '),
    ]
      .filter(Boolean)
      .join(' ')
  );
}

function productNameDocument(product: Product): string {
  return normalizeSearchText(`${product.nameAr} ${product.nameEn}`);
}

function levenshteinDistance(source: string, target: string): number {
  if (source === target) return 0;
  if (!source.length) return target.length;
  if (!target.length) return source.length;

  const previousRow = Array.from({ length: target.length + 1 }, (_, index) => index);

  for (let sourceIndex = 1; sourceIndex <= source.length; sourceIndex += 1) {
    const currentRow = [sourceIndex];

    for (let targetIndex = 1; targetIndex <= target.length; targetIndex += 1) {
      const insertion = currentRow[targetIndex - 1] + 1;
      const deletion = previousRow[targetIndex] + 1;
      const substitution =
        previousRow[targetIndex - 1] +
        (source[sourceIndex - 1] === target[targetIndex - 1] ? 0 : 1);

      currentRow[targetIndex] = Math.min(insertion, deletion, substitution);
    }

    previousRow.splice(0, previousRow.length, ...currentRow);
  }

  return previousRow[target.length];
}

function calculateSimilarityScore(product: Product, normalizedQuery: string): number {
  const tokens = normalizedQuery.split(' ').filter(Boolean);
  const document = productSearchDocument(product);
  const nameDocument = productNameDocument(product);
  const nameWords = nameDocument.split(' ').filter(Boolean);

  let score = 0;

  for (const token of tokens) {
    if (nameDocument.includes(token)) score += 9;
    else if (document.includes(token)) score += 4;

    if (nameWords.some((word) => word.startsWith(token) || token.startsWith(word)))
      score += 5;

    const closestDistance = nameWords.reduce(
      (bestDistance, word) => Math.min(bestDistance, levenshteinDistance(token, word)),
      Number.POSITIVE_INFINITY
    );

    if (closestDistance <= 1) score += 4;
    else if (closestDistance === 2 && token.length >= 4) score += 2;
  }

  if (product.isBestSeller) score += 1.5;
  score += product.rating / 20;

  return score;
}

@Injectable({
  providedIn: 'root',
})
export class ProductSearchService {
  normalizeText(value: string): string {
    return normalizeSearchText(value);
  }

  findExactProductMatches(productsList: Product[], rawQuery: string): Product[] {
    const query = normalizeSearchText(rawQuery);
    if (!query) return [];

    const tokens = query.split(' ').filter(Boolean);

    return productsList.filter((product) => {
      const document = productSearchDocument(product);
      const nameDocument = productNameDocument(product);

      return (
        nameDocument.includes(query) ||
        document.includes(query) ||
        tokens.every((token) => document.includes(token))
      );
    });
  }

  findSimilarProductSuggestions(
    productsList: Product[],
    rawQuery: string,
    limit = 4
  ): Product[] {
    const normalizedQuery = normalizeSearchText(rawQuery);

    if (!normalizedQuery) {
      return [...productsList]
        .sort((first, second) => {
          const firstScore =
            (first.isBestSeller ? 10 : 0) + first.rating + first.reviewCount / 1000;
          const secondScore =
            (second.isBestSeller ? 10 : 0) + second.rating + second.reviewCount / 1000;
          return secondScore - firstScore;
        })
        .slice(0, limit);
    }

    const scoredProducts = productsList
      .map((product) => ({ product, score: calculateSimilarityScore(product, normalizedQuery) }))
      .sort((first, second) => second.score - first.score);

    const meaningfulSuggestions = scoredProducts.filter((item) => item.score >= 3);
    const source = meaningfulSuggestions.length > 0 ? meaningfulSuggestions : scoredProducts;

    return source.slice(0, limit).map((item) => item.product);
  }

  getProductDiscount(product: Product): number {
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }
}

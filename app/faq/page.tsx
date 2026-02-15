/**
 * FAQ・ヘルプページ
 * Phase 6.3.2で作成
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  faqItems,
  faqCategories,
  searchFaq,
  type FaqCategory,
} from '@/lib/faq-data';
import {
  trackFaqViewed,
  trackFaqSearch,
  trackFaqCategoryFilter,
  trackFaqItemExpanded,
} from '@/lib/analytics';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'all'>('all');

  // ページ閲覧イベント
  useEffect(() => {
    trackFaqViewed();
  }, []);

  // 検索とフィルタリング
  const filteredFaqs = searchQuery
    ? searchFaq(searchQuery)
    : selectedCategory === 'all'
    ? faqItems
    : faqItems.filter((item) => item.category === selectedCategory);

  // 検索イベント
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const results = searchFaq(query);
      trackFaqSearch(query, results.length);
    }
  };

  // カテゴリーフィルターイベント
  const handleCategoryFilter = (category: FaqCategory | 'all') => {
    setSelectedCategory(category);
    trackFaqCategoryFilter(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <Home className="w-4 h-4" />
            トップページに戻る
          </Link>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            FAQ・ヘルプ
          </h1>
          <p className="text-lg text-muted-foreground">
            よくある質問と回答をまとめました
          </p>
        </div>

        {/* 検索バー */}
        <Card className="mb-8 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="質問を検索... (例: GPUが検出されない)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
        </Card>

        {/* カテゴリーフィルター */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryFilter('all')}
            className="text-base"
          >
            すべて
          </Button>
          {Object.entries(faqCategories).map(([key, { label, emoji }]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryFilter(key as FaqCategory)}
              className="text-base"
            >
              <span className="mr-1">{emoji}</span>
              {label}
            </Button>
          ))}
        </div>

        {/* 検索結果 */}
        {filteredFaqs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              該当する質問が見つかりませんでした
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              検索キーワードを変更するか、カテゴリーを選択してください
            </p>
          </Card>
        ) : (
          <>
            {/* 件数表示 */}
            <div className="text-sm text-muted-foreground mb-4">
              {filteredFaqs.length}件の質問が見つかりました
            </div>

            {/* FAQ Accordion */}
            <Accordion
              type="single"
              collapsible
              className="space-y-4"
              onValueChange={(value) => {
                if (value) {
                  const faq = filteredFaqs.find((f) => f.id === value);
                  if (faq) {
                    trackFaqItemExpanded(faq.id, faq.question);
                  }
                }
              }}
            >
              {filteredFaqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border rounded-lg px-6 data-[state=open]:bg-muted/30 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1" aria-hidden="true">
                        {faqCategories[faq.category].emoji}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {faq.question}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {faqCategories[faq.category].label}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <div className="ml-11 space-y-4">
                      {/* 回答 */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-base leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>

                      {/* 関連リンク */}
                      {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold mb-2 text-foreground">
                            関連リンク:
                          </h4>
                          <ul className="space-y-2">
                            {faq.relatedLinks.map((link, idx) => (
                              <li key={idx}>
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  {link.label}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}

        {/* フッター */}
        <Card className="mt-12 p-6 text-center bg-muted/30">
          <p className="text-base text-foreground mb-4">
            解決しない場合は、GitHub Issuesでご報告ください
          </p>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://github.com/rohto4/stream-auto-setting/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              GitHub Issues
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </Card>
      </div>
    </div>
  );
}

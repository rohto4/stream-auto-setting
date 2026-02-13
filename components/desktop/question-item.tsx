/**
 * 詳細設定フェーズ - 質問項目コンポーネント
 * 単一選択（ラジオボタン）と複数選択（チェックボックス）の両方に対応
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface QuestionItemProps {
  question: string;
  options: Option[];
  type: 'single' | 'multiple';
  selectedId: string | string[];
  onChange: (id: string | string[]) => void;
}

export function QuestionItem({
  question,
  options,
  type,
  selectedId,
  onChange,
}: QuestionItemProps) {
  const handleSingleChange = (id: string) => {
    onChange(id);
  };

  const handleMultipleChange = (id: string) => {
    const currentSelected = (selectedId as string[]) || [];
    const newSelected = currentSelected.includes(id)
      ? currentSelected.filter((item) => item !== id)
      : [...currentSelected, id];
    onChange(newSelected);
  };

  const isChecked = (id: string): boolean => {
    if (type === 'single') {
      return selectedId === id;
    }
    return (selectedId as string[]).includes(id);
  };

  const inputType = type === 'single' ? 'radio' : 'checkbox';

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-foreground">
        {question}
      </h3>
      <div className="space-y-3">
        {options.map((option, index) => (
          <motion.label
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              isChecked(option.id)
                ? 'border-primary bg-primary/10 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
          >
            <input
              type={inputType}
              name={question}
              id={`${question}-${option.id}`}
              value={option.id}
              checked={isChecked(option.id)}
              onChange={() =>
                type === 'single'
                  ? handleSingleChange(option.id)
                  : handleMultipleChange(option.id)
              }
              className="sr-only"
              aria-label={option.label}
            />
            {/* カスタムラジオボタン/チェックボックス */}
            <div className="flex-shrink-0 mt-0.5 mr-3">
              {type === 'single' ? (
                // ラジオボタン
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isChecked(option.id)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/50'
                  }`}
                >
                  {isChecked(option.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="w-2.5 h-2.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </div>
              ) : (
                // チェックボックス
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isChecked(option.id)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/50'
                  }`}
                >
                  {isChecked(option.id) && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check size={14} className="text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-base font-medium">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </motion.label>
        ))}
      </div>
    </div>
  );
}

/**
 * 詳細設定フェーズ - 質問項目コンポーネント
 * 単一選択（ラジオボタン）と複数選択（チェックボックス）の両方に対応
 */

import React from 'react';

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
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              isChecked(option.id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
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
              className="mt-1 mr-3 h-4 w-4"
              aria-label={option.label}
            />
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
          </label>
        ))}
      </div>
    </div>
  );
}

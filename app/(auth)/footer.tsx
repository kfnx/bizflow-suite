import { LanguageSelect } from '@/components/language-select';

export default function AuthFooter() {
  return (
    <div className='mx-auto flex w-full max-w-[1400px] items-center justify-between p-6'>
      <div className='text-paragraph-sm text-text-sub-600'>
        © 2025 PT San Traktor Indonesia
      </div>

      <LanguageSelect />
    </div>
  );
}

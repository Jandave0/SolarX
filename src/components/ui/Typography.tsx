import { Text, TextProps } from 'react-native';

const variants = {
  h1: 'text-[40px] leading-[48px] tracking-[-0.02em] text-on-surface',
  h2: 'text-[32px] leading-[40px] tracking-[-0.01em] text-on-surface',
  h3: 'text-[24px] leading-[32px] text-on-surface',
  'body-lg': 'text-[18px] leading-[28px] text-on-surface',
  'body-md': 'text-[16px] leading-[24px] text-on-surface',
  body: 'text-[16px] leading-[24px] text-on-surface',
  caption: 'text-[12px] leading-[16px] text-on-surface',
  button: 'text-[16px] leading-[20px] tracking-[0.02em]',
  label: 'text-[12px] leading-[16px] tracking-[0.05em] uppercase',
  'label-caps': 'text-[12px] leading-[16px] tracking-[0.05em] uppercase',
};

export interface TypographyProps extends TextProps {
  variant?: keyof typeof variants;
  className?: string;
}

export function Typography({ variant = 'body-md', className = '', style, ...props }: TypographyProps) {
  // Using explicit fontFamily inline to guarantee it works perfectly in React Native 
  // with custom loaded fonts.
  const getFontFamily = (v: keyof typeof variants) => {
    if (v.includes('h') || v === 'button' || v.includes('label')) return 'Outfit-Bold';
    return 'Plus Jakarta Sans';
  };

  return (
    <Text 
      className={`${variants[variant]} ${className}`} 
      style={[{ fontFamily: getFontFamily(variant) }, style]}
      {...props} 
    />
  );
}

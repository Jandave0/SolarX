import { View, ViewProps } from 'react-native';

export function Card({ className = '', ...props }: ViewProps) {
  return (
    <View 
      className={`bg-[#24242C] rounded-[24px] border border-white/5 p-6 ${className}`} 
      {...props} 
    />
  );
}

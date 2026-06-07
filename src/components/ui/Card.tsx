import { ViewProps, Pressable, PressableProps } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: PressableProps['onPress'];
  children?: React.ReactNode;
}

export function Card({ className = '', onPress, children, style, ...props }: CardProps) {
  return (
    <Pressable 
      accessibilityRole={onPress ? 'button' : 'none'}
      onPress={onPress}
      disabled={!onPress}
      // @ts-ignore - NativeWind style handling
      className={`bg-[#24242C] rounded-[24px] border border-white/5 p-6 ${className}`}
      style={style}
      {...props} 
    >
      {children}
    </Pressable>
  );
}

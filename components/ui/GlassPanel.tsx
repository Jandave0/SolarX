import { BlurView, BlurViewProps } from 'expo-blur';

export function GlassPanel({ className = '', intensity = 16, tint = 'dark', ...props }: BlurViewProps) {
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint}
      className={`rounded-[32px] border border-white/5 overflow-hidden ${className}`} 
      {...props} 
    />
  );
}

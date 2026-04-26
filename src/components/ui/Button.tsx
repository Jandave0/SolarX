import { TouchableOpacity, TouchableOpacityProps, View, ActivityIndicator } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'solid' | 'outline';
  title?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({ 
  variant = 'solid', 
  title, 
  loading, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const isSolid = variant === 'solid' || variant === 'primary';
  const isOutline = variant === 'outline' || variant === 'secondary';

  return (
    <TouchableOpacity
      disabled={loading || disabled}
      className={`rounded-2xl px-6 py-4 flex-row items-center justify-center gap-2 ${
        isSolid ? 'bg-primary-container' : 'bg-transparent border border-white/10'
      } ${(loading || disabled) ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? '#000' : '#ffb703'} size="small" />
      ) : null}
      
      <Typography 
        variant="button" 
        className={isSolid ? 'text-on-primary-container font-bold' : 'text-primary-container font-bold'}
      >
        {children || title}
      </Typography>
    </TouchableOpacity>
  );
}

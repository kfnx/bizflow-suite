import { ScaleLoader } from 'react-spinners';

interface LoadingProps {
  size?: number;
  color?: string;
  className?: string;
}

export function Loading({
  size = 15,
  color = '#FF9147',
  className = '',
}: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <ScaleLoader color={color} />
    </div>
  );
}

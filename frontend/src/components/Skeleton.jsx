import './Skeleton.css';

export default function Skeleton({ width, height, borderRadius, className = '' }) {
  const style = {
    width: width || '100%',
    height: height || '1rem',
    borderRadius: borderRadius || '4px',
  };

  return <div className={`skeleton-loader ${className}`} style={style}></div>;
}

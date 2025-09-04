import React, { useCallback, useRef } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface SafeLinkProps extends LinkProps {
  throttleDelay?: number;
  children: React.ReactNode;
}

/**
 * A safer Link component that prevents rapid clicking and navigation issues
 */
export const SafeLink: React.FC<SafeLinkProps> = ({ 
  to, 
  throttleDelay = 300, 
  onClick, 
  children, 
  ...props 
}) => {
  const lastClickRef = useRef<number>(0);
  const lastPathRef = useRef<string>('');

  const handleClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const now = Date.now();
    const currentPath = typeof to === 'string' ? to : to.pathname || '';
    
    // Check if this is a rapid click to the same path
    if (currentPath === lastPathRef.current && now - lastClickRef.current < throttleDelay) {
      event.preventDefault();
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SafeLink] Rapid click prevented:', currentPath);
      }
      return;
    }

    // Check for extremely rapid clicking (any path)
    if (now - lastClickRef.current < 100) {
      event.preventDefault();
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SafeLink] Extremely rapid click prevented');
      }
      return;
    }

    // Update tracking
    lastClickRef.current = now;
    lastPathRef.current = currentPath;

    // Call original onClick if provided
    if (onClick) {
      onClick(event);
    }
  }, [to, throttleDelay, onClick]);

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

export default SafeLink;

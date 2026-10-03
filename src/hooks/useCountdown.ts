import { useEffect, useState } from 'react';

export default function useCountdown(target: string) {
  const calc = () => Math.max(0, new Date(target).getTime() - Date.now());
  const [ms, setMs] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setMs(calc()), 30000);
    return () => clearInterval(t);
  }, [target]);
  return { dias: Math.floor(ms / 86400000), horas: Math.floor(ms / 3600000) % 24, min: Math.floor(ms / 60000) % 60, ended: ms === 0 };
}

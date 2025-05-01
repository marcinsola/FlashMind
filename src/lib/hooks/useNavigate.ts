/**
 * Custom hook for handling navigation in Astro application
 * Uses window.location for client-side navigation
 */
export function useNavigate() {
  return (to: string) => {
    window.location.href = to;
  };
}

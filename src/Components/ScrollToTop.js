import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, [pathname]);

  return null; // Component này không render gì ra giao diện
}

export default ScrollToTop;

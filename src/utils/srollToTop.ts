export const scrollToTop = () => {
  if (window) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

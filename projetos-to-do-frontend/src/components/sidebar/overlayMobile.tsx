import { useSwipeable } from "react-swipeable";

type OverlayMobileProps = {
  onClose: () => void;
};

export function OverlayMobile({ onClose }: OverlayMobileProps) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onClose(),
    preventScrollOnSwipe: true,
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 z-30 md:hidden"
      {...handlers}
      onClick={onClose}
    />
  );
}

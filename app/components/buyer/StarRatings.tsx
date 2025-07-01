import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
const Star: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="relative w-5 h-5">
      <FaRegStar className="absolute clip text-gray-400 w-full h-full" />
      <FaStar className="text-amber-500 w-full h-full" style={{ clipPath: `inset(0 ${100 - percentage}% 0 0)` }} />
    </div>
  );
};
const StarRatings: React.FC<{ rating: number }> = ({ rating }) => {
  const stars: any[] = [];
  for (let i = 0; i < 5; i++) {
    const diff = rating - i;
    let fill = 0;
    if (diff >= 1) fill = 100;
    else if (diff > 0) fill = diff * 100;
    stars.push(<Star key={i} percentage={fill} />);
  }
  return (
    <div className="flex">
      {stars}&nbsp; {rating % 1 === 0 ? rating : rating.toFixed(1)}
    </div>
  );
};

export default StarRatings;

import React from "react";

export default function BrandLogo() {
  return (
    <div aria-label="Brand" role="img" style={{ display: 'inline-block' }}>
      <img
        src="/assets/buyagift-by-moonpig.png"
        alt="buyagift by moonpig"
        className="brand-logo"
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fallback === 'true') return;
          img.dataset.fallback = 'true';
          img.src = '/assets/buyagift-by-moonpig.svg';
        }}
      />
    </div>
  );
}


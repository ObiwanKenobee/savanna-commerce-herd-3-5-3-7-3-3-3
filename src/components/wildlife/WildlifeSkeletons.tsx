/**
 * 🦴 Wildlife-Themed Skeleton Screens
 * Animated placeholders shaped like African wildlife during loading
 */

import React from "react";
import "./skeleton-animations.css";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

// Acacia Tree Skeleton for Product Listings
export const AcaciaTreeSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "200px",
}) => (
  <div className={`acacia-skeleton ${className}`} style={{ width, height }}>
    <div className="acacia-trunk skeleton-shimmer" />
    <div className="acacia-canopy skeleton-shimmer" />
    <div className="acacia-branches">
      <div className="branch skeleton-shimmer" />
      <div className="branch skeleton-shimmer" />
      <div className="branch skeleton-shimmer" />
    </div>
  </div>
);

// Paw Print Skeleton for Navigation Buttons
export const PawPrintSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "40px",
  height = "40px",
}) => (
  <div className={`paw-skeleton ${className}`} style={{ width, height }}>
    <div className="paw-pad skeleton-shimmer" />
    <div className="paw-toes">
      <div className="toe skeleton-shimmer" />
      <div className="toe skeleton-shimmer" />
      <div className="toe skeleton-shimmer" />
      <div className="toe skeleton-shimmer" />
    </div>
  </div>
);

// Elephant Silhouette for Heavy Data Pages
export const ElephantSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "300px",
  height = "180px",
}) => (
  <div className={`elephant-skeleton ${className}`} style={{ width, height }}>
    <div className="elephant-body skeleton-shimmer" />
    <div className="elephant-head skeleton-shimmer" />
    <div className="elephant-trunk skeleton-shimmer" />
    <div className="elephant-legs">
      <div className="leg skeleton-shimmer" />
      <div className="leg skeleton-shimmer" />
      <div className="leg skeleton-shimmer" />
      <div className="leg skeleton-shimmer" />
    </div>
  </div>
);

// Cheetah Silhouette for Fast-Loading Components
export const CheetahSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "250px",
  height = "100px",
}) => (
  <div className={`cheetah-skeleton ${className}`} style={{ width, height }}>
    <div className="cheetah-body skeleton-shimmer" />
    <div className="cheetah-head skeleton-shimmer" />
    <div className="cheetah-tail skeleton-shimmer" />
    <div className="cheetah-spots">
      <div className="spot skeleton-shimmer" />
      <div className="spot skeleton-shimmer" />
      <div className="spot skeleton-shimmer" />
      <div className="spot skeleton-shimmer" />
    </div>
  </div>
);

// Hyena Silhouette for Error States
export const HyenaSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "200px",
  height = "120px",
}) => (
  <div className={`hyena-skeleton ${className}`} style={{ width, height }}>
    <div className="hyena-body skeleton-shimmer" />
    <div className="hyena-head skeleton-shimmer" />
    <div className="hyena-ears">
      <div className="ear skeleton-shimmer" />
      <div className="ear skeleton-shimmer" />
    </div>
    <div className="hyena-tail skeleton-shimmer" />
  </div>
);

// Baobab Tree Skeleton for Database Loading
export const BaobabSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "150px",
  height = "250px",
}) => (
  <div className={`baobab-skeleton ${className}`} style={{ width, height }}>
    <div className="baobab-trunk skeleton-shimmer" />
    <div className="baobab-roots">
      <div className="root skeleton-shimmer" />
      <div className="root skeleton-shimmer" />
      <div className="root skeleton-shimmer" />
    </div>
    <div className="baobab-crown skeleton-shimmer" />
  </div>
);

// Lion Mane Skeleton for Admin/Leadership Components
export const LionManeSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "180px",
  height = "180px",
}) => (
  <div className={`lion-skeleton ${className}`} style={{ width, height }}>
    <div className="lion-face skeleton-shimmer" />
    <div className="lion-mane skeleton-shimmer" />
    <div className="lion-eyes">
      <div className="eye skeleton-shimmer" />
      <div className="eye skeleton-shimmer" />
    </div>
    <div className="lion-nose skeleton-shimmer" />
  </div>
);

// Antelope Track Skeleton for Route Loading
export const AntelopeTrackSkeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "60px",
}) => (
  <div
    className={`antelope-track-skeleton ${className}`}
    style={{ width, height }}
  >
    <div className="track-path skeleton-shimmer" />
    <div className="hoof-prints">
      <div className="print skeleton-shimmer" />
      <div className="print skeleton-shimmer" />
      <div className="print skeleton-shimmer" />
      <div className="print skeleton-shimmer" />
    </div>
  </div>
);

// Composite Product Card Skeleton
export const ProductCardSkeleton: React.FC<{
  showImage?: boolean;
  showPrice?: boolean;
  showDescription?: boolean;
  variant?: "cheetah" | "elephant" | "tortoise";
}> = ({
  showImage = true,
  showPrice = true,
  showDescription = true,
  variant = "cheetah",
}) => (
  <div className={`product-card-skeleton ${variant}-speed`}>
    {showImage && (
      <div className="product-image-skeleton">
        <AcaciaTreeSkeleton height="150px" />
      </div>
    )}

    <div className="product-info-skeleton">
      <div
        className="skeleton-line skeleton-shimmer"
        style={{ width: "80%", height: "20px", marginBottom: "8px" }}
      />
      <div
        className="skeleton-line skeleton-shimmer"
        style={{ width: "60%", height: "16px", marginBottom: "8px" }}
      />

      {showPrice && (
        <div className="price-skeleton">
          <PawPrintSkeleton width="30px" height="30px" />
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "40%", height: "18px", marginLeft: "8px" }}
          />
        </div>
      )}

      {showDescription && (
        <div className="description-skeleton">
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "90%", height: "14px", marginBottom: "4px" }}
          />
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "70%", height: "14px", marginBottom: "4px" }}
          />
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "50%", height: "14px" }}
          />
        </div>
      )}
    </div>
  </div>
);

// Adaptive Skeleton that changes based on connection speed
export const AdaptiveSkeleton: React.FC<{
  connectionSpeed: "2g" | "3g" | "4g" | "slow-2g";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ connectionSpeed, children, fallback }) => {
  const isSlowConnection =
    connectionSpeed === "2g" || connectionSpeed === "slow-2g";

  if (isSlowConnection && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`adaptive-skeleton ${connectionSpeed}-skeleton`}>
      {children}
    </div>
  );
};

// Grid of Product Skeletons
export const ProductGridSkeleton: React.FC<{
  count?: number;
  columns?: number;
  variant?: "cheetah" | "elephant" | "tortoise";
}> = ({ count = 6, columns = 3, variant = "cheetah" }) => (
  <div
    className="product-grid-skeleton"
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "1rem",
      padding: "1rem",
    }}
  >
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton
        key={index}
        variant={variant}
        showImage={index % 2 === 0} // Alternate image loading for performance
      />
    ))}
  </div>
);

// Navigation Skeleton
export const NavigationSkeleton: React.FC = () => (
  <div className="navigation-skeleton">
    <div className="nav-brand-skeleton">
      <LionManeSkeleton width="40px" height="40px" />
      <div
        className="skeleton-line skeleton-shimmer"
        style={{ width: "120px", height: "24px", marginLeft: "12px" }}
      />
    </div>

    <div className="nav-items-skeleton">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="nav-item-skeleton">
          <PawPrintSkeleton width="20px" height="20px" />
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "60px", height: "16px", marginLeft: "8px" }}
          />
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton: React.FC = () => (
  <div className="dashboard-stats-skeleton">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="stat-card-skeleton">
        <CheetahSkeleton width="60px" height="40px" />
        <div className="stat-info">
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "80px", height: "24px", marginBottom: "4px" }}
          />
          <div
            className="skeleton-line skeleton-shimmer"
            style={{ width: "60px", height: "16px" }}
          />
        </div>
      </div>
    ))}
  </div>
);

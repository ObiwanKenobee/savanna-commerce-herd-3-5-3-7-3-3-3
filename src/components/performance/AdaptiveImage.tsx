/**
 * 🖼️ Adaptive Image Component
 * Network-aware image loading with wildlife placeholder system
 */

import React, { useState, useEffect, useRef } from "react";
import { usePerformanceOptimization } from "../../hooks/usePerformanceOptimization";
import {
  HyenaSkeleton,
  AcaciaTreeSkeleton,
  ElephantSkeleton,
} from "../wildlife/WildlifeSkeletons";

interface AdaptiveImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: "high" | "medium" | "low";
  placeholderType?: "hyena" | "acacia" | "elephant" | "none";
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  src,
  alt,
  width = "100%",
  height = "auto",
  className = "",
  priority = "medium",
  placeholderType = "acacia",
  fallbackSrc,
  onLoad,
  onError,
  style = {},
}) => {
  const [imageState, setImageState] = useState<"loading" | "loaded" | "error">(
    "loading",
  );
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const { getOptimalImageSrc, isSlowConnection, config } =
    usePerformanceOptimization();
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get optimized image source based on network conditions
  useEffect(() => {
    const optimizedSrc = getOptimalImageSrc(src);
    setCurrentSrc(optimizedSrc);
  }, [src, getOptimalImageSrc]);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!imgRef.current || priority === "high") return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin:
          config.imageQuality === "low"
            ? "200px"
            : config.imageQuality === "medium"
              ? "100px"
              : "50px",
      },
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, config.imageQuality]);

  // Load image immediately for high priority
  useEffect(() => {
    if (priority === "high") {
      loadImage();
    }
  }, [priority, currentSrc]);

  const loadImage = () => {
    if (!currentSrc) return;

    const img = new Image();

    img.onload = () => {
      setImageState("loaded");
      onLoad?.();
    };

    img.onerror = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
      setImageState("error");
      onError?.();
    };

    img.src = currentSrc;
  };

  // Render appropriate placeholder based on state and connection
  const renderPlaceholder = () => {
    if (placeholderType === "none") {
      return (
        <div
          className="image-placeholder-basic"
          style={{
            width,
            height,
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "0.9rem",
          }}
        >
          {imageState === "loading" ? "Loading..." : "Image unavailable"}
        </div>
      );
    }

    const placeholderProps = {
      width: typeof width === "number" ? `${width}px` : width,
      height: typeof height === "number" ? `${height}px` : height,
      className: `image-placeholder ${isSlowConnection ? "slow-connection" : ""}`,
    };

    switch (placeholderType) {
      case "hyena":
        return <HyenaSkeleton {...placeholderProps} />;
      case "elephant":
        return <ElephantSkeleton {...placeholderProps} />;
      case "acacia":
      default:
        return <AcaciaTreeSkeleton {...placeholderProps} />;
    }
  };

  // Render error state with wildlife theme
  const renderError = () => (
    <div
      className={`image-error wildlife-error ${className}`}
      style={{ width, height, ...style }}
    >
      <div className="error-content">
        <span className="error-icon">🦓</span>
        <p className="error-message">
          Image not found
          <br />
          <small>Picha haipatikani</small>
        </p>
        {fallbackSrc && (
          <button
            onClick={() => {
              setCurrentSrc(fallbackSrc);
              setImageState("loading");
              loadImage();
            }}
            className="retry-button"
          >
            Try again / Jaribu tena
          </button>
        )}
      </div>

      <style jsx>{`
        .image-error {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .error-content {
          z-index: 2;
        }

        .error-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .error-message {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .error-message small {
          font-style: italic;
          opacity: 0.8;
        }

        .retry-button {
          background: #ff6b35;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          transition: background 0.2s;
        }

        .retry-button:hover {
          background: #e55a2b;
        }

        .image-error::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(
              circle at 20% 30%,
              rgba(139, 125, 107, 0.1) 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at 70% 20%,
              rgba(139, 125, 107, 0.1) 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at 40% 70%,
              rgba(139, 125, 107, 0.1) 2px,
              transparent 2px
            );
          background-size: 40px 40px;
          opacity: 0.5;
          z-index: 1;
        }
      `}</style>
    </div>
  );

  if (imageState === "error") {
    return renderError();
  }

  if (imageState === "loading") {
    return renderPlaceholder();
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={`adaptive-image ${className} ${isSlowConnection ? "slow-connection" : ""}`}
      style={{
        ...style,
        transition: "opacity 0.3s ease-in-out",
        opacity: imageState === "loaded" ? 1 : 0,
      }}
      onLoad={() => {
        setImageState("loaded");
        onLoad?.();
      }}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        } else {
          setImageState("error");
          onError?.();
        }
      }}
      loading={priority === "high" ? "eager" : "lazy"}
      decoding="async"
    />
  );
};

export default AdaptiveImage;

// Helper component for image galleries with wildlife themes
export const WildlifeImageGallery: React.FC<{
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  columns?: number;
  priority?: "high" | "medium" | "low";
  placeholderType?: "hyena" | "acacia" | "elephant";
}> = ({
  images,
  columns = 3,
  priority = "low",
  placeholderType = "acacia",
}) => {
  const { isSlowConnection } = usePerformanceOptimization();

  // Reduce columns on slow connections
  const adaptiveColumns = isSlowConnection ? Math.min(columns, 2) : columns;

  return (
    <div
      className="wildlife-image-gallery"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${adaptiveColumns}, 1fr)`,
        gap: "1rem",
        padding: "1rem",
      }}
    >
      {images.map((image, index) => (
        <div key={index} className="gallery-item">
          <AdaptiveImage
            src={image.src}
            alt={image.alt}
            priority={index < 3 ? "high" : priority}
            placeholderType={placeholderType}
            className="gallery-image"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          {image.caption && (
            <p
              className="image-caption"
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.9rem",
                color: "#666",
                textAlign: "center",
              }}
            >
              {image.caption}
            </p>
          )}
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 768px) {
          .wildlife-image-gallery {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
        }

        @media (max-width: 480px) {
          .wildlife-image-gallery {
            grid-template-columns: 1fr !important;
          }
        }

        .gallery-image {
          transition: transform 0.2s ease;
        }

        .gallery-image:hover {
          transform: scale(1.02);
        }

        .slow-connection .gallery-image:hover {
          transform: none;
        }
      `}</style>
    </div>
  );
};

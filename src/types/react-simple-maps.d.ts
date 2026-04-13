declare module "react-simple-maps" {
  import { ComponentType, ReactNode, SVGProps, MouseEvent } from "react";

  export interface ProjectionConfig {
    center?: [number, number];
    scale?: number;
    rotate?: [number, number, number];
    parallels?: [number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    viewBox?: string;
    style?: React.CSSProperties;
    className?: string;
    children?: ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    properties: Record<string, string>;
    geometry: { type: string; coordinates: unknown };
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (args: { geographies: Geography[] }) => ReactNode;
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: (event: MouseEvent<SVGGElement>) => void;
    className?: string;
    style?: React.CSSProperties;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
  export const ZoomableGroup: ComponentType<{
    center?: [number, number];
    zoom?: number;
    children?: ReactNode;
  }>;
  export const Sphere: ComponentType<SVGProps<SVGPathElement>>;
  export const Graticule: ComponentType<SVGProps<SVGPathElement>>;
  export const Line: ComponentType<{
    from: [number, number];
    to: [number, number];
    coordinates?: [number, number][];
  } & SVGProps<SVGPathElement>>;
}

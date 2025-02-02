declare module "@daniel-szulc/react-weather-widget" {
  import { ComponentType } from "react";

  // Define the props for the WeatherWidget component (adjust this based on the actual props of the widget)
  export interface WeatherWidgetProps {
    apiKey?: string; // Example prop, you should adjust based on actual props
    city?: string; // Example prop, you should adjust based on actual props
    units?: "metric" | "imperial"; // Example optional prop, adjust accordingly
    theme?: "light" | "dark"; // Example optional prop, adjust accordingly
    autoLocate?: string;
    tempUnit?: string;
    windSpeedUnit?: string;
    // Add any other props that the WeatherWidget component accepts
  }

  // Export the WeatherWidget component as a functional component
  const WeatherWidget: ComponentType<WeatherWidgetProps>;

  export { WeatherWidget };
}

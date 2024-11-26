import { Loader } from "@googlemaps/js-api-loader";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyC9LbUZBNFyfNNz1lF6UayhyjsPgbRy5_I";

export type MapContextVal = {
  autocompleteService?: google.maps.places.AutocompleteService;

  placesService?: google.maps.places.PlacesService;

  directionsService?: google.maps.DirectionsService;

  directionsRenderer?: google.maps.DirectionsRenderer;

  assets?: google.maps.Marker[];

  // directionPath?: google.maps.Polyline;

  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentLocation?: { lat: any; lng: any };
  servicesLoaded: boolean;
  AdvancedMarkerElement?: typeof google.maps.marker.AdvancedMarkerElement;
};
interface MapContext {
  mapContext?: MapContextVal;
  updateMapContext?: Dispatch<SetStateAction<MapContextVal>>;
  map?: google.maps.Map;
  setMap?: Dispatch<SetStateAction<google.maps.Map | undefined>>;
}
export const MapContext = createContext<MapContext>({});

type Props = {
  children: ReactNode | ReactNode[];
};

const MapProvider: FC<Props> = ({ children }) => {
  const [mapContext, updateMapContext] = useState<MapContextVal>({
    servicesLoaded: false,
  });
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    console.log("loading map");

    const region = "ke";
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
      region,
    });

    loader
      .load()
      .then(async (google) => {
        try {
          //places
          const { AutocompleteService, PlacesService } =
            (await google.maps.importLibrary(
              "places"
            )) as google.maps.PlacesLibrary;
          const { AdvancedMarkerElement } = (await google.maps.importLibrary(
            "marker"

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          )) as any;
          const autocompleteService = new AutocompleteService();
          const div = document.createElement("div");
          div.setAttribute("id", "places-div");
          const placesService = new PlacesService(div);

          //Directions
          const { DirectionsRenderer, DirectionsService } =
            (await google.maps.importLibrary(
              "routes"
            )) as google.maps.RoutesLibrary;

          const directionsRenderer = new DirectionsRenderer();
          const directionsService = new DirectionsService();

          //position
          let currentPos:
            | (GeolocationPosition & { address?: string })
            | undefined;
          try {
            currentPos = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    resolve(pos);
                  },
                  (err) => {
                    reject(err);
                  },
                  {
                    timeout: 10000,
                  }
                );
              }
            );
          } catch (err) {
            console.error(err);
          }

          directionsRenderer.setOptions({
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: "black",
              strokeWeight: 0,
            },
          });

          // Disable map controls

          updateMapContext!((prev) => ({
            ...prev,
            autocompleteService,
            placesService,
            directionsRenderer,
            directionsService,
            currentLocation: {
              lat: currentPos?.coords?.latitude,
              lng: currentPos?.coords?.longitude,
            },
            AdvancedMarkerElement,
            servicesLoaded: true,
          }));
        } catch (err) {
          console.error(err);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <MapContext.Provider
      value={{
        mapContext,
        updateMapContext,
        map,
        setMap,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
export default MapProvider;

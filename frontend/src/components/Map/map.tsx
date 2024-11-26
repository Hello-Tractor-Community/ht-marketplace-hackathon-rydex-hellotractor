import { FC, useContext, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { MapContext } from "../../context/MapContext";

/*
function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);

  async function initMap() {
    try {
      window.autocompleteService = new google.maps.places.AutocompleteService();
      let div = document.createElement("div");
      div.setAttribute("id", "places-div");
      window.placesService = new google.maps.places.PlacesService(div);
      let currentPos: any;
      let gotPosition = false;

      if (!window.currentLocation && !window.Ayoba) {
        try {
          currentPos = await getLocation();

          window.currentLocation = {
            lat: currentPos.coords?.latitude ?? -1.2833,
            lng: currentPos.coords?.longitude ?? 36.8166,
          };
          gotPosition = true;
        } catch (err) {
          currentPos = {
            coords: {
              latitude: -1.2833,
              longitude: 36.8166,
            },
          };

          gotPosition = false;
        }
      } else {
        currentPos = {
          coords: {
            latitude: -1.2833,
            longitude: 36.8166,
          },
        };

        gotPosition = false;
      }

      window.directionsService = new google.maps.DirectionsService();
      window.directionsRenderer = new google.maps.DirectionsRenderer();

      window.map = new google.maps.Map(document.getElementById("map")!, {
        zoom: gotPosition ? 15 : 4,
        center: {
          lat: currentPos.coords.latitude,
          lng: currentPos.coords.longitude,
        },
      });

      window.directionsRenderer.setMap(window.map);
      window.directionsRenderer.setOptions({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "black",
        },
      });
      // The marker, positioned at Uluru
      // const marker = new (window as any).google.maps.Marker({
      //   position: uluru,
      //   map: map,
      // });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }
  window.initMap = initMap;
}
*/

type Props = {
  defaultPos?: google.maps.LatLngLiteral;
};
const GoogleMap: FC<Props> = () => {
  const { mapContext, setMap } = useContext(MapContext);

  useEffect(() => {
    (async () => {
      if (mapContext?.servicesLoaded) {
        const { directionsRenderer } = mapContext;
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;

        const map = new Map(document.getElementById("map") as HTMLElement, {
          zoom: 15,
          // zoom: currentLocation ? 15 : 4,
          // center: {
          //   lat: currentLocation?.lat ?? -1.2833,
          //   lng: currentLocation?.lng ?? 36.8166,
          // },
          mapId: "f1b7b3b3b1b7b3b3",
        });
        map.setOptions({
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        });

        directionsRenderer?.setMap(map);

        setMap?.(map);
        console.log("Map loaded");
      }
    })();
  }, [mapContext, setMap]);

  return (
    <Box
      id="map"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography>Loading map...</Typography>
    </Box>
  );
};

export default GoogleMap;

import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { getRegions, getDealerTypes } from "../api/stores/getStores";

type MiscContextType = {
  regions: string[];
  dealerTypes: string[];
};

export const MiscContext = createContext<MiscContextType>({
  regions: [],
  dealerTypes: [],
});

type Props = {
  children: ReactNode;
};

const MiscProvider: FC<Props> = ({ children }) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [dealerTypes, setDealerTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMiscData = async () => {
      const fetchedRegions = await getRegions();
      const fetchedDealerTypes = await getDealerTypes();
      setRegions(fetchedRegions);
      setDealerTypes(fetchedDealerTypes);
    };

    fetchMiscData();
  }, []);

  return (
    <MiscContext.Provider value={{ regions, dealerTypes }}>
      {children}
    </MiscContext.Provider>
  );
};

export default MiscProvider;

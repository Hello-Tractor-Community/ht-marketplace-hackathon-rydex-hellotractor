import { useContext, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import { NavContext } from "../../../context/NavContext";
import { sellerStoreNavMenu } from "../../../navigation/navMenu";

const StorePageLayout = () => {
  const { setNavMenu } = useContext(NavContext);
  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    setNavMenu(sellerStoreNavMenu(id));
  }, [setNavMenu, id]);
  return <Outlet />;
};

export default StorePageLayout;

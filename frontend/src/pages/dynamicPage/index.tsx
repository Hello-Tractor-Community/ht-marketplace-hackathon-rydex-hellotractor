import { FC } from "react";
import { useParams } from "react-router-dom";
import DynamicComponentLoader from "../../components/DynamicComponentLoader/DynamicComponentLoader";

const DynamicPage: FC = () => {
  const { id, name } = useParams();

  return (
    <DynamicComponentLoader
      url={`${import.meta.env.VITE_API_URL}/plugins/frontend/${id}`}
      componentName={name}
    />
  );
};

export default DynamicPage;
